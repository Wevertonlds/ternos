import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/data/products';
import { Button } from './ui/button';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addFittingItem, fittingItems } = useFittingRoom();
  const isInFittingRoom = fittingItems.some((item) => item.id === product.id);

  const handleAddItem = () => {
    addFittingItem(product);
    toast.success(`${product.name} adicionado ao provador!`);
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
        <Button onClick={handleAddItem} disabled={isInFittingRoom}>
          {isInFittingRoom ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Adicionado
            </>
          ) : (
            'Adicionar ao Provador'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;