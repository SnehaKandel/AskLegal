#  AskLegal : AI-Powered Legal Assistance System

---

**AskLegal** is a Retrieval-Augmented Generation (RAG)-driven intelligent legal assistant designed to streamline access to Nepali legal information.
It integrates local LLM inference, semantic document retrieval, and automated news aggregation to enhance transparency and legal literacy.

---

**Overview**

AskLegal leverages local AI inference via the Ollama runtime and Nomic Embedding models to process user queries against a curated corpus of Nepali legal acts and documents.
The system retrieves semantically relevant context, performs grounded generation, and delivers contextual, cited, and confidence-scored responses — ensuring minimal hallucination and verifiable output.

**⚙️ Core Features**

**🧩 Legal Query Engine (RAG Pipeline)**

Local inference using Ollama (supports models like Llama2 or Mistral).
Semantic vector search powered by Nomic Embeddings for context retrieval.
Implements context chunking, re-ranking, and response grounding.
Outputs include citations, source links, and confidence metrics.

### 📰 Real-time Legal News Feed  
- Fetches and displays legal and civic news updated automatically every 5 minutes.  
- Backend uses scheduled jobs to maintain real-time feeds.

### 📚 Law Repository with In-document Search  
- Centralized database of legal acts and documents.  
- Users can search within documents for specific terms, phrases, or sections.  
- Implements vectorized search and full-text search using embeddings and keyword matching.
- Includes an auto-update form for new document ingestion.

### ⚙️ Utility Tools  
- **In-System Translator**: Helps users translate legal text instantly.  
- **Quiz Module**: Lightweight gamified component to promote civic awareness.

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend / AI** | Ollama (Local LLM), Nomic Embedding |
| **Data Handling** | REST APIs, JSON, Local Storage |
| **Others** | Node.js, npm |

---

**🧩 System Architecture**

**Retrieval-Augmented Generation (RAG) Flow:**

User Query → Captured via frontend (React form input).

Preprocessing → Tokenization and normalization.

Embedding Retrieval → Nomic model generates vector embeddings; semantic similarity search executed.

Context Construction → Top-k relevant document chunks retrieved.

Response Generation → Ollama model generates grounded response with references.

Output Layer → Rendered in UI with source citations and confidence score.

📊 **DEMO**

<img width="1866" height="1200" alt="image" src="https://github.com/user-attachments/assets/032447e7-e20b-4f66-abce-d4356d542441" />

<img width="1581" height="1174" alt="image" src="https://github.com/user-attachments/assets/de8e21ce-cb75-4a49-9945-9b9684d9ab68" />

<img width="874" height="1086" alt="image" src="https://github.com/user-attachments/assets/db4765aa-a3fa-4610-bb0a-c24c6b0871c3" />


---

## 💻 Installation & Setup

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
