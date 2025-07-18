const mongoose = require('mongoose');

const vectorChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: [true, 'Document ID is required'],
  },
  chunkIndex: {
    type: Number,
    required: [true, 'Chunk index is required'],
  },
  content: {
    type: String,
    required: [true, 'Chunk content is required'],
  },
  embedding: {
    type: [Number],
    required: [true, 'Embedding vector is required'],
  },
  metadata: {
    pageNumber: Number,
    startChar: Number,
    endChar: Number,
    section: String,
    heading: String,
  },
  tokens: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Index for vector similarity search
vectorChunkSchema.index({ embedding: '2dsphere' });
vectorChunkSchema.index({ documentId: 1, chunkIndex: 1 });

module.exports = mongoose.model('VectorChunk', vectorChunkSchema); 