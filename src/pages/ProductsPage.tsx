import React from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';

const ProductsPage = () => {
  return (
    <div className="container mx-auto py-28">
      <h1 className="text-3xl font-bold mb-6">Nossa Coleção</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;