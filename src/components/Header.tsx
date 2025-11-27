import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Calendar, ShoppingBag } from 'lucide-react';
import { useFittingRoom } from '@/contexts/FittingRoomContext';

const Header = () => {
  const { fittingItems } = useFittingRoom();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-100/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="text-2xl font-bold font-display tracking-wider">
          <span className="text-brand">PREMIUM</span> MEN
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="text-foreground/80 hover:text-foreground transition-colors">
            Produtos
          </Link>
          <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-colors">
            Como Funciona
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {fittingItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-brand-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {fittingItems.length}
              </span>
            )}
          </Button>
          <Button className="bg-brand hover:bg-brand/90 text-brand-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Agendar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;