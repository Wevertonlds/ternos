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
    name: 'Terno Slim Fit Azul Marinho',
    brand: 'Alfaiataria Premium',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1593032465175-3a4905c38335?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Camisa Social Branca',
    brand: 'Elegance Wear',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1589310243389-66a8b3511aff?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Gravata de Seda Italiana',
    brand: 'Silk Tie Co.',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1589578523433-113f4bee338a?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Sapato Oxford de Couro',
    brand: 'Classic Footwear',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop',
  },
    {
    id: 5,
    name: 'Blazer de Lã Cinza',
    brand: 'Alfaiataria Premium',
    price: 550,
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1964&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Calça de Alfaiataria Preta',
    brand: 'Elegance Wear',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=1987&auto=format&fit=crop',
  },
];