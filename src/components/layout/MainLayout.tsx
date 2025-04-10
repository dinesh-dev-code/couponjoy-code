
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNavbar from './MobileNavbar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-16 pb-20 sm:pb-16">
        <Outlet />
      </main>
      <Footer />
      <MobileNavbar />
      <Toaster />
    </div>
  );
};

export default MainLayout;
