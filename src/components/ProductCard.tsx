import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { Button } from './ui/button';
import { useFittingRoom } from '@/contexts/FittingRoomContext';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addFittingItem } = useFittingRoom();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAddItem = () => {
    if (!selectedSize) return;
    addFittingItem(product, selectedSize);
    toast.success(`${product.name} (Tamanho: ${selectedSize}) adicionado ao provador!`);
    setIsPopoverOpen(false);
    setSelectedSize(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      setSelectedSize(null);
    }
  };

  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-0">
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-lg font-semibold">{formattedPrice}</p>
        <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button>Adicionar ao Provador</Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">Selecione o tamanho</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? 'bg-brand text-brand-foreground hover:bg-brand/90' : ''}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={handleAddItem} 
                disabled={!selectedSize}
                className="w-full mt-2"
              >
                Adicionar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;