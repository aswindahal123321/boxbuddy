import React from 'react';
import type { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onPlaceOrder: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onPlaceOrder }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would process payment here with Stripe, etc.
    // For this demo, we'll just simulate a successful payment.
    onPlaceOrder();
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center">Checkout</h1>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800">Order Summary</h2>
          <ul role="list" className="mt-6 divide-y divide-slate-200">
            {cart.map(item => (
              <li key={item.id} className="flex py-4">
                <div className="flex-shrink-0 w-16 h-16 border border-slate-200 rounded-md overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="ml-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between text-base font-medium text-slate-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-200 pt-6 mt-6">
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="md:col-span-1 mt-10 md:mt-0">
          <h2 className="text-xl font-semibold text-slate-800">Payment Details (Demo)</h2>
          <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name on Card</label>
              <input type="text" name="name" id="name" required placeholder="John Doe" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-slate-700">Card Number</label>
              <input type="text" name="card-number" id="card-number" required placeholder="0000 0000 0000 0000" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="expiration-date" className="block text-sm font-medium text-slate-700">Expiry</label>
                <input type="text" name="expiration-date" id="expiration-date" required placeholder="MM / YY" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
              </div>
              <div className="col-span-2">
                 <label htmlFor="cvc" className="block text-sm font-medium text-slate-700">CVC</label>
                <input type="text" name="cvc" id="cvc" required placeholder="123" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" />
              </div>
            </div>
             <p className="text-xs text-center text-slate-500 pt-2">This is a demo checkout. No real payment will be processed.</p>
            <button
              type="submit"
              className="w-full mt-4 flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Pay ${total.toFixed(2)} & Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};