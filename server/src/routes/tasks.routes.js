import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from './auth.routes.js';
import { requireRole } from '../middleware/role.js';

export const tasksRouter = Router();

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid MongoDB ObjectId');

const createTaskSchema = z.object({
  title: z.string().min(3).trim(),
  description: z.string().optional().default(''),
  assignedToUsers: z.array(objectIdSchema).optional().default([]),
  assignedToFloors: z.array(z.coerce.number().int()).optional().default([]),
  assignedToRooms: z.array(z.string().trim()).optional().default([]),
  category: z.enum(['maintenance', 'education', 'cleaning', 'mess', 'utility', 'event', 'admin', 'other']).default('other'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  tags: z.array(z.string().trim()).optional().default([]),
  dueAt: z.preprocess((val) => (val === '' || val == null ? undefined : val), z.coerce.date().optional())
});

// Require authentication for all task routes
tasksRouter.use(requireAuth);

// Create task: allowed for admin, leader, co_leader, and students
tasksRouter.post(
  '/',
  requireRole(['admin', 'leader', 'co_leader', 'student']),
  asyncHandler(async (req, res) => {
    const input = createTaskSchema.parse(req.body);
    const task = new Task({
      ...input,
      createdBy: req.auth.userId,
      status: 'assigned' // Default to assigned
    });
    await task.save();
    res.status(201).json({ success: true, data: task });
  })
);

// List tasks
tasksRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { role, userId } = req.auth;
    let query = {};

    // If the user is a normal student, they should only see tasks assigned to them, their room, or their floor.
    if (role === 'student') {
      const User = mongoose.model('User');
      const student = await User.findById(userId).lean();
      if (student) {
        query.$or = [
          { assignedToUsers: userId },
          { assignedToFloors: student.floor },
          { assignedToRooms: student.roomNumber }
        ];
      } else {
        query.assignedToUsers = userId;
      }
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email avatarUrl')
      .populate('assignedToUsers', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: tasks });
  })
);

// Update task status: restricted to admin, leader, co_leader
tasksRouter.patch(
  '/:id/status',
  requireRole(['admin', 'leader', 'co_leader']),
  asyncHandler(async (req, res) => {
    const { status } = z.object({
      status: z.enum(['draft', 'assigned', 'in_progress', 'pending', 'submitted', 'verified', 'completed', 'resolved', 'overdue', 'cancelled'])
    }).parse(req.body);
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    task.status = status;
    await task.save();
    res.json({ success: true, data: task });
  })
);
