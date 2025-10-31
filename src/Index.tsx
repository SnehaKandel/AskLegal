
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-asklegal-purple mb-4">Welcome to AskLegal.io</h1>
        <p className="text-xl text-white/80 mb-10">Your interactive legal solution</p>
        
        <div className="max-w-3xl mx-auto bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6 mb-16">
          <h2 className="text-2xl font-medium text-white mb-4">Chat with AskLegal</h2>
          <p className="text-white/70 mb-6">Ask legal questions or get help navigating AskLegal.io</p>
          
          <div className="space-y-4 mb-6">
            <div className="bg-asklegal-purple/20 p-4 rounded-lg">
              <p className="text-sm text-white/70 mb-1">AskLegal • 03:20 PM</p>
              <p className="text-white">Hello! Welcome to AskLegal.io. I'm AskLegal, your interactive legal assistant. How can I help you today?</p>
            </div>
            
            <div className="bg-asklegal-purple/20 p-4 rounded-lg">
              <p className="text-sm text-white/70 mb-1">AskLegal • 03:20 PM</p>
              <p className="text-white">I provide legal information, latest news, and let you test your legal knowledge! Please log in to get started.</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 p-3 rounded-l-md bg-asklegal-dark/60 border border-r-0 border-asklegal-purple/30 text-white focus:outline-none focus:border-asklegal-purple"
            />
            <button className="bg-asklegal-purple text-white py-3 px-6 rounded-r-md hover:bg-asklegal-accent transition-colors">
              Send
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
            <h3 className="text-xl font-medium text-white mb-3">Latest News</h3>
            <p className="text-white/70 mb-4">Stay updated with the latest legal news and updates.</p>
            <Link to="/news" className="w-full block">
              <Button variant="outline" className="border-asklegal-purple/50 text-asklegal-purple hover:bg-asklegal-purple/10 w-full">
                Explore News
              </Button>
            </Link>
          </div>
          
          <div className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
            <h3 className="text-xl font-medium text-white mb-3">Play & Learn</h3>
            <p className="text-white/70 mb-4">Test your knowledge with interactive legal quizzes and games.</p>
            <Link to="/play" className="w-full block">
              <Button className="bg-asklegal-purple hover:bg-asklegal-accent text-white w-full">
                Start Learning
              </Button>
            </Link>
          </div>
          
          <div className="bg-asklegal-dark/60 border border-asklegal-purple/30 rounded-lg p-6">
            <h3 className="text-xl font-medium text-white mb-3">User Settings</h3>
            <p className="text-white/70 mb-4">Update your profile and manage account settings.</p>
            <Link to="/settings" className="w-full block">
              <Button className="bg-asklegal-purple hover:bg-asklegal-accent text-white w-full">
                Manage Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
