import React from 'react';
import { Camera } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg gradient-primary">
            <Camera className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">Instagram Agent</h1>
            <p className="text-xs text-text-muted">AI Content Creator</p>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              Generator
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors font-medium">
              History
            </a>
          </div>
          <a 
            href="/login" 
            className="btn-primary text-sm px-4 py-2 rounded-lg font-medium"
          >
            Sign In
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;