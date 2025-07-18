const ollamaService = require('../services/ollamaService');
const pdfProcessor = require('../services/pdfProcessor');
const logger = require('../utils/logger');

// @desc    Get RAG system status
// @route   GET /api/rag/status
// @access  Private
exports.getRAGStatus = async (req, res, next) => {
  try {
    const ollamaHealth = await ollamaService.checkHealth();
    
    res.status(200).json({
      success: true,
      status: 'operational',
      ollama: ollamaHealth,
      features: {
        documentUpload: true,
        vectorSearch: true,
        ragGeneration: true
      }
    });
  } catch (error) {
    logger.error('Error getting RAG status:', error.message);
    next(error);
  }
};

// @desc    Search documents using RAG
// @route   GET /api/rag/search
// @access  Private
exports.searchDocuments = async (req, res, next) => {
  try {
    const { query, limit = 5 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search for similar chunks
    const searchResults = await pdfProcessor.searchSimilarChunks(query, parseInt(limit));

    res.status(200).json({
      success: true,
      query,
      results: searchResults,
      count: searchResults.length
    });

  } catch (error) {
    logger.error('Error searching documents:', error.message);
    next(error);
  }
};

// @desc    Generate RAG response
// @route   POST /api/rag/generate
// @access  Private
exports.generateResponse = async (req, res, next) => {
  try {
    const { query, contextLimit = 3 } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Search for relevant context
    const searchResults = await pdfProcessor.searchSimilarChunks(query, parseInt(contextLimit));
    
    if (searchResults.length === 0) {
      return res.status(200).json({
        success: true,
        response: "I don't have enough information in my knowledge base to answer this question accurately. Please try rephrasing your question or contact support for assistance.",
        sources: [],
        confidence: 'low'
      });
    }

    // Prepare context from search results
    const context = searchResults
      .map(result => `Document: ${result.document.title}\nContent: ${result.content}`)
      .join('\n\n');

    // Generate RAG response
    const response = await ollamaService.generateRAGResponse(query, context);

    res.status(200).json({
      success: true,
      response,
      sources: searchResults.map(result => ({
        document: result.document.title,
        similarity: result.similarity,
        metadata: result.metadata
      })),
      confidence: searchResults[0].similarity > 0.7 ? 'high' : 'medium'
    });

  } catch (error) {
    logger.error('Error generating RAG response:', error.message);
    next(error);
  }
};

// @desc    Chat with RAG system
// @route   POST /api/rag/chat
// @access  Private
exports.chat = async (req, res, next) => {
  try {
    const { message, conversationId, contextLimit = 3 } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Search for relevant context
    const searchResults = await pdfProcessor.searchSimilarChunks(message, parseInt(contextLimit));
    
    let response;
    let sources = [];

    if (searchResults.length === 0) {
      response = "I don't have enough information in my knowledge base to answer this question accurately. Please try rephrasing your question or contact support for assistance.";
    } else {
      // Prepare context from search results
      const context = searchResults
        .map(result => `Document: ${result.document.title}\nContent: ${result.content}`)
        .join('\n\n');

      // Generate RAG response
      response = await ollamaService.generateRAGResponse(message, context);
      
      sources = searchResults.map(result => ({
        document: result.document.title,
        similarity: result.similarity,
        metadata: result.metadata
      }));
    }

    res.status(200).json({
      success: true,
      response,
      sources,
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error in RAG chat:', error.message);
    next(error);
  }
};

// @desc    Get available models
// @route   GET /api/rag/models
// @access  Private
exports.getModels = async (req, res, next) => {
  try {
    const models = await ollamaService.listModels();
    
    res.status(200).json({
      success: true,
      models
    });
  } catch (error) {
    logger.error('Error getting models:', error.message);
    next(error);
  }
}; 