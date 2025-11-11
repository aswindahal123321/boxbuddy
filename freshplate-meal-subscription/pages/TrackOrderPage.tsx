import React, { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../types';

interface TrackOrderPageProps {
  allOrders: Order[];
  initialTrackingNumber: string | null;
  clearInitialTrackingNumber: () => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Processing': return 'bg-blue-100 text-blue-800';
    case 'Packaged': return 'bg-yellow-100 text-yellow-800';
    case 'Shipped': return 'bg-indigo-100 text-indigo-800';
    case 'Delivered': return 'bg-emerald-100 text-emerald-800';
    case 'Refund Requested': return 'bg-orange-100 text-orange-800';
    case 'Refunded': return 'bg-slate-200 text-slate-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ allOrders, initialTrackingNumber, clearInitialTrackingNumber }) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  const findOrder = (refNum: string) => {
    setError('');
    setTrackedOrder(null);
    if (!refNum) {
      setError('Please enter a reference number.');
      return;
    }
    const foundOrder = allOrders.find(o => o.referenceNumber.toLowerCase() === refNum.toLowerCase());
    if (foundOrder) {
      setTrackedOrder(foundOrder);
    } else {
      setError('Invalid reference number. Please check and try again.');
    }
  };

  useEffect(() => {
    if (initialTrackingNumber) {
      findOrder(initialTrackingNumber);
      clearInitialTrackingNumber();
    }
  }, [initialTrackingNumber]);

  const handleTrackPackage = (e: React.FormEvent) => {
    e.preventDefault();
    findOrder(trackingNumber);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="mt-8">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center">Track Your Package</h2>
        <p className="mt-2 text-center text-slate-500">Enter the reference number from your order confirmation.</p>
        <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
          <form onSubmit={handleTrackPackage} className="flex flex-col sm:flex-row sm:space-x-4">
            <input 
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter reference number (e.g., FP-123456)"
              className="flex-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            />
            <button
              type="submit"
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-900"
            >
              Track Order
            </button>
          </form>

          {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          
          {trackedOrder && (
            <div className="mt-6 border-t pt-6 animate-fade-in">
              <h3 className="text-lg font-medium text-slate-900">Order Status: {trackedOrder.referenceNumber}</h3>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-slate-600">Current Status:</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackedOrder.status)}`}>
                  {trackedOrder.status}
                </span>
              </div>
              
              {trackedOrder.status === 'Refund Requested' || trackedOrder.status === 'Refunded' ? (
                <div className="mt-4 text-center p-4 bg-slate-100 rounded-md">
                  <p className="font-medium text-slate-700">
                    {trackedOrder.status === 'Refund Requested'
                      ? 'A refund has been requested for this order. It is currently being processed by our team.'
                      : 'This order has been successfully refunded.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${trackedOrder.status === 'Processing' ? '25%' : trackedOrder.status === 'Packaged' ? '50%' : trackedOrder.status === 'Shipped' ? '75%' : '100%'}` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Processing</span>
                    <span>Packaged</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};