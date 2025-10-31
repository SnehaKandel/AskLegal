
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { FileText, Search, BookOpen, Send, Bot, User } from "lucide-react";
import { useState, useEffect } from "react";
import { ragService } from "@/services/rag";

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  sources?: string[];
}

const Index = () => {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      content: "Hello! Welcome to AskLegal. I'm AskLegal, your interactive legal assistant. How can I help you today?",
      timestamp: new Date()
    },
    {
      type: 'bot', 
      content: "I can answer questions about Nepal's Constitution based on official documents. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState<any>(null);
  
  useEffect(() => {
    loadRAGStatus();
  }, []);

  const loadRAGStatus = async () => {
    const status = await ragService.getStatus();
    setRagStatus(status);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);
    
    try {
      if (ragStatus && ragStatus.documentsCount > 0) {
        // Use RAG system
        const response = await ragService.queryRAG(chatInput);
        
        const botMessage: ChatMessage = {
          type: 'bot',
          content: response.answer,
          sources: response.sources,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback message when no documents are uploaded
        const botMessage: ChatMessage = {
          type: 'bot',
          content: "I don't have access to the Constitution documents yet. Please ask an administrator to upload the necessary PDF files to enable this feature.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        type: 'bot',
        content: "Sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-asklegal-heading mb-4 theme-transition animate-fade-in">
            Welcome to <span className="text-asklegal-purple">AskLegal</span>
          </h1>
          <p className="text-xl text-asklegal-text/80 mb-10 theme-transition max-w-2xl mx-auto">
            Your interactive legal assistant for Nepal's legal system - access resources, get answers, and create documents with ease.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto card-glassmorphism p-6 mb-16 animate-fade-in" style={{animationDelay: "0.2s"}}>
          <h2 className="text-2xl font-medium text-asklegal-heading mb-4 theme-transition">
            Chat with AskLegal
          </h2>
          
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="chat-message p-4 rounded-lg" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center gap-2 mb-1">
                  {message.type === 'bot' ? (
                    <Bot size={16} className="text-asklegal-purple" />
                  ) : (
                    <User size={16} className="text-asklegal-accent" />
                  )}
                  <p className="text-sm text-asklegal-text/70 theme-transition">
                    {message.type === 'bot' ? 'AskLegal' : 'You'} • {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <p className="theme-transition">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 text-xs text-asklegal-text/60 theme-transition">
                    <strong>Sources:</strong> {message.sources.join(', ')}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Bot size={16} className="text-asklegal-purple" />
                  <p className="text-sm text-asklegal-text/70 theme-transition">AskLegal • Thinking...</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Analyzing your question...</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about Nepal's Constitution..." 
              className="flex-1 p-3 rounded-l-md border-r-0 text-asklegal-text bg-asklegal-chat-bg/40 backdrop-blur-sm border border-asklegal-form-border/50 focus:outline-none focus:ring-1 focus:ring-asklegal-purple/30 theme-transition dark:text-asklegal-text dark:bg-asklegal-form-bg/90"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !chatInput.trim()}
              className="bg-asklegal-purple hover:bg-asklegal-purple/80 text-white py-3 px-6 rounded-r-md transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send size={18} />
            </button>
          </div>
          
          {ragStatus && ragStatus.documentsCount === 0 && (
            <div className="mt-4 text-sm text-asklegal-text/60 theme-transition text-center">
              💡 Constitution documents not yet loaded. Answers will be limited until PDFs are uploaded.
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-glassmorphism p-6 h-full flex flex-col animate-fade-in" style={{animationDelay: "0.4s"}}>
            <h3 className="text-xl font-medium text-asklegal-heading mb-3 theme-transition flex items-center gap-2">
              <FileText size={20} className="text-asklegal-purple" />
              Latest News
            </h3>
            <p className="text-asklegal-text/70 mb-4 flex-grow theme-transition">
              Stay updated with the latest legal news and updates from across Nepal and beyond.
            </p>
            <Link to="/news" className="w-full block mt-auto">
              <Button className="w-full btn-animated">
                Explore News
              </Button>
            </Link>
          </div>
          
          <div className="card-glassmorphism p-6 h-full flex flex-col animate-fade-in" style={{animationDelay: "0.6s"}}>
            <h3 className="text-xl font-medium text-asklegal-heading mb-3 theme-transition flex items-center gap-2">
              <Search size={20} className="text-asklegal-purple" />
              Kanoon Directory
            </h3>
            <p className="text-asklegal-text/70 mb-4 flex-grow theme-transition">
              Search and access comprehensive legal document repository and legislation.
            </p>
            <Link to="/kanoon-search" className="w-full block mt-auto">
              <Button className="w-full btn-animated">
                Browse Laws
              </Button>
            </Link>
          </div>
          
          <div className="card-glassmorphism p-6 h-full flex flex-col animate-fade-in" style={{animationDelay: "0.8s"}}>
            <h3 className="text-xl font-medium text-asklegal-heading mb-3 theme-transition flex items-center gap-2">
              <BookOpen size={20} className="text-asklegal-purple" />
              Judicial Petitions
            </h3>
            <p className="text-asklegal-text/70 mb-4 flex-grow theme-transition">
              Create, customize and download legal petition documents with ease.
            </p>
            <Link to="/forms" className="w-full block mt-auto">
              <Button className="w-full btn-animated">
                Create Document
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
