
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Tag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/'
    },
    {
      icon: Search,
      label: 'Search',
      href: '/search'
    },
    {
      icon: Tag,
      label: 'Categories',
      href: '/categories'
    },
    {
      icon: Heart,
      label: 'Saved',
      href: isAuthenticated ? '/saved-coupons' : '/login'
    },
    {
      icon: User,
      label: 'Profile',
      href: isAuthenticated ? '/profile' : '/login'
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full",
              location.pathname === item.href
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
