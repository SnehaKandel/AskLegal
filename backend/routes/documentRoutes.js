const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { protect, authorize } = require('../middlewares/auth');
const {
  uploadDocument,
  uploadMultipleDocuments,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentStatus
} = require('../controllers/documentController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files at once
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
router.post('/upload', protect, authorize('admin'), upload.single('pdf'), uploadDocument);
router.post('/upload-multiple', protect, authorize('admin'), upload.array('pdfs', 10), uploadMultipleDocuments);
router.get('/', protect, getAllDocuments);
router.get('/:id', protect, getDocumentById);
router.put('/:id', protect, authorize('admin'), updateDocument);
router.delete('/:id', protect, authorize('admin'), deleteDocument);
router.get('/:id/status', protect, getDocumentStatus);

module.exports = router; 