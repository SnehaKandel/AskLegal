import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { FileText, Search, BookOpen } from "lucide-react";
import { Chatbot } from "@/components/chatbot/Chatbot";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-asklegal-heading mb-4 theme-transition animate-fade-in">
            Welcome to <span className="text-asklegal-purple">AskLegal</span>
          </h1>
          <p className="text-lg text-asklegal-text/80 mb-10 theme-transition max-w-2xl mx-auto">
            Your interactive legal assistant for Nepal's legal system - access resources, get answers, and create documents with ease.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in" style={{animationDelay: "0.2s"}}>
          <Chatbot />
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
