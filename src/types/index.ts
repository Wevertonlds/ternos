export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  category: 'Terno' | 'Camisa' | 'Gravata' | 'Sapato' | 'Cinto' | 'Meia';
  sizes: string[];
  created_at?: string;
}

export interface FittingItem extends Product {
  selectedSize: string;
  fittingId: string; // Unique ID for product-size combo, e.g., "1-M"
}

export type AppointmentStatus = 'Pendente' | 'Finalizado' | 'Cancelado';

export interface Appointment {
  id: number;
  name: string;
  phone: string;
  address: string;
  date: string; // ISO string from Supabase
  fitting_items: FittingItem[];
  status: AppointmentStatus;
  created_at?: string;
}

export interface Settings {
  id?: number;
  site_name: string;
  brand_color: string;
  contact_email: string;
  contact_phone: string;
  footer_quote?: string;
  footer_description?: string;
  footer_signature?: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  created_at?: string;
  image_fit?: 'cover' | 'contain';
  image_position?: 'center' | 'top' | 'bottom';
}