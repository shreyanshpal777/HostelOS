import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['water', 'electricity', 'mess', 'maintenance', 'noise', 'cleaning', 'safety', 'other'],
      default: 'other',
      index: true
    },
    floor: { type: Number, index: true },
    roomNumber: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: ['open', 'acknowledged', 'in_progress', 'resolved', 'rejected'],
      default: 'open',
      index: true
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ai: {
      sentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'high_tension'] },
      urgencyScore: { type: Number, min: 0, max: 1 },
      recurringTopicKey: { type: String, trim: true },
      flagged: { type: Boolean, default: false },
      rationale: String
    },
    resolutionNotes: { type: String, trim: true },
    resolvedAt: Date
  },
  { timestamps: true }
);

complaintSchema.index({ createdAt: -1, category: 1, floor: 1 });
complaintSchema.index({ title: 'text', description: 'text' });

export const Complaint = mongoose.model('Complaint', complaintSchema);
