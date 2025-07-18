# RAG System Implementation Guide

## 🎯 Overview
This guide will help you implement a complete RAG (Retrieval-Augmented Generation) system using Ollama for your AskLegal application. The system will allow admins to upload PDF documents and users to ask questions that get answered based on those documents.

## 📋 Prerequisites

### 1. Ollama Installation
Make sure Ollama is installed and running on your system:

```bash
# Start Ollama
ollama serve

# Pull required models
ollama pull llama2
ollama pull nomic-embed-text
```

### 2. Backend Dependencies
Ensure all required packages are installed:

```bash
cd backend
npm install pdf-parse multer langchain
```

## 🚀 Step-by-Step Implementation

### Step 1: Start All Services

1. **Start Redis** (if not already running):
```bash
redis-server
```

2. **Start Backend**:
```bash
cd backend
npm start
```

3. **Start Frontend**:
```bash
cd dharma-patra-builder
npm run dev
```

### Step 2: Run Setup Script

Run the comprehensive setup script to check everything:

```bash
node setupRAGSystem.js
```

This script will:
- Check if Ollama is running
- Verify backend connectivity
- Test authentication
- Check RAG endpoints
- Count existing documents
- Test RAG functionality

### Step 3: Admin Setup

1. **Login as Admin**:
   - Go to: `http://localhost:3000/login`
   - Email: `admin@asklegal.com`
   - Password: `Admin123!`

2. **Upload Documents**:
   - Navigate to Documents page
   - Upload at least 5 PDF documents containing legal information
   - Wait for processing to complete (this may take a few minutes)

### Step 4: Test RAG Functionality

1. **Test Chatbot**:
   - Go to homepage
   - Ask questions in the chatbot
   - Verify responses are based on uploaded documents

2. **Sample Questions to Test**:
   - "What are the requirements for starting a business in Nepal?"
   - "What documents do I need for property registration?"
   - "What are the legal procedures for divorce?"
   - "What are the employment laws in Nepal?"

## 🔧 System Architecture

### Components:
1. **Ollama Service** (`backend/services/ollamaService.js`)
   - Handles embeddings generation
   - Manages text completions
   - Provides RAG responses

2. **PDF Processor** (`backend/services/pdfProcessor.js`)
   - Extracts text from PDFs
   - Splits text into chunks
   - Creates embeddings for each chunk

3. **Vector Storage** (`backend/models/VectorChunk.js`)
   - Stores document chunks with embeddings
   - Enables similarity search

4. **RAG Controller** (`backend/controllers/ragController.js`)
   - Handles chat requests
   - Manages document search
   - Generates contextual responses

## 📊 How It Works

### 1. Document Upload Process:
```
PDF Upload → Text Extraction → Chunking → Embedding Generation → Vector Storage
```

### 2. Question Answering Process:
```
User Question → Embedding Generation → Similarity Search → Context Retrieval → LLM Response
```

### 3. RAG Flow:
1. User asks a question
2. System generates embedding for the question
3. Searches for similar document chunks
4. Retrieves relevant context
5. Generates response using LLM with context
6. Returns answer with source references

## 🎛️ Configuration

### Environment Variables (`.env`):
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

### Model Settings:
- **LLM Model**: `llama2` (for text generation)
- **Embedding Model**: `nomic-embed-text` (for vector embeddings)
- **Chunk Size**: 1000 characters
- **Chunk Overlap**: 200 characters

## 🔍 Troubleshooting

### Common Issues:

1. **Ollama Not Running**:
   ```bash
   ollama serve
   ```

2. **Models Not Found**:
   ```bash
   ollama pull llama2
   ollama pull nomic-embed-text
   ```

3. **Backend Connection Issues**:
   - Check if backend is running on port 5000
   - Verify Redis is running
   - Check MongoDB connection

4. **Document Processing Fails**:
   - Ensure PDF files are valid
   - Check file size limits
   - Verify Ollama is accessible

5. **Poor Response Quality**:
   - Upload more diverse documents
   - Increase context limit
   - Adjust chunk size settings

## 📈 Performance Optimization

### 1. Document Quality:
- Use high-quality, well-structured PDFs
- Ensure text is extractable (not scanned images)
- Include relevant legal information

### 2. Chunking Strategy:
- Adjust chunk size based on document structure
- Use sentence boundaries for better context
- Maintain appropriate overlap

### 3. Search Optimization:
- Implement proper indexing
- Use cosine similarity for better matching
- Consider using dedicated vector databases

## 🧪 Testing

### Automated Tests:
```bash
node testRAG.js
```

### Manual Testing:
1. Upload test documents
2. Ask various questions
3. Verify response accuracy
4. Check source attribution
5. Test edge cases

## 📝 Best Practices

1. **Document Management**:
   - Regular updates of legal documents
   - Version control for documents
   - Quality assurance for uploaded content

2. **Response Quality**:
   - Monitor response accuracy
   - Collect user feedback
   - Continuously improve prompts

3. **Security**:
   - Validate uploaded files
   - Implement access controls
   - Monitor system usage

## 🎉 Success Metrics

- **Response Accuracy**: >80% relevant answers
- **Source Attribution**: All responses include sources
- **Response Time**: <5 seconds per query
- **User Satisfaction**: Positive feedback on response quality

## 📞 Support

If you encounter issues:
1. Check the logs in `backend/logs/`
2. Run the setup script for diagnostics
3. Verify all services are running
4. Test individual components

---

**Next Steps**: After successful implementation, consider:
- Adding more sophisticated vector search
- Implementing conversation memory
- Adding response caching
- Expanding document types support 