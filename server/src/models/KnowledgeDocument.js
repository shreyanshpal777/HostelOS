import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embeddingProvider: { type: String, default: 'gemini' },
    embeddingModel: String,
    vectorId: String,
    metadata: {
      page: Number,
      section: String
    }
  },
  { _id: false }
);

const knowledgeDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    sourceType: { type: String, enum: ['pdf', 'notice', 'manual_text', 'url'], required: true },
    sourceUrl: { type: String, trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['uploaded', 'processing', 'indexed', 'failed'], default: 'uploaded' },
    textPreview: String,
    chunks: [chunkSchema],
    vectorNamespace: { type: String, default: 'hostel-docs' },
    failureReason: String
  },
  { timestamps: true }
);

knowledgeDocumentSchema.index({ title: 'text', textPreview: 'text', 'chunks.text': 'text' });

export const KnowledgeDocument = mongoose.model('KnowledgeDocument', knowledgeDocumentSchema);
