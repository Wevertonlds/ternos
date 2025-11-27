import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mouse } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold font-display animate-fade-in">
          Elegância que <br />
          <span className="text-brand">vem até você</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Agende uma visita e vamos até você. É fácil: escolha nossos produtos e levamos até você, no conforto do seu lar ou onde estiver.
        </p>
        <Link to="/products" className="mt-8 inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground h-14 px-8 text-lg">
            Conhecer Coleção
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-8 z-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <Mouse className="h-8 w-8 text-white/50" />
      </div>
    </div>
  );
};

export default HomePage;