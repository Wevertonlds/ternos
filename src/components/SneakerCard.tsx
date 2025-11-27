import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sneaker } from '@/data/sneakers';
import { Button } from './ui/button';

interface SneakerCardProps {
  sneaker: Sneaker;
}

const SneakerCard: React.FC<SneakerCardProps> = ({ sneaker }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={sneaker.imageUrl} alt={sneaker.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold">{sneaker.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{sneaker.brand}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-lg font-semibold">${sneaker.price}</p>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default SneakerCard;