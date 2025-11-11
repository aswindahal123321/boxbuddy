import React, { useState } from 'react';
import type { Product } from '../types';
import { ShoppingCartIcon, PencilIcon, TrashIcon, PlusIcon } from './icons'; // Assuming PlusIcon is for quantity

const MinusIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart: (quantity: number) => void;
  onViewProduct: () => void;
  hasActiveSubscription: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin, onEdit, onDelete, onAddToCart, onViewProduct, hasActiveSubscription }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handleAddToCartClick = () => {
      onAddToCart(quantity);
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
      <button
        onClick={!isAdmin ? onViewProduct : undefined}
        disabled={isAdmin}
        className="aspect-w-3 aspect-h-2 bg-slate-200 sm:aspect-none sm:h-60 cursor-pointer disabled:cursor-default"
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity"
        />
      </button>
      <div className="flex-1 p-4 space-y-2 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900">
          <button
            onClick={!isAdmin ? onViewProduct : undefined}
            disabled={isAdmin}
            className="text-left hover:text-emerald-600 transition-colors disabled:cursor-default"
          >
            {product.name}
          </button>
        </h3>
        <p className="text-sm text-slate-500 flex-1">{product.description}</p>
        <div className="flex justify-between items-center pt-2">
            <p className="text-xl font-semibold text-slate-900">${product.price.toFixed(2)}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800`}>
                {product.category}
            </span>
        </div>
      </div>
      {!isAdmin && (
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Quantity per week:</label>
            <div className="flex items-center rounded-lg border border-slate-300">
              <button onClick={() => handleQuantityChange(-1)} className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-50" disabled={quantity <= 1}>
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="px-3 text-center font-medium w-12">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="p-2 text-slate-500 hover:text-slate-800">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button 
            onClick={handleAddToCartClick}
            disabled={hasActiveSubscription}
            className="w-full bg-slate-800 text-white font-semibold py-3 px-4 flex items-center justify-center space-x-2 rounded-md hover:bg-emerald-600 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            title={hasActiveSubscription ? "Cancel your active subscription to add new items" : "Add to Cart"}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span>{hasActiveSubscription ? 'Subscription Active' : 'Add to Cart'}</span>
          </button>
        </div>
      )}
      {isAdmin && (
        <div className="grid grid-cols-2 border-t border-slate-200">
          <button onClick={onEdit} className="w-full bg-slate-100 text-slate-700 font-semibold py-3 px-4 flex items-center justify-center space-x-2 hover:bg-yellow-100 hover:text-yellow-800 transition-colors">
            <PencilIcon className="w-5 h-5" />
            <span>Edit</span>
          </button>
          <button onClick={onDelete} className="w-full bg-red-50 text-red-700 font-semibold py-3 px-4 flex items-center justify-center space-x-2 hover:bg-red-100 hover:text-red-900 transition-colors border-l border-slate-200">
            <TrashIcon className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};