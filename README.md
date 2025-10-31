#  AskLegal — AI-Powered Legal Assistance System



**AskLegal** is a Retrieval-Augmented Generation (RAG) based web application designed to make legal information more accessible and transparent.  
It aims to **foster increased citizen participation** in the legal system by allowing users to interactively query legal documents, receive AI-generated insights with citations, and stay updated on the latest legal news.

---

##  Features

###  Intelligent Legal Query System  
- Built using a **locally hosted Ollama model** integrated with a **Nomic Embedding model**.  
- Provides **accurate responses** with **citations and confidence scores** for every answer.  
- Enables context-aware understanding of user queries using RAG architecture.

###  Real-time Legal News Feed  
- Fetches and displays **legal and civic news** updated automatically every **5 minutes**.  
- Keeps users informed about recent legal changes and events.

###  Law Repository with In-document Search  
- Centralized database of **legal acts and documents**.  
- Users can **search within documents** for specific terms, phrases, or sections.  
- Includes an **auto-updating input form** for quick updates or user inputs.

###  Utility Tools  
- **Data Converter**: Converts between common file/data formats.  
- **In-System Translator**: Helps users translate legal text instantly.  
- **Quiz Module**: Gamifies the experience with short legal quizzes to promote awareness.

---

##  Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend / AI** | Ollama (Local LLM), Nomic Embedding |
| **Data Handling** | REST APIs, JSON, Local Storage |
| **Others** | Node.js, npm |

---

##  System Architecture

The project follows a **Retrieval-Augmented Generation (RAG)** architecture:

1. **User Query Input** → Processed locally via Ollama  
2. **Document Retrieval** → Nomic embeddings used to fetch relevant context  
3. **Response Generation** → Combined context passed to the language model  
4. **Output Display** → Response shown with citations and confidence score  



##  Installation & Setup

To run this project locally, follow these steps:

```bash
# Step 1: Clone the repository
git clone https://github.com/<your-username>/AskLegal.git

# Step 2: Navigate into the project folder
cd AskLegal

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
