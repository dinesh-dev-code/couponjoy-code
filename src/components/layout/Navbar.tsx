
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-background z-40 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-brand-purple">DealSeeker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/categories" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              Categories
            </Link>
            <Link to="/stores" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              Stores
            </Link>
            <Link to="/top-deals" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
              Top Deals
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative w-60 lg:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search coupons, stores..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/notifications" className="p-2 rounded-md hover:bg-accent">
                <Bell className="h-5 w-5" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/saved-coupons">Saved Coupons</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/cashback">Cashback</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/search" className="p-2 rounded-md hover:bg-accent">
            <Search className="h-5 w-5" />
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              {isAuthenticated ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-0.5">
                    <Link to="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Home
                    </Link>
                    <Link to="/categories" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Categories
                    </Link>
                    <Link to="/stores" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Stores
                    </Link>
                    <Link to="/top-deals" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Top Deals
                    </Link>
                    <Link to="/profile" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Profile
                    </Link>
                    <Link to="/saved-coupons" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Saved Coupons
                    </Link>
                    <Link to="/cashback" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Cashback
                    </Link>
                    <Link to="/notifications" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Notifications
                    </Link>
                    <button 
                      onClick={() => logout()}
                      className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent text-left text-red-500"
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <nav className="flex flex-col gap-0.5">
                    <Link to="/" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Home
                    </Link>
                    <Link to="/categories" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Categories
                    </Link>
                    <Link to="/stores" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Stores
                    </Link>
                    <Link to="/top-deals" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">
                      Top Deals
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link to="/login">
                      <Button className="w-full" variant="outline">Login</Button>
                    </Link>
                    <Link to="/register">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
