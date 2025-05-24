import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { BookmarkIcon, MessageCircle, User, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#5E3838]/10 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#311336]">Swipe N' Bite</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link 
            to="/eat-list" 
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#752323] ${
              isActive('/eat-list') ? 'text-[#752323]' : 'text-[#5E3838]'
            }`}
          >
            <BookmarkIcon className="h-4 w-4" />
            <span>Eat-List</span>
          </Link>
          
          <Link 
            to="/food-cupid" 
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#752323] ${
              isActive('/food-cupid') ? 'text-[#752323]' : 'text-[#5E3838]'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Food Cupid</span>
          </Link>
          
          <Link 
            to="/tweet-about" 
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#752323] ${
              isActive('/tweet-about') ? 'text-[#752323]' : 'text-[#5E3838]'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Tweet About</span>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 rounded-full text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Hello, {user?.username || 'User'}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[#311336]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10">
                <Link to="/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-[#5E3838] hover:text-[#752323] hover:bg-[#752323]/10">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
