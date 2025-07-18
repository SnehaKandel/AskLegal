const axios = require('axios');
const logger = require('../utils/logger');

class OllamaService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama3.2';
    this.embeddingModel = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';
  }

  // Generate embeddings for text
  async generateEmbedding(text) {
    try {
      const response = await axios.post(`${this.baseURL}/api/embeddings`, {
        model: this.embeddingModel,
        prompt: text
      });

      if (response.data && response.data.embedding) {
        return response.data.embedding;
      } else {
        throw new Error('No embedding received from Ollama');
      }
    } catch (error) {
      logger.error('Error generating embedding:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  // Generate text completion
  async generateCompletion(prompt, options = {}) {
    try {
      const defaultOptions = {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2048,
          ...options
        }
      };

      const response = await axios.post(`${this.baseURL}/api/generate`, defaultOptions);

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        throw new Error('No response received from Ollama');
      }
    } catch (error) {
      logger.error('Error generating completion:', error.message);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  // Generate RAG response with context
  async generateRAGResponse(query, context, options = {}) {
    try {
      const systemPrompt = `You are a helpful legal assistant for Nepal. Answer questions based on the provided context. If the answer cannot be found in the context, say so. Always provide accurate and helpful information.

Context:
${context}

Question: ${query}

Answer:`;

      const response = await this.generateCompletion(systemPrompt, {
        temperature: 0.3, // Lower temperature for more focused responses
        max_tokens: 1024,
        ...options
      });

      return response;
    } catch (error) {
      logger.error('Error generating RAG response:', error.message);
      throw new Error(`Failed to generate RAG response: ${error.message}`);
    }
  }

  // Check if Ollama is running
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return {
        status: 'healthy',
        models: response.data.models || [],
        baseURL: this.baseURL
      };
    } catch (error) {
      logger.error('Ollama health check failed:', error.message);
      return {
        status: 'unhealthy',
        error: error.message,
        baseURL: this.baseURL
      };
    }
  }

  // List available models
  async listModels() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      logger.error('Error listing models:', error.message);
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
}

module.exports = new OllamaService(); 