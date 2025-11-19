export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'cake' | 'donut' | 'pastry';
}

export interface CartItem extends Product {
  quantity: number;
  customText?: string;
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed';
  created_at?: string;
  customer_message: string;
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  created_at?: string;
}
