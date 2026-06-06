import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedToUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    assignedToFloors: [{ type: Number, index: true }],
    assignedToRooms: [{ type: String, trim: true, index: true }],
    suggestedCoLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acceptedByCoLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      enum: ['maintenance', 'education', 'cleaning', 'mess', 'utility', 'event', 'admin', 'other'],
      default: 'other',
      index: true
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    ai: {
      categorized: { type: Boolean, default: false },
      confidence: { type: Number, min: 0, max: 1 },
      rationale: { type: String, trim: true }
    },
    status: {
      type: String,
      enum: ['draft', 'assigned', 'in_progress', 'submitted', 'verified', 'overdue', 'cancelled'],
      default: 'draft',
      index: true
    },
    dueAt: { type: Date, index: true },
    reminderSentAt: Date,
    finalReminderSentAt: Date,
    completionNotes: { type: String, trim: true },
    attachments: [
      {
        url: String,
        type: String,
        name: String
      }
    ]
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Task = mongoose.model('Task', taskSchema);
