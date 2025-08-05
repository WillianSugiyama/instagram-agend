import React from 'react';
import { Camera, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="btn-primary text-sm px-4 py-2"
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;