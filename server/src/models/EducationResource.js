import mongoose from 'mongoose';

const educationResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    url: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      enum: ['link', 'video', 'pdf', 'note', 'playlist', 'course'],
      default: 'link',
      index: true
    },
    branch: { type: String, trim: true, index: true },
    subjects: [{ type: String, trim: true, lowercase: true, index: true }],
    targetFloors: [{ type: Number }],
    targetRooms: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true, lowercase: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ai: {
      summary: String,
      recommendedTags: [{ type: String, trim: true, lowercase: true }],
      embeddingId: String
    },
    isPublished: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

educationResourceSchema.index({ title: 'text', description: 'text', subjects: 'text' });

export const EducationResource = mongoose.model('EducationResource', educationResourceSchema);
