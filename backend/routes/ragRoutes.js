const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getRAGStatus,
  searchDocuments,
  generateResponse,
  chat,
  getModels
} = require('../controllers/ragController');

const router = express.Router();

// RAG routes
router.get('/status', protect, getRAGStatus);
router.get('/search', protect, searchDocuments);
router.post('/generate', protect, generateResponse);
router.post('/chat', protect, chat);
router.get('/models', protect, getModels);

module.exports = router; 