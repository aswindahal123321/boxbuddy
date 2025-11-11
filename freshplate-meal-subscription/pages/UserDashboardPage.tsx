import React, { useState } from 'react';
import type { Subscription, Order, OrderStatus } from '../types';

interface UserDashboardPageProps {
  activeSubscription: Subscription | null;
  userOrders: Order[];
  onCancelSubscription: () => void;
  setCurrentPage: (page: string) => void;
  onTrackOrder: (referenceNumber: string) => void;
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

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ activeSubscription, userOrders, onCancelSubscription, setCurrentPage, onTrackOrder }) => {
  const [activeTab, setActiveTab] = useState('subscription');
  
  const subscriptionEndDate = activeSubscription ? new Date(activeSubscription.endDate) : null;
  const subscriptionStartDate = activeSubscription ? new Date(activeSubscription.startDate) : null;
  
  // A subscription is cancellable if it's within 7 days of the start date.
  const isCancellable = activeSubscription && subscriptionStartDate && (new Date().getTime() - subscriptionStartDate.getTime()) < 7 * 24 * 60 * 60 * 1000;


  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900">My Dashboard</h1>

      <div className="mt-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`${
              activeTab === 'subscription'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Subscription
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Order History ({userOrders.length})
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'subscription' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-6">Active Subscription</h2>
            {activeSubscription && subscriptionStartDate && subscriptionEndDate ? (
              <div className="p-6 bg-white rounded-lg shadow-md text-left border border-slate-200">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-lg font-medium text-slate-800">You have an active monthly subscription.</p>
                        <p className="text-sm text-slate-500 mt-1">
                            Active from {subscriptionStartDate.toLocaleDateString()} to {subscriptionEndDate.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 mt-4">Your meals for this subscription:</p>
                <ul className="list-disc list-inside mt-2 text-slate-600 space-y-1">
                  {activeSubscription.items.map(item => (
                    <li key={item.id}><strong>{item.quantity}x</strong> {item.name}</li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="font-medium text-slate-800">Cancellation Policy</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Subscriptions can be cancelled for a refund of the remaining 3 weeks only within the first 7 days of activation. After this period, cancellation is not possible.
                  </p>
                  <button
                    onClick={onCancelSubscription}
                    disabled={!isCancellable}
                    className="mt-4 w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    title={!isCancellable ? "Cancellation period has ended." : "Cancel your subscription"}
                  >
                    Cancel Subscription
                  </button>
                  {!isCancellable && (
                    <p className="mt-2 text-sm text-red-600">
                      The 7-day cancellation window for this subscription has passed.
                    </p>
                  )}
                </div>
              </div>
            ) : (
                <div className="text-center py-12 px-6 bg-white rounded-lg border-2 border-dashed border-slate-300">
                    <h3 className="text-xl font-medium text-slate-800">No Active Subscription</h3>
                    <p className="mt-2 text-slate-500">You do not have an active meal subscription. Browse our menu to get started!</p>
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        Browse Meals
                    </button>
                </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-6">Your Orders</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Track</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {userOrders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.referenceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => onTrackOrder(order.referenceNumber)} className="text-emerald-600 hover:text-emerald-900">Track</button>
                      </td>
                    </tr>
                  ))}
                   {userOrders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-10 text-slate-500">You haven't placed any orders yet.</td>
                        </tr>
                   )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};