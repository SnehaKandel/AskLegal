
import React, { useEffect } from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Apply stored theme on initial load
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || 
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-asklegal-dark text-asklegal-text theme-transition">
      <Navbar />
      <main className="flex-1 relative">
        <div className="hero-gradient absolute inset-0 pointer-events-none"></div>
        {children}
      </main>
      <footer className="py-4 border-t border-gray-200 dark:border-gray-800 theme-transition">
        <div className="container mx-auto text-center text-asklegal-text/60 text-sm">
          <p>© {new Date().getFullYear()} AskLegal - Nepal Legal Assistance System</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
