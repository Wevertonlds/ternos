import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop')" }}
      ></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-bold font-display animate-fade-in">The Ultimate Sneaker Hub</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Discover the latest trends, timeless classics, and exclusive drops. Your next favorite pair is just a click away.
        </p>
        <Link to="/sneakers" className="mt-8 inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button size="lg">Explore Collection</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;