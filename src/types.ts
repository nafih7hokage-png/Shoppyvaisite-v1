export type Currency = 'BDT' | 'USD';

export interface Category {
  id: string;
  name: string;
  image: string;
  icon: string;
  count: number;
}

export interface ProductVariant {
  name: string; // e.g. "Color", "Size", "Weight"
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // Base price in USD
  originalPrice?: number;
  discount?: number; // e.g. 20 for 20%
  image: string;
  images?: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  badge?: 'Hot' | 'Best Seller' | 'Flash Deal' | 'Organic' | 'New';
  variants?: ProductVariant;
}

export interface CartItem {
  id: string; // Unique id combining productId + variant
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: Currency;
  status: 'Processing' | 'Confirmed' | 'Out for Delivery' | 'Delivered';
  shippingDetails: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    postalCode?: string;
    notes?: string;
  };
  paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Rocket' | 'Card';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'discount';
}
