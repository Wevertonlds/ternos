import React from 'react';
import SneakerCard from '@/components/SneakerCard';
import { sneakers } from '@/data/sneakers';

const SneakersPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Sneaker Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id} sneaker={sneaker} />
        ))}
      </div>
    </div>
  );
};

export default SneakersPage;