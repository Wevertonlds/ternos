export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: 'Terno' | 'Camisa' | 'Gravata' | 'Sapato' | 'Cinto' | 'Meia';
  sizes: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Terno Slim Fit Azul Marinho',
    brand: 'Alfaiataria Premium',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1618307225142-9d4361e5a1a9?q=80&w=1974&auto=format&fit=crop',
    category: 'Terno',
    sizes: ['P', 'M', 'G', 'GG', '46', '48', '50', '52', '54'],
  },
  {
    id: 2,
    name: 'Camisa Social Branca',
    brand: 'Elegance Wear',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1589310243389-66a8b3511aff?q=80&w=1974&auto=format&fit=crop',
    category: 'Camisa',
    sizes: ['P', 'M', 'G', 'GG', '38', '39', '40', '41', '42'],
  },
  {
    id: 3,
    name: 'Gravata de Seda Italiana',
    brand: 'Silk Tie Co.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1589578523433-113f4bee338a?q=80&w=1974&auto=format&fit=crop',
    category: 'Gravata',
    sizes: ['Tamanho Único'],
  },
  {
    id: 4,
    name: 'Sapato Oxford de Couro',
    brand: 'Classic Footwear',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
    category: 'Sapato',
    sizes: ['39', '40', '41', '42', '43'],
  },
  {
    id: 5,
    name: 'Blazer de Lã Cinza',
    brand: 'Alfaiataria Premium',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1964&auto=format&fit=crop',
    category: 'Terno',
    sizes: ['P', 'M', 'G', 'GG', '46', '48', '50', '52'],
  },
  {
    id: 6,
    name: 'Calça de Alfaiataria Preta',
    brand: 'Elegance Wear',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1987&auto=format&fit=crop',
    category: 'Terno',
    sizes: ['P', 'M', 'G', 'GG', '38', '40', '42', '44', '46'],
  },
  {
    id: 7,
    name: 'Cinto de Couro Marrom',
    brand: 'Leather Goods',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1620909390382-687495a73336?q=80&w=1974&auto=format&fit=crop',
    category: 'Cinto',
    sizes: ['90cm', '100cm', '110cm'],
  },
  {
    id: 8,
    name: 'Meias de Algodão Egípcio',
    brand: 'Comfort Sox',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1586350977803-6703837b69f3?q=80&w=1974&auto=format&fit=crop',
    category: 'Meia',
    sizes: ['Tamanho Único'],
  },
];