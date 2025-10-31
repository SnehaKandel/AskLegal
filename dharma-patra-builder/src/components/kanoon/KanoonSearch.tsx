
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const KanoonSearchBar = ({ searchQuery, setSearchQuery }: SearchProps) => {
  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="card-glassmorphism p-0 overflow-hidden">
      <div className="p-4 bg-asklegal-purple/10 border-b border-asklegal-purple/30 flex items-center">
        <Search className="w-5 h-5 text-asklegal-purple mr-2" />
        <h2 className="text-lg font-medium text-asklegal-heading">
          Search Kanoon
        </h2>
      </div>
      <div className="p-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search legal resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-asklegal-purple/40 text-asklegal-text pl-10 pr-4 focus-visible:ring-1 focus-visible:ring-asklegal-purple"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-asklegal-purple" />
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium text-asklegal-heading mb-2">Popular searches</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className="text-sm bg-asklegal-purple/10 hover:bg-asklegal-purple/20 text-asklegal-text px-3 py-1 rounded-md transition-colors"
              onClick={() => handlePopularSearch("Constitution")}
            >
              Constitution
            </button>
            <button 
              className="text-sm bg-asklegal-purple/10 hover:bg-asklegal-purple/20 text-asklegal-text px-3 py-1 rounded-md transition-colors"
              onClick={() => handlePopularSearch("Acts")}
            >
              Acts
            </button>
            <button 
              className="text-sm bg-asklegal-purple/10 hover:bg-asklegal-purple/20 text-asklegal-text px-3 py-1 rounded-md transition-colors"
              onClick={() => handlePopularSearch("इ-कमर्स")}
            >
              इ-कमर्स
            </button>
            <button 
              className="text-sm bg-asklegal-purple/10 hover:bg-asklegal-purple/20 text-asklegal-text px-3 py-1 rounded-md transition-colors"
              onClick={() => handlePopularSearch("नागरिक")}
            >
              नागरिक
            </button>
            <button 
              className="text-sm bg-asklegal-purple/10 hover:bg-asklegal-purple/20 text-asklegal-text px-3 py-1 rounded-md transition-colors"
              onClick={() => handlePopularSearch("संविधान")}
            >
              संविधान
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanoonSearchBar;
