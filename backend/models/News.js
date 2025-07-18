const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  publishedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  summary: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'ne'
    // Removed enum validation temporarily
  },
  imageUrl: String
}, {
  timestamps: true,
  strict: false // Allow additional fields
});

// Create the model
const News = mongoose.model('News', newsSchema);

module.exports = News;