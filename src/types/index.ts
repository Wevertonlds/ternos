export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category: 'Terno' | 'Camisa' | 'Gravata' | 'Sapato' | 'Cinto' | 'Meia';
  sizes: string[];
  created_at?: string;
}