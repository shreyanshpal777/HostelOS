import mongoose from 'mongoose';

const leadershipAssignmentSchema = new mongoose.Schema(
  {
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    floor: { type: Number, required: true, index: true },
    rooms: [{ type: String, trim: true }],
    permissions: [
      {
        type: String,
        enum: ['manage_users', 'assign_tasks', 'send_messages', 'review_complaints', 'manage_resources']
      }
    ],
    activeFrom: { type: Date, default: Date.now },
    activeUntil: Date,
    status: { type: String, enum: ['active', 'paused', 'ended'], default: 'active', index: true }
  },
  { timestamps: true }
);

leadershipAssignmentSchema.index({ coLeader: 1, floor: 1, status: 1 });

export const LeadershipAssignment = mongoose.model('LeadershipAssignment', leadershipAssignmentSchema);
