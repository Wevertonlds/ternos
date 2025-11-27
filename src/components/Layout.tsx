import React from 'react';
import Header from './Header';
import { Toaster } from "@/components/ui/sonner"

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Toaster richColors />
    </div>
  );
};

export default Layout;