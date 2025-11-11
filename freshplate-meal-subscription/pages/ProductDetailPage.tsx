import React, { useState } from 'react';
import type { Product } from '../types';
import { ShoppingCartIcon, PlusIcon } from '../components/icons';

const MinusIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

interface ProductDetailPageProps {
  product: Product | null;
  onAddToCart: (product: Product, quantity: number) => void;
  hasActiveSubscription: boolean;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, hasActiveSubscription, onBack }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Meal Not Found</h1>
        <p className="mt-4 text-slate-500">The meal you're looking for doesn't exist.</p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <button onClick={onBack} className="text-emerald-600 font-medium hover:text-emerald-500 mb-8">
        &larr; Back to Menu
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 self-start mb-2`}>
            {product.category}
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900">{product.name}</h1>
          <p className="text-3xl font-semibold text-slate-800 mt-4">${product.price.toFixed(2)}</p>
          <p className="mt-6 text-slate-600 text-lg leading-relaxed">{product.description}</p>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-medium text-slate-700">Quantity per week:</label>
              <div className="flex items-center rounded-lg border border-slate-300">
                <button onClick={() => handleQuantityChange(-1)} className="p-3 text-slate-500 hover:text-slate-800 disabled:opacity-50" disabled={quantity <= 1}>
                  <MinusIcon className="w-5 h-5" />
                </button>
                <span className="px-4 text-center font-medium text-lg w-16">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="p-3 text-slate-500 hover:text-slate-800">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCartClick}
              disabled={hasActiveSubscription}
              className="w-full bg-slate-800 text-white font-semibold py-4 px-4 flex items-center justify-center space-x-2 rounded-md hover:bg-emerald-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed text-lg"
              title={hasActiveSubscription ? "Cancel your active subscription to add new items" : "Add to Cart"}
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span>{hasActiveSubscription ? 'Subscription Active' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};