import type { Product, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Lemon Herb Salmon',
    description: 'Perfectly baked salmon with a zesty lemon-herb crust, served with roasted asparagus and quinoa.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Fish',
  },
  {
    id: 2,
    name: 'Vegan Buddha Bowl',
    description: 'A vibrant mix of chickpeas, avocado, sweet potato, and fresh greens with a tahini dressing.',
    price: 12.50,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Vegan',
  },
  {
    id: 3,
    name: 'Classic Beef Stir-fry',
    description: 'Tender beef strips and crisp vegetables tossed in a savory soy-ginger sauce, served over jasmine rice.',
    price: 13.75,
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b70a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Beef',
  },
  {
    id: 4,
    name: 'Grilled Chicken & Veggies',
    description: 'Juicy grilled chicken breast paired with a colorful medley of seasonal roasted vegetables.',
    price: 13.25,
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afb74b693450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Chicken',
  },
    {
    id: 5,
    name: 'Spicy Tofu Scramble',
    description: 'A hearty and flavorful tofu scramble with black beans, corn, and a kick of chipotle.',
    price: 11.99,
    imageUrl: 'https://images.unsplash.com/photo-1625944230154-2150275e7536?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Vegan',
  },
  {
    id: 6,
    name: 'Teriyaki Chicken Bowl',
    description: 'Sweet and savory teriyaki-glazed chicken with steamed broccoli and fluffy white rice.',
    price: 13.50,
    imageUrl: 'https://images.unsplash.com/photo-1606625841459-58b090c2e431?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Chicken',
  },
];

export const ADMIN_USER: User = {
  id: 999,
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin',
  role: 'admin',
};

export const INITIAL_USERS: User[] = [
  {
    id: 101,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user',
  },
];