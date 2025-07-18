const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  mimeType: {
    type: String,
    default: 'application/pdf',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required'],
  },
  status: {
    type: String,
    enum: ['processing', 'processed', 'error'],
    default: 'processing',
  },
  processingError: {
    type: String,
    default: null,
  },
  totalChunks: {
    type: Number,
    default: 0,
  },
  processedChunks: {
    type: Number,
    default: 0,
  },
  metadata: {
    pages: Number,
    textLength: Number,
    language: String,
    category: String,
    tags: [String],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  accessLevel: {
    type: String,
    enum: ['public', 'private', 'admin'],
    default: 'public',
  }
}, {
  timestamps: true,
});

// Index for search functionality
documentSchema.index({ title: 'text', 'metadata.tags': 'text' });

module.exports = mongoose.model('Document', documentSchema); 