import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Calendar, ShoppingBag, Menu, X } from 'lucide-react';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import SchedulingModal from './SchedulingModal';

const Header = () => {
  const { fittingItems } = useFittingRoom();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <Link to="/" className="text-2xl font-bold font-display tracking-wider" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="text-brand">La</span> hermandad
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">
              Produtos
            </Link>
            <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
              Como Funciona
            </Link>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="icon" className="relative" onClick={() => setIsModalOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {fittingItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand text-brand-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {fittingItems.length}
                </span>
              )}
            </Button>
            <Button className="hidden sm:flex bg-brand hover:bg-brand/90 text-brand-foreground" onClick={() => setIsModalOpen(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background md:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center space-y-6">
            <Link to="/products" className="text-lg text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Produtos
            </Link>
            <Link to="/how-it-works" className="text-lg text-foreground/80 hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Como Funciona
            </Link>
            <Button className="w-full max-w-xs bg-brand hover:bg-brand/90 text-brand-foreground sm:hidden" onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </Button>
          </div>
        </div>
      )}

      <SchedulingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;