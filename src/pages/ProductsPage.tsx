import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { UserTie, Shirt, Necktie } from 'lucide-react';

const ProductsPage = () => {
  const categories = [
    { name: 'Todos', value: 'Todos', icon: null },
    { name: 'Ternos', value: 'Terno', icon: <UserTie className="mr-2 h-4 w-4" /> },
    { name: 'Camisas', value: 'Camisa', icon: <Shirt className="mr-2 h-4 w-4" /> },
    { name: 'Sapatos', value: 'Sapato', icon: null },
    { name: 'Cintos', value: 'Cinto', icon: null },
    { name: 'Gravatas', value: 'Gravata', icon: <Necktie className="mr-2 h-4 w-4" /> },
    { name: 'Meias', value: 'Meia', icon: null },
  ];

  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProducts =
    activeCategory === 'Todos'
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <div className="bg-white">
      <div className="container mx-auto py-24 pt-32 text-center">
        <h1 className="text-5xl font-bold font-display animate-fade-in">Nossa Coleção</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Peças cuidadosamente selecionadas para o homem moderno
        </p>
        <div className="flex justify-center flex-wrap gap-2 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.value ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.value)}
              className={`transition-all duration-200 ${
                activeCategory === category.value ? 'bg-brand text-brand-foreground hover:bg-brand/90' : 'bg-transparent'
              }`}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;