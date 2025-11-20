import React from 'react';
import type { CartItem } from '../types';
import { TrashIcon, PlusIcon } from '../components/icons';

const MinusIcon: React.FC<{ className?: string }> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
);

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, newQuantity: number) => void;
  setCurrentPage: (page: string) => void;
  isAuthenticated: boolean;
  setPageBeforeLogin: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart, updateCartQuantity, setCurrentPage, isAuthenticated, setPageBeforeLogin }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (isAuthenticated) {
      setCurrentPage('checkout');
    } else {
      setPageBeforeLogin('checkout');
      setCurrentPage('login');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">Your Cart is Empty</h1>
        <p className="mt-4 text-slate-500">Looks like you haven't added any meals yet. If you have an active subscription, you must cancel it before adding new meals.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Browse Meals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900">Your Cart</h1>
      <div className="mt-12">
        <section>
          <ul role="list" className="border-t border-b border-slate-200 divide-y divide-slate-200">
            {cart.map(item => (
              <li key={item.id} className="flex py-6">
                <div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-md overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-center object-cover" />
                </div>
                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-slate-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-2 text-slate-500 hover:text-slate-800"><MinusIcon className="h-4 w-4" /></button>
                        <p className="px-3">{item.quantity} per week</p>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 text-slate-500 hover:text-slate-800"><PlusIcon className="h-4 w-4" /></button>
                    </div>
                    <div className="flex">
                      <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-red-600 hover:text-red-500 flex items-center space-x-1">
                        <TrashIcon className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between text-base font-medium text-slate-900">
              <p>Subtotal</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Continue'}
              </button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-slate-500">
              <p>
                or <button type="button" onClick={() => setCurrentPage('home')} className="text-emerald-600 font-medium hover:text-emerald-500">Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};