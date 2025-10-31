
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LegalDocument } from "@/types/forms";
import { FileText, Search, Type, Palette, Minus, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DocumentPreviewProps {
  document: LegalDocument | null;
}

const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [colorTheme, setColorTheme] = useState("default");
  
  if (!document) {
    return (
      <div className="card-glassmorphism flex items-center justify-center min-h-[842px]">
        <div className="text-center p-6">
          <FileText className="h-16 w-16 text-asklegal-purple/70 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-asklegal-heading mb-2">Select a document to preview</h3>
          <p className="text-asklegal-text/80 max-w-md">
            Choose a document from the list on the left to view its contents here.
          </p>
        </div>
      </div>
    );
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getThemeClasses = () => {
    switch (colorTheme) {
      case "dark":
        return "bg-gray-900 text-white";
      case "sepia":
        return "bg-yellow-50 text-amber-900";
      case "blue":
        return "bg-blue-50 text-blue-900";
      default:
        return "bg-white dark:bg-gray-800 text-gray-900 dark:text-white";
    }
  };

  return (
    <div className={`rounded-lg shadow-lg min-h-[842px] ${getThemeClasses()}`}>
      {/* Header with Controls */}
      <div className="border-b p-4 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold font-nepali mb-2">{document.title}</h2>
          <p className="text-lg opacity-80 mb-2">{document.titleEn}</p>
        </div>
        
        {/* Control Bar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Input
              type="text"
              placeholder="Search in document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
          </div>
          
          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-sm min-w-12 text-center">{fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Color Theme Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Palette className="h-4 w-4 mr-2" />
                Theme
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid gap-2">
                <Button
                  variant={colorTheme === "default" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setColorTheme("default")}
                >
                  Default
                </Button>
                <Button
                  variant={colorTheme === "dark" ? "default" : "ghost"}
                  className="justify-start bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => setColorTheme("dark")}
                >
                  Dark
                </Button>
                <Button
                  variant={colorTheme === "sepia" ? "default" : "ghost"}
                  className="justify-start bg-yellow-50 text-amber-900 hover:bg-yellow-100"
                  onClick={() => setColorTheme("sepia")}
                >
                  Sepia
                </Button>
                <Button
                  variant={colorTheme === "blue" ? "default" : "ghost"}
                  className="justify-start bg-blue-50 text-blue-900 hover:bg-blue-100"
                  onClick={() => setColorTheme("blue")}
                >
                  Blue
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Document Info */}
      <div className="p-4 border-b opacity-80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">Year: {document.year}</div>
          <div className="text-sm">{document.ministry}</div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div 
            className="font-nepali leading-relaxed whitespace-pre-wrap"
            style={{ fontSize: `${fontSize}px` }}
          >
            {document.content ? (
              highlightText(document.content, searchQuery)
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-current/30 rounded-lg">
                <FileText className="h-16 w-16 opacity-50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Content Coming Soon</h3>
                <p className="opacity-80 mb-4 max-w-md mx-auto">
                  {document.description}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DocumentPreview;
