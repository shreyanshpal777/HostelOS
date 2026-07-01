import mongoose from 'mongoose';

const rulebookChunkSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    pageNumber: { type: Number },
    chunkIndex: { type: Number, required: true }
  },
  { timestamps: true }
);

// We can define a vector index for MongoDB Atlas Vector Search
// In Atlas, this index would be named "vector_index" on the "rulebookchunks" collection, with path "embedding" and dimensions 1536/768.
export const RulebookChunk = mongoose.model('RulebookChunk', rulebookChunkSchema);
