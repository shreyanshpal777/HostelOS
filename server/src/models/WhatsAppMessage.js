import mongoose from 'mongoose';

const whatsAppMessageSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    toNumber: { type: String, required: true, trim: true, index: true },
    messageType: {
      type: String,
      enum: ['birthday', 'task_assignment', 'task_reminder', 'broadcast', 'bot_reply', 'special_wish'],
      required: true,
      index: true
    },
    body: { type: String, trim: true },
    templateName: { type: String, trim: true },
    provider: { type: String, enum: ['meta', 'twilio', 'disabled'], default: 'meta' },
    providerMessageId: { type: String, trim: true },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: {
      type: String,
      enum: ['queued', 'sent', 'delivered', 'read', 'failed', 'skipped'],
      default: 'queued',
      index: true
    },
    failureReason: String,
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date
  },
  { timestamps: true }
);

whatsAppMessageSchema.index({ createdAt: -1, status: 1 });

export const WhatsAppMessage = mongoose.model('WhatsAppMessage', whatsAppMessageSchema);
