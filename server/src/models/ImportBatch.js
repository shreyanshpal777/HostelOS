import mongoose from 'mongoose';

const importBatchSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    source: { type: String, enum: ['excel', 'csv'], default: 'excel' },
    totalRows: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    errors: [
      {
        row: Number,
        message: String
      }
    ],
    status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const ImportBatch = mongoose.model('ImportBatch', importBatchSchema);
