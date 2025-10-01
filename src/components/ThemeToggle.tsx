import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full border-2 border-transparent bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-glow group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative flex items-center justify-center">
        <Sun 
          className={`h-5 w-5 transition-all duration-500 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 text-primary' 
              : 'rotate-90 scale-0 text-muted-foreground'
          }`}
        />
        <Moon 
          className={`absolute h-5 w-5 transition-all duration-500 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 text-primary' 
              : '-rotate-90 scale-0 text-muted-foreground'
          }`}
        />
      </div>
      
      {/* Animated background glow */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-glow' 
          : 'bg-gradient-to-r from-blue-400/10 to-purple-400/10'
      }`} />
    </Button>
  );
}

export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20 transition-all duration-300 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-gradient-primary shadow-card transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {theme === 'light' ? (
            <Sun className="h-3 w-3 text-white" />
          ) : (
            <Moon className="h-3 w-3 text-white" />
          )}
        </span>
      </span>
    </button>
  );
}
