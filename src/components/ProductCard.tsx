import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/data/products';
import { Button } from './ui/button';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addFittingItem } = useFittingRoom();

  const handleAddItem = (size: string) => {
    addFittingItem(product, size);
    toast.success(`${product.name} (Tamanho: ${size}) adicionado ao provador!`);
  };

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-lg font-semibold">{formattedPrice}</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button>Adicionar ao Provador</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;