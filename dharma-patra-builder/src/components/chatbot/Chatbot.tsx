import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  FileText, 
  Sparkles,
  MessageCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Array<{
    document: string;
    similarity: number;
    metadata: any;
  }>;
}

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [showSources, setShowSources] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationId: conversationId || undefined,
          contextLimit: 3,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources,
      };

      setMessages(prev => [...prev, botMessage]);
      setConversationId(data.conversationId);

      // Show sources if available
      if (data.sources && data.sources.length > 0) {
        toast({
          title: 'Sources found',
          description: `Found ${data.sources.length} relevant document(s)`,
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get response from chatbot',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId('');
    toast({
      title: 'Chat cleared',
      description: 'Conversation history has been cleared',
    });
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (similarity >= 0.6) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-red-500/20 text-red-700 border-red-500/30';
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-asklegal-purple to-purple-600 rounded-full shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-asklegal-heading mb-2">Legal Assistant AI</h2>
        <p className="text-asklegal-text/70 text-sm">
          Powered by RAG - Ask questions about legal documents
        </p>
      </div>
      
      {/* Chat Container */}
      <div className="card-glassmorphism rounded-2xl overflow-hidden shadow-xl">
        {/* Messages Area */}
        <ScrollArea className="h-96 p-6">
          {messages.length === 0 ? (
            <div className="text-center text-asklegal-text/70 py-12">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-asklegal-purple/10 to-purple-500/10 rounded-full mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-asklegal-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-asklegal-heading">Start a conversation</h3>
              <p className="text-sm max-w-md mx-auto mb-6">
                Ask questions about legal procedures, requirements, or regulations.
              </p>
              <div className="space-y-3">
                <p className="text-xs font-medium text-asklegal-text/60">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-asklegal-purple/10 border-asklegal-purple/30 text-asklegal-purple hover:border-asklegal-purple/50 transition-all" 
                    onClick={() => setInput("What are the requirements for starting a business in Nepal?")}
                  >
                    Business requirements
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-asklegal-purple/10 border-asklegal-purple/30 text-asklegal-purple hover:border-asklegal-purple/50 transition-all"
                    onClick={() => setInput("What documents do I need for property registration?")}
                  >
                    Property registration
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-asklegal-purple/10 border-asklegal-purple/30 text-asklegal-purple hover:border-asklegal-purple/50 transition-all"
                    onClick={() => setInput("What are the legal procedures for divorce?")}
                  >
                    Divorce procedures
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-asklegal-purple to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-asklegal-purple to-purple-600 text-white shadow-lg'
                        : 'bg-asklegal-chat-bg/60 backdrop-blur-sm border border-asklegal-form-border/30'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    
                    {message.sources && message.sources.length > 0 && showSources && (
                      <div className="mt-4 pt-4 border-t border-asklegal-form-border/30">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-asklegal-purple" />
                          <p className="text-xs font-medium text-asklegal-text/80">
                            Sources ({message.sources.length}):
                          </p>
                        </div>
                        <div className="space-y-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="flex items-center justify-between bg-asklegal-form-bg/40 rounded-lg p-3 border border-asklegal-form-border/20">
                              <div className="flex items-center gap-2">
                                <Eye className="h-3 w-3 text-asklegal-text/50" />
                                <span className="text-xs font-medium text-asklegal-text">{source.document}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getSimilarityColor(source.similarity)}`}
                              >
                                {Math.round(source.similarity * 100)}% match
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-asklegal-purple/20 rounded-full flex items-center justify-center border border-asklegal-purple/30">
                      <User className="h-5 w-5 text-asklegal-purple" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-asklegal-purple to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-asklegal-chat-bg/60 backdrop-blur-sm border border-asklegal-form-border/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin text-asklegal-purple" />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-asklegal-heading">Thinking...</div>
                        <div className="text-xs text-asklegal-text/60">Searching through documents</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t border-asklegal-form-border/30 p-6 bg-asklegal-form-bg/20 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a legal question..."
              disabled={isLoading}
              className="flex-1 border-asklegal-form-border/50 bg-white/80 text-black placeholder:text-asklegal-text/60 focus:border-asklegal-purple/50 focus:ring-asklegal-purple/20 shadow-sm"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="bg-gradient-to-r from-asklegal-purple to-purple-600 hover:from-asklegal-purple/90 hover:to-purple-600/90 shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={clearChat}
                variant="outline"
                size="icon"
                className="border-asklegal-form-border/50 text-asklegal-text hover:bg-asklegal-purple/10 hover:border-asklegal-purple/30"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {messages.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-asklegal-form-border/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSources(!showSources)}
                  className="text-xs text-asklegal-text/70 hover:text-asklegal-purple hover:bg-asklegal-purple/10"
                >
                  {showSources ? 'Hide' : 'Show'} Sources
                </Button>
              </div>
              <p className="text-xs text-asklegal-text/50">
                {messages.length} messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 