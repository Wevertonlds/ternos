export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Air Max 270',
    brand: 'Nike',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'UltraBoost 21',
    brand: 'Adidas',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Classic Leather',
    brand: 'Reebok',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Old Skool',
    brand: 'Vans',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1965&auto=format&fit=crop',
  },
    {
    id: 5,
    name: 'Chuck Taylor All Star',
    brand: 'Converse',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1516478177764-9fe567e9777d?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Gel-Kayano 27',
    brand: 'ASICS',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1935&auto=format&fit=crop',
  },
];