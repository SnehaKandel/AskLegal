
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, BookOpen, Settings, User, LogIn, LogOut, Moon, Sun, Search, BookAudio, Languages, CalendarClock, ChevronDown, BarChart3, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Apply theme on initial load
    applyTheme(isDarkMode);
  }, []);
  
  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    
    // Show toast notification for better UX
    toast({
      title: newDarkMode ? "Dark mode enabled" : "Light mode enabled",
      description: newDarkMode 
        ? "The interface has switched to dark mode." 
        : "The interface has switched to light mode.",
      duration: 2000,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "सफलतापूर्वक लगआउट गरियो",
      description: "तपाईं सफलतापूर्वक लगआउट हुनुभएको छ।",
    });
    navigate('/');
  };
  
  return (
    <nav className={`theme-transition ${isDarkMode ? 'navbar-dark' : 'navbar-light'} py-4 px-4 sticky top-0 z-50`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-asklegal-heading text-xl font-bold theme-transition flex items-center gap-2">
          AskLegal
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Moon size={18} className={`${!isDarkMode ? 'text-gray-400' : 'text-yellow-300'} theme-transition`} />
            <Switch 
              checked={isDarkMode}
              onCheckedChange={toggleTheme}
              className="theme-transition data-[state=checked]:bg-asklegal-purple"
              aria-label="Toggle theme"
            />
            <Sun size={18} className={`${isDarkMode ? 'text-gray-400' : 'text-amber-500'} theme-transition`} />
          </div>
          
          <Link to="/news" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <FileText size={18} />
            <span className="hidden md:inline">News</span>
          </Link>
          
          <Link to="/discussion" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <MessageSquare size={18} />
            <span className="hidden md:inline">Discussion</span>
          </Link>
          
          <Link to="/kanoon-search" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <Search size={18} />
            <span className="hidden md:inline">Kanoon</span>
          </Link>
          
          <Link to="/forms" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <BookOpen size={18} />
            <span className="hidden md:inline">Forms</span>
          </Link>
          
          <Link to="/analytics" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <BarChart3 size={18} />
            <span className="hidden md:inline">Analytics</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-1 text-asklegal-heading hover:text-asklegal-purple hover:bg-transparent"
              >
                <Languages size={18} />
                <span className="hidden md:inline">Tools</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/tools?tab=translator')}>
                <Languages className="mr-2 h-4 w-4" />
                <span>Translator</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/tools?tab=date-converter')}>
                <CalendarClock className="mr-2 h-4 w-4" />
                <span>Date Converter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/play" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <BookAudio size={18} />
            <span className="hidden md:inline">Quiz</span>
          </Link>
          
          <Link to="/settings" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
            <Settings size={18} />
            <span className="hidden md:inline">Settings</span>
          </Link>
          
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center text-asklegal-heading hover:text-asklegal-purple gap-2 theme-transition">
              <User size={18} />
              <span className="hidden md:inline">Admin</span>
            </Link>
          )}
          
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 border border-asklegal-purple/30 text-asklegal-purple hover:bg-asklegal-purple/10"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2 border border-asklegal-purple/30 text-asklegal-purple hover:bg-asklegal-purple/10"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
