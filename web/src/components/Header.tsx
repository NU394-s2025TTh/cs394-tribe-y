import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white dark:bg-gray-800 px-4 shadow-sm transition-colors duration-300">
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 mr-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">JSON</span> Visualizer
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-full transition-colors duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
    </header>
  );
};