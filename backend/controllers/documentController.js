const Document = require('../models/Document');
const pdfProcessor = require('../services/pdfProcessor');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// @desc    Upload PDF document
// @route   POST /api/documents/upload
// @access  Private/Admin
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    const { title, isPublic = true, accessLevel = 'public' } = req.body;
    const uploadedBy = req.user.userId;

    // Validate file type
    if (req.file.mimetype !== 'application/pdf') {
      // Delete uploaded file
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.warn(`Could not delete invalid file: ${unlinkError.message}`);
      }
      return res.status(400).json({ 
        success: false,
        message: 'Only PDF files are allowed' 
      });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.warn(`Could not delete oversized file: ${unlinkError.message}`);
      }
      return res.status(400).json({ 
        success: false,
        message: 'File size must be less than 10MB' 
      });
    }

    // Create document record
    const document = new Document({
      title: title || req.file.originalname,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedBy: uploadedBy,
      status: 'processing',
      metadata: {
        category: 'general',
        tags: []
      },
      isPublic: isPublic === 'true',
      accessLevel: accessLevel
    });

    await document.save();

    // Process PDF in background
    pdfProcessor.processPDF(document._id, req.file.path, document.title)
      .then(async (result) => {
        try {
          // Update document with processing results
          document.status = 'processed';
          document.totalChunks = result.totalChunks;
          document.processedChunks = result.processedChunks;
          document.metadata.pages = result.pages;
          document.metadata.textLength = result.textLength;
          await document.save();
          
          logger.info(`Document ${document.title} processed successfully`);
        } catch (saveError) {
          logger.error(`Error saving processed document ${document.title}:`, saveError.message);
        }
      })
      .catch(async (error) => {
        try {
          // Update document with error
          document.status = 'error';
          document.processingError = error.message;
          await document.save();
          
          logger.error(`Error processing document ${document.title}:`, error.message);
        } catch (saveError) {
          logger.error(`Error saving error status for document ${document.title}:`, saveError.message);
        }
      });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully. Processing in background.',
      document: {
        id: document._id,
        title: document.title,
        status: document.status,
        uploadedBy: document.uploadedBy
      }
    });

  } catch (error) {
    logger.error('Error uploading document:', error.message);
    
    // Clean up uploaded file if there was an error
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.warn(`Could not delete file after error: ${unlinkError.message}`);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during upload'
    });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getAllDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const searchQuery = req.query.search 
      ? { $text: { $search: req.query.search } } 
      : {};

    // Filter by access level
    const accessFilter = req.user.role === 'admin' 
      ? {} 
      : { $or: [{ isPublic: true }, { uploadedBy: req.user.userId }] };

    const [documents, total] = await Promise.all([
      Document.find({ ...searchQuery, ...accessFilter })
        .populate('uploadedBy', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Document.countDocuments({ ...searchQuery, ...accessFilter })
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      documents
    });

  } catch (error) {
    logger.error('Error getting documents:', error.message);
    next(error);
  }
};

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Private
exports.getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check access permissions
    if (!document.isPublic && document.uploadedBy._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      document
    });

  } catch (error) {
    logger.error('Error getting document:', error.message);
    next(error);
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private/Admin
exports.updateDocument = async (req, res, next) => {
  try {
    const { title, isPublic, accessLevel } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update fields
    if (title) document.title = title;
    if (isPublic !== undefined) document.isPublic = isPublic === 'true';
    if (accessLevel) document.accessLevel = accessLevel;

    await document.save();

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      document
    });

  } catch (error) {
    logger.error('Error updating document:', error.message);
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private/Admin
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
    } catch (fileError) {
      logger.warn(`Could not delete file ${document.filePath}:`, fileError.message);
    }

    // Delete document and associated chunks
    await Document.findByIdAndDelete(req.params.id);
    // Note: You might want to also delete associated VectorChunks here

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting document:', error.message);
    next(error);
  }
};

// @desc    Get document processing status
// @route   GET /api/documents/:id/status
// @access  Private
exports.getDocumentStatus = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id)
      .select('status processingError totalChunks processedChunks');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({
      success: true,
      status: document.status,
      processingError: document.processingError,
      totalChunks: document.totalChunks,
      processedChunks: document.processedChunks,
      progress: document.totalChunks > 0 ? (document.processedChunks / document.totalChunks) * 100 : 0
    });

  } catch (error) {
    logger.error('Error getting document status:', error.message);
    next(error);
  }
};

// @desc    Upload multiple PDF documents
// @route   POST /api/documents/upload-multiple
// @access  Private/Admin
exports.uploadMultipleDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No files uploaded' 
      });
    }

    const { isPublic = true, accessLevel = 'public' } = req.body;
    const uploadedBy = req.user.userId;
    const results = [];

    // Process each file
    for (const file of req.files) {
      try {
        // Validate file type
        if (file.mimetype !== 'application/pdf') {
          // Delete uploaded file
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            logger.warn(`Could not delete invalid file: ${unlinkError.message}`);
          }
          results.push({
            filename: file.originalname,
            success: false,
            message: 'Only PDF files are allowed'
          });
          continue;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            logger.warn(`Could not delete oversized file: ${unlinkError.message}`);
          }
          results.push({
            filename: file.originalname,
            success: false,
            message: 'File size must be less than 10MB'
          });
          continue;
        }

        // Create document record
        const document = new Document({
          title: file.originalname.replace('.pdf', ''),
          filename: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          uploadedBy: uploadedBy,
          status: 'processing',
          metadata: {
            category: 'general',
            tags: []
          },
          isPublic: isPublic === 'true',
          accessLevel: accessLevel
        });

        await document.save();

        // Process PDF in background
        pdfProcessor.processPDF(document._id, file.path, document.title)
          .then(async (result) => {
            try {
              // Update document with processing results
              document.status = 'processed';
              document.totalChunks = result.totalChunks;
              document.processedChunks = result.processedChunks;
              document.metadata.pages = result.pages;
              document.metadata.textLength = result.textLength;
              await document.save();
              
              logger.info(`Document ${document.title} processed successfully`);
            } catch (saveError) {
              logger.error(`Error saving processed document ${document.title}:`, saveError.message);
            }
          })
          .catch(async (error) => {
            try {
              // Update document with error
              document.status = 'error';
              document.processingError = error.message;
              await document.save();
              
              logger.error(`Error processing document ${document.title}:`, error.message);
            } catch (saveError) {
              logger.error(`Error saving error status for document ${document.title}:`, saveError.message);
            }
          });

        results.push({
          filename: file.originalname,
          success: true,
          message: 'Document uploaded successfully. Processing in background.',
          document: {
            id: document._id,
            title: document.title,
            status: document.status
          }
        });

      } catch (error) {
        logger.error(`Error processing file ${file.originalname}:`, error.message);
        
        // Clean up uploaded file if there was an error
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          logger.warn(`Could not delete file after error: ${unlinkError.message}`);
        }
        
        results.push({
          filename: file.originalname,
          success: false,
          message: 'Internal server error during upload'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.status(201).json({
      success: true,
      message: `Upload completed. ${successCount} files uploaded successfully, ${failureCount} failed.`,
      results: results,
      summary: {
        total: req.files.length,
        successful: successCount,
        failed: failureCount
      }
    });

  } catch (error) {
    logger.error('Error uploading multiple documents:', error.message);
    
    // Clean up all uploaded files if there was an error
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          logger.warn(`Could not delete file after error: ${unlinkError.message}`);
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during upload'
    });
  }
}; 