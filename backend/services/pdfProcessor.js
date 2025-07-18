const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const ollamaService = require('./ollamaService');
const VectorChunk = require('../models/VectorChunk');

class PDFProcessor {
  constructor() {
    this.chunkSize = 1000; // characters per chunk
    this.chunkOverlap = 200; // overlap between chunks
  }

  // Extract text from PDF file
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        pages: data.numpages,
        info: data.info,
        metadata: data.metadata
      };
    } catch (error) {
      logger.error('Error extracting text from PDF:', error.message);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  }

  // Split text into chunks
  splitTextIntoChunks(text, chunkSize = this.chunkSize, overlap = this.chunkOverlap) {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      let chunk = text.substring(startIndex, endIndex);

      // Try to break at sentence boundaries
      if (endIndex < text.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > startIndex + chunkSize * 0.7) {
          chunk = text.substring(startIndex, breakPoint + 1);
          startIndex = breakPoint + 1;
        } else {
          startIndex = endIndex - overlap;
        }
      } else {
        startIndex = endIndex;
      }

      // Clean up the chunk
      chunk = chunk.trim();
      if (chunk.length > 50) { // Only include chunks with substantial content
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  // Process PDF and create embeddings
  async processPDF(documentId, filePath, title) {
    try {
      logger.info(`Starting PDF processing for document: ${title}`);

      // Extract text from PDF
      const pdfData = await this.extractTextFromPDF(filePath);
      const { text, pages } = pdfData;

      // Split text into chunks
      const chunks = this.splitTextIntoChunks(text);
      logger.info(`Created ${chunks.length} chunks from PDF`);

      // Process chunks and create embeddings
      const processedChunks = [];
      
      for (let i = 0; i < chunks.length; i++) {
        try {
          const chunk = chunks[i];
          
          // Generate embedding for the chunk
          const embedding = await ollamaService.generateEmbedding(chunk);
          
          // Create vector chunk record
          const vectorChunk = new VectorChunk({
            documentId: documentId,
            chunkIndex: i,
            content: chunk,
            embedding: embedding,
            metadata: {
              pageNumber: Math.floor((i / chunks.length) * pages) + 1,
              startChar: i * this.chunkSize,
              endChar: (i * this.chunkSize) + chunk.length,
              section: `Chunk ${i + 1}`,
              heading: title
            },
            tokens: chunk.split(' ').length
          });

          await vectorChunk.save();
          processedChunks.push(vectorChunk);
          
          logger.info(`Processed chunk ${i + 1}/${chunks.length}`);
        } catch (error) {
          logger.error(`Error processing chunk ${i}:`, error.message);
          // Continue with other chunks
        }
      }

      logger.info(`Successfully processed ${processedChunks.length} chunks for document: ${title}`);
      return {
        totalChunks: chunks.length,
        processedChunks: processedChunks.length,
        pages: pages,
        textLength: text.length
      };

    } catch (error) {
      logger.error('Error processing PDF:', error.message);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }

  // Search for similar chunks
  async searchSimilarChunks(query, limit = 5) {
    try {
      // Generate embedding for the query
      const queryEmbedding = await ollamaService.generateEmbedding(query);

      // For now, we'll use a simple similarity search
      // In production, you might want to use a proper vector database like Pinecone or Weaviate
      const allChunks = await VectorChunk.find({}).populate('documentId');
      
      // Calculate cosine similarity
      const similarities = allChunks.map(chunk => {
        const similarity = this.cosineSimilarity(queryEmbedding, chunk.embedding);
        return {
          chunk: chunk,
          similarity: similarity
        };
      });

      // Sort by similarity and return top results
      similarities.sort((a, b) => b.similarity - a.similarity);
      
      return similarities.slice(0, limit).map(item => ({
        content: item.chunk.content,
        document: item.chunk.documentId,
        similarity: item.similarity,
        metadata: item.chunk.metadata
      }));

    } catch (error) {
      logger.error('Error searching similar chunks:', error.message);
      throw new Error(`Failed to search chunks: ${error.message}`);
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }
}

module.exports = new PDFProcessor(); 