⚖️ AskLegal : AI-Powered Legal Assistance System

AskLegal is a Retrieval-Augmented Generation (RAG)-driven intelligent legal assistant designed to streamline access to Nepali legal information.
It integrates local LLM inference, semantic document retrieval, and automated news aggregation to enhance transparency and legal literacy.

🧠 Overview

AskLegal leverages local AI inference via the Ollama runtime and Nomic Embedding models to process user queries against a curated corpus of Nepali legal acts and documents.
The system retrieves semantically relevant context, performs grounded generation, and delivers contextual, cited, and confidence-scored responses — ensuring minimal hallucination and verifiable output.

⚙️ Core Features
🧩 Legal Query Engine (RAG Pipeline)

Local inference using Ollama (supports models like Llama2 or Mistral).

Semantic vector search powered by Nomic Embeddings for context retrieval.

Implements context chunking, re-ranking, and response grounding.

Outputs include citations, source links, and confidence metrics.

📰 Real-Time Legal News Module

Integrates a cron-based fetcher to scrape and update civic/legal news every 5 minutes.

Backend uses scheduled jobs to maintain real-time feeds.

📚 Legal Document Repository

Indexed repository of structured and unstructured legal documents.

Implements vectorized search and full-text search using embeddings and keyword matching.

Includes an auto-update form for new document ingestion.

🛠️ Utility & User Tools

In-App Translator: Uses model-assisted translation for Nepali ↔ English legal text.

Legal Quiz Engine: Lightweight gamified component to improve civic awareness.

🧱 Tech Stack
Layer	Technology
Frontend	React, TypeScript, Vite
UI / Styling	Tailwind CSS, shadcn/ui
Backend / API Layer	Node.js (Express), REST API
AI / Embeddings	Ollama (Local LLM), Nomic Embeddings
Vector Storage	In-memory / local JSON-based vector store
Data Management	Local Storage, JSON schema
Dev Tools	npm, Git, VSCode

🧩 System Architecture

Retrieval-Augmented Generation (RAG) Flow:

User Query → Captured via frontend (React form input).

Preprocessing → Tokenization and normalization.

Embedding Retrieval → Nomic model generates vector embeddings; semantic similarity search executed.

Context Construction → Top-k relevant document chunks retrieved.

Response Generation → Ollama model generates grounded response with references.

Output Layer → Rendered in UI with source citations and confidence score.

🧰 Installation & Local Setup
# 1. Clone the repository
git clone https://github.com/<your-username>/AskLegal.git

# 2. Navigate to the project directory
cd AskLegal

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev


Ensure that Ollama and Nomic models are installed and running locally before starting the backend.

