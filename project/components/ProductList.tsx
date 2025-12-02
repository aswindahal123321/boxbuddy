import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onCreate: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProduct: (product: Product) => void;
  hasActiveSubscription: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({ products, isAdmin, onEdit, onCreate, onAddToCart, onViewProduct, hasActiveSubscription }) => {
  return (
    <div className="bg-slate-50" id="menu">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">This Week's Menu</h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isAdmin={isAdmin}
              onEdit={() => onEdit(product)}
              onAddToCart={(quantity) => onAddToCart(product, quantity)}
              onViewProduct={() => onViewProduct(product)}
              hasActiveSubscription={hasActiveSubscription}
            />
          ))}
        </div>
      </div>
    </div>
  );
};