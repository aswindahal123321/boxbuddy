import React, { useState } from 'react';
import type { Product, Order, OrderStatus, User } from '../types';
import { ProductList } from '../components/ProductList';
import { PlusIcon, TrashIcon } from '../components/icons';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  users: User[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onCreateProduct: () => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  onDeleteUser: (userId: number) => void;
  onDeleteOrder: (orderId: number) => void;
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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, users, onEditProduct, onDeleteProduct, onCreateProduct, onUpdateStatus, onDeleteUser, onDeleteOrder }) => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-900">Admin Dashboard</h1>

      <div className="mt-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('products')}
            className={`${
              activeTab === 'products'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Manage Users ({users.length})
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'products' && (
          <div>
            <div className="sm:flex sm:items-baseline sm:justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">Meal Menu</h2>
                <button
                onClick={onCreateProduct}
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add New Meal
                </button>
            </div>
            <ProductList 
                products={products}
                isAdmin={true}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
                onCreate={onCreateProduct}
                onAddToCart={() => {}} // Not used in admin view
                onViewProduct={() => {}} // Not used in admin view
                hasActiveSubscription={false} // Not used in admin view
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-8">Customer Orders</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{order.referenceNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {order.status === 'Refund Requested' ? (
                          <button
                            onClick={() => onUpdateStatus(order.id, 'Refunded')}
                            className="bg-orange-200 text-orange-800 hover:bg-orange-300 px-3 py-1.5 rounded-md font-semibold text-xs"
                          >
                            Process Refund
                          </button>
                        ) : order.status === 'Refunded' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className={`rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${getStatusColor(order.status).replace('text', 'bg').replace('-800', '-500/20')}`}
                          >
                            <option>Processing</option>
                            <option>Packaged</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="flex items-center space-x-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md"
                          aria-label={`Delete order ${order.referenceNumber}`}
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                   {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-500">No orders yet.</td>
                        </tr>
                   )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-8">Registered Users</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => onDeleteUser(user.id)} 
                          className="flex items-center space-x-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>Delete User</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-slate-500">No registered users found.</td>
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