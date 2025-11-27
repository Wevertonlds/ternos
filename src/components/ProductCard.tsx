import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/data/products';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-lg font-semibold">${product.price}</p>
        <Button>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;