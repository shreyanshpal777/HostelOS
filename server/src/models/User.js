import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const guardianSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relation: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      unique: true,
      validate: {
        validator: (value) => !value || validator.isEmail(value),
        message: 'Invalid email address'
      }
    },
    passwordHash: { type: String, select: false },
    providerIds: {
      google: { type: String },
      github: { type: String }
    },
    authProviders: [{ type: String, enum: ['local', 'google', 'github'] }],
    avatarUrl: { type: String, trim: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    whatsappNumber: { type: String, trim: true, index: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
    roomNumber: { type: String, trim: true, index: true },
    floor: { type: Number, index: true },
    bedNumber: { type: String, trim: true },
    branch: { type: String, trim: true, index: true },
    year: { type: String, trim: true },
    interests: [{ type: String, trim: true, lowercase: true }],
    guardian: guardianSchema,
    role: {
      type: String,
      enum: ['student', 'co_leader', 'leader', 'admin'],
      default: 'student',
      index: true
    },
    leadershipScope: {
      floors: [{ type: Number }],
      rooms: [{ type: String, trim: true }]
    },
    isActive: { type: Boolean, default: true, index: true },
    isActivated: { type: Boolean, default: false, index: true },
    activationOtp: { type: String },
    activationOtpExpiresAt: { type: Date },
    whatsappOptIn: { type: Boolean, default: true },
    importedBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'ImportBatch' },
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.index({ floor: 1, roomNumber: 1 });
userSchema.index({ 'providerIds.google': 1 }, { unique: true, sparse: true });
userSchema.index({ 'providerIds.github': 1 }, { unique: true, sparse: true });
userSchema.index({ name: 'text', roomNumber: 'text', branch: 'text' });

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = async function comparePassword(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
