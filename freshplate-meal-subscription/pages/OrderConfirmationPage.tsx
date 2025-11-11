import React from 'react';
import type { Order, Subscription } from '../types';

interface OrderConfirmationPageProps {
  order: Order | null;
  subscription: Subscription | null;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, subscription }) => {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">No order to display.</h1>
        <p className="mt-2 text-slate-600">Please complete the checkout process first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="mt-4 text-3xl font-extrabold text-emerald-600">Thank you for your order!</h1>
        <p className="mt-4 text-lg text-slate-600">Your monthly subscription is now active. We've received your order and will start preparing it right away.</p>
        <p className="mt-2 text-slate-500">Your order reference number is: <strong className="text-slate-800">{order.referenceNumber}</strong></p>
        {subscription && (
            <p className="mt-2 text-slate-500">
                Your plan is active until: <strong className="text-slate-800">{new Date(subscription.endDate).toLocaleDateString()}</strong>
            </p>
        )}
      </div>

      <div className="mt-10 bg-white shadow-sm rounded-lg p-6 border border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">Order Details</h2>
          <dl className="mt-4 space-y-4">
              <div className="flex justify-between">
                  <dt className="text-sm text-slate-500">Order Reference</dt>
                  <dd className="text-sm font-medium text-slate-800">{order.referenceNumber}</dd>
              </div>
              <div className="flex justify-between">
                  <dt className="text-sm text-slate-500">Order Date</dt>
                  <dd className="text-sm font-medium text-slate-800">{new Date(order.orderDate).toLocaleDateString()}</dd>
              </div>
              <div className="border-t border-slate-200 pt-4 mt-4">
                <ul className="space-y-2">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm">
                            <span className="text-slate-600">{item.name} <span className="text-slate-400">x {item.quantity}</span></span>
                            <span className="font-medium text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold">
                  <dt className="text-base text-slate-900">Total</dt>
                  <dd className="text-base text-slate-900">${order.totalAmount.toFixed(2)}</dd>
              </div>
          </dl>
      </div>

    </div>
  );
};