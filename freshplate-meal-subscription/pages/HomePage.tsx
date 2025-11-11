import React from 'react';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';
import type { Product } from '../types';

interface HomePageProps {
  products: Product[];
  activeSubscription: any;
  addToCart: (product: Product, quantity: number) => void;
  onViewProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, activeSubscription, addToCart, onViewProduct }) => {
  return (
    <>
      <Hero />
      <ProductList 
        products={products}
        isAdmin={false} // ProductList on homepage is always for users
        onEdit={() => {}} // Not used in user view
        onDelete={() => {}} // Not used in user view
        onCreate={() => {}} // Not used in user view
        onAddToCart={addToCart}
        onViewProduct={onViewProduct}
        hasActiveSubscription={!!activeSubscription}
      />
    </>
  );
};