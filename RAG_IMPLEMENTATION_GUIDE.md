**📝 AskLegal RAG Implementation Guide**
**🎯 Overview**

AskLegal uses a Retrieval-Augmented Generation (RAG) system to answer user questions based on uploaded Nepali legal documents.
Admins can upload PDFs, which are processed into searchable chunks, and the system retrieves relevant context to generate fact-based, cited, and reliable responses while minimizing hallucinations.

**📋 Prerequisites**

Node.js installed

Backend dependencies: pdf-parse, multer, express

Frontend dependencies: React, Vite, Tailwind CSS

**🚀 Setup & Run**
**1. Start Backend**
cd backend
npm install
npm start

**2. Start Frontend**
cd frontend
npm install
npm run dev

**3. Admin Upload**

Login as admin at /login

Upload PDFs on the Documents page

Wait for processing (text extraction → chunking → vector storage)

**🔧 How It Works**
**1. Document Processing**
PDF Upload → Text Extraction → Chunking → Embedding → Vector Storage

**2. Question Answering**
User Question → Embedding → Similarity Search → Context Retrieval → Response Generation → Display

**3. System Flow**

User asks a question

System finds similar document chunks using embeddings

Context is retrieved and passed to the model

Model generates a grounded response

Answer is returned with sources and confidence score

**🧱 Key Components**

PDF Processor: Extracts text from PDFs, splits into chunks, creates embeddings
Vector Storage : 	Stores embeddings and enables similarity search
RAG Controller : 	Handles chat requests and generates responses based on context
Frontend Chat : 	Captures queries and displays answers with sources

**⚙️ Configuration**

Chunk Size: 1000 characters

Chunk Overlap: 200 characters

Vector Search: Cosine similarity

Response: Grounded, cited, and confidence-scored

**🔍 Testing**

Upload test documents

Ask relevant legal questions

Verify responses are context-aware and correctly sourced

**📈 Best Practices**

Upload clean, text-based PDFs

Keep documents updated and relevant

Monitor response quality and refine chunking if needed
