export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Vegan' | 'Chicken' | 'Beef' | 'Fish';
  calories: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Processing' | 'Packaged' | 'Shipped' | 'Delivered' | 'Refund Requested' | 'Refunded';

export interface Order {
  id: number;
  userId: number;
  referenceNumber: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: Date;
  status: OrderStatus;
}

export interface Subscription {
  id: number;
  orderId: number;
  startDate: Date;
  endDate: Date;
  items: CartItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In a real app, this should be a hash
  role: 'user' | 'admin';
}