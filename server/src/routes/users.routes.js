import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { ImportBatch } from '../models/ImportBatch.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from './auth.routes.js';
import { requireRole } from '../middleware/role.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);
const roles = ['student', 'co_leader', 'leader', 'admin'];
const text = z.preprocess((v) => (v === '' || v == null ? undefined : String(v).trim()), z.string().optional());
const objectId = z.string().refine(mongoose.Types.ObjectId.isValid, 'Invalid MongoDB ObjectId');
const fields = {
  name: z.preprocess((v) => String(v ?? '').trim(), z.string().min(2)),
  email: z.preprocess((v) => (v === '' || v == null ? undefined : String(v).trim().toLowerCase()), z.string().email().optional()),
  phone: z.preprocess((v) => String(v ?? '').trim(), z.string().min(6)),
  whatsappNumber: z.preprocess((v) => String(v ?? '').trim(), z.string().min(6)),
  dateOfBirth: z.preprocess((v) => (v === '' || v == null ? undefined : v), z.coerce.date().optional()),
  gender: z.preprocess((v) => (v === '' || v == null ? undefined : String(v).toLowerCase()), z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional()),
  roomNumber: z.preprocess((v) => String(v ?? '').trim(), z.string().min(1)),
  floor: z.coerce.number().int(), bedNumber: text, branch: text, year: text,
  interests: z.preprocess((v) => (Array.isArray(v) ? v : String(v ?? '').split(',')).map((x) => String(x).trim().toLowerCase()).filter(Boolean), z.array(z.string()).default([])),
  role: z.preprocess((v) => (v === '' || v == null ? 'student' : String(v).toLowerCase()), z.enum(roles).default('student')),
  isActive: z.boolean().default(true), whatsappOptIn: z.boolean().default(true),
  guardian: z.object({ name: text, phone: text, relation: text }).optional()
};
const createSchema = z.object({ ...fields, password: z.string().min(8).optional() });
const updateSchema = z.object(fields).partial().extend({ password: z.string().min(8).optional() });
const listSchema = z.object({
  search: text, roomNumber: text, floor: z.coerce.number().int().optional(), branch: text, role: z.enum(roles).optional(),
  isActive: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['name', 'roomNumber', 'floor', 'branch', 'role', 'createdAt']).default('name'), sortOrder: z.enum(['asc', 'desc']).default('asc')
});
const upload = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = /\.(xlsx|xls|csv)$/i.test(file.originalname);
    cb(allowed ? null : Object.assign(new Error('Only .xlsx, .xls, and .csv files are supported'), { statusCode: 400 }), allowed);
  }
});
const aliases = {
  name: ['name', 'fullname', 'studentname'], email: ['email', 'emailaddress'], phone: ['phone', 'phonenumber', 'mobile', 'mobilenumber'],
  whatsappNumber: ['whatsapp', 'whatsappnumber', 'whatsappno'], dateOfBirth: ['dateofbirth', 'dob', 'birthday'], gender: ['gender'],
  roomNumber: ['room', 'roomnumber', 'roomno'], floor: ['floor', 'floornumber', 'floorno'], bedNumber: ['bed', 'bednumber', 'bedno'],
  branch: ['branch', 'department', 'course'], year: ['year', 'academicyear'], interests: ['interests', 'interest'], role: ['role'],
  guardianName: ['guardianname', 'parentname'], guardianPhone: ['guardianphone', 'parentphone'], guardianRelation: ['guardianrelation', 'relation']
};
function escapeRegex(v) { return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function cell(row, field) {
  return Object.entries(row).find(([key]) => aliases[field].includes(String(key).toLowerCase().replace(/[^a-z0-9]/g, '')))?.[1];
}
function rowData(row) {
  const phone = cell(row, 'phone');
  const guardian = { name: cell(row, 'guardianName'), phone: cell(row, 'guardianPhone'), relation: cell(row, 'guardianRelation') };
  return {
    name: cell(row, 'name'), email: cell(row, 'email'), phone, whatsappNumber: cell(row, 'whatsappNumber') || phone,
    dateOfBirth: cell(row, 'dateOfBirth'), gender: cell(row, 'gender'), roomNumber: cell(row, 'roomNumber'), floor: cell(row, 'floor'),
    bedNumber: cell(row, 'bedNumber'), branch: cell(row, 'branch'), year: cell(row, 'year'), interests: cell(row, 'interests'),
    role: cell(row, 'role'), guardian: Object.values(guardian).some(Boolean) ? guardian : undefined
  };
}
async function saveUser(input, importedBatchId) {
  const { password, ...data } = input;
  const user = new User({ ...data, importedBatchId });
  if (password) {
    await user.setPassword(password);
    user.isActivated = true;
  } else {
    user.isActivated = false;
  }
  return user.save();
}
function notFound() { return Object.assign(new Error('User not found'), { statusCode: 404 }); }

usersRouter.get('/imports', requireRole(['admin', 'leader', 'co_leader']), asyncHandler(async (req, res) => {
  res.json({ success: true, data: await ImportBatch.find().sort({ createdAt: -1 }).limit(50).lean() });
}));
usersRouter.post('/import', requireRole(['admin', 'leader', 'co_leader']), upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) throw Object.assign(new Error('Excel or CSV file is required in the file field'), { statusCode: 400 });
  const uploadedBy = req.body.uploadedBy ? objectId.parse(req.body.uploadedBy) : req.auth.userId;
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = sheet ? XLSX.utils.sheet_to_json(sheet, { defval: '' }) : [];
  if (!rows.length) throw Object.assign(new Error('The uploaded file contains no data rows'), { statusCode: 400 });
  const batch = await ImportBatch.create({ uploadedBy, fileName: req.file.originalname, source: /\.csv$/i.test(req.file.originalname) ? 'csv' : 'excel', totalRows: rows.length });
  const errors = []; let successCount = 0;
  for (const [index, row] of rows.entries()) {
    try { await saveUser(createSchema.parse(rowData(row)), batch._id); successCount += 1; }
    catch (error) {
      let message = error.message;
      if (error.code === 11000) message = `Duplicate ${Object.keys(error.keyPattern || {})[0] || 'unique value'}`;
      if (error instanceof z.ZodError) message = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      errors.push({ row: index + 2, message });
    }
  }
  Object.assign(batch, { successCount, failedCount: errors.length, errors: errors.slice(0, 200), status: 'completed' });
  await batch.save();
  res.status(201).json({ success: true, data: batch });
}));
usersRouter.post('/', requireRole(['admin', 'leader', 'co_leader']), asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await saveUser(createSchema.parse(req.body)) });
}));
usersRouter.get('/', asyncHandler(async (req, res) => {
  const input = listSchema.parse(req.query); const query = {};
  if (input.search) { const rx = new RegExp(escapeRegex(input.search), 'i'); query.$or = [{ name: rx }, { roomNumber: rx }, { phone: rx }, { email: rx }, { branch: rx }]; }
  if (input.roomNumber) query.roomNumber = input.roomNumber;
  if (input.floor !== undefined) query.floor = input.floor;
  if (input.branch) query.branch = new RegExp(`^${escapeRegex(input.branch)}$`, 'i');
  if (input.role) query.role = input.role;
  if (input.isActive !== undefined) query.isActive = input.isActive;
  const skip = (input.page - 1) * input.limit; const sort = { [input.sortBy]: input.sortOrder === 'asc' ? 1 : -1 };
  const [users, total] = await Promise.all([User.find(query).sort(sort).skip(skip).limit(input.limit).lean(), User.countDocuments(query)]);
  res.json({ success: true, data: users, pagination: { page: input.page, limit: input.limit, total, pages: Math.ceil(total / input.limit) } });
}));
usersRouter.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(objectId.parse(req.params.id)).lean(); if (!user) throw notFound();
  res.json({ success: true, data: user });
}));
usersRouter.patch('/:id', asyncHandler(async (req, res) => {
  if (req.auth.role !== 'admin' && req.auth.userId !== req.params.id) {
    return res.status(403).json({ success: false, message: 'You can only update your own profile' });
  }
  const { password, ...updates } = updateSchema.parse(req.body);
  if (updates.role && req.auth.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only admins can modify user roles' });
  }
  const user = await User.findById(objectId.parse(req.params.id)); if (!user) throw notFound();
  Object.assign(user, updates); if (password) await user.setPassword(password); await user.save();
  res.json({ success: true, data: user });
}));
usersRouter.patch('/:id/role', requireRole(['admin']), asyncHandler(async (req, res) => {
  const { role } = z.object({ role: z.enum(['student', 'co_leader', 'leader', 'admin']) }).parse(req.body);
  const user = await User.findById(objectId.parse(req.params.id));
  if (!user) throw notFound();
  user.role = role;
  await user.save();
  res.json({ success: true, data: user });
}));
usersRouter.delete('/:id', requireRole(['admin']), asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(objectId.parse(req.params.id), { isActive: false }, { new: true }).lean(); if (!user) throw notFound();
  res.json({ success: true, data: user, message: 'User deactivated' });
}));