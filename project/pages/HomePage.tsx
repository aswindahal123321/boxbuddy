import React from 'react';
import { Hero } from '../components/Hero';
import { ProductList } from '../components/ProductList';
import type { Product } from '../types';

interface HomePageProps {
  products: Product[];
  hasActiveSubscription: boolean;
  addToCart: (product: Product, quantity: number) => void;
  onViewProduct: (product: Product) => void;
  setCurrentPage: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, hasActiveSubscription, addToCart, onViewProduct, setCurrentPage }) => {
  return (
    <>
      <Hero setCurrentPage={setCurrentPage} />
      <ProductList 
        products={products}
        isAdmin={false} // ProductList on homepage is always for users
        onEdit={() => {}} // Not used in user view
        onCreate={() => {}} // Not used in user view
        onAddToCart={addToCart}
        onViewProduct={onViewProduct}
        hasActiveSubscription={hasActiveSubscription}
      />
    </>
  );
};