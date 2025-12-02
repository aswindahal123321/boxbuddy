import React from 'react';
import { ShoppingCartIcon } from './icons';
import { Logo } from './Logo';
import type { User } from '../types';

interface HeaderProps {
  cartItemCount: number;
  currentUser: User | null;
  onLogout: () => void;
  setCurrentPage: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, currentUser, onLogout, setCurrentPage }) => {
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <header className="bg-white/80 backdrop-blur-sm p-4 border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => setCurrentPage(isAdmin ? 'admin' : 'home')} className="flex items-center gap-2 text-2xl font-bold text-slate-800 hover:text-emerald-600 transition-colors">
          <Logo className="h-8 w-8 text-emerald-500" />
          <span className="text-2xl font-bold">BoxBuddy</span>
        </button>
        <nav className="hidden md:flex items-center space-x-6">
          {!isAdmin && <button onClick={() => setCurrentPage('home')} className="text-slate-600 hover:text-emerald-600 transition-colors">Home</button>}
          {!isAdmin && <a href="#menu" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="text-slate-600 hover:text-emerald-600 transition-colors">Meals</a>}
          {currentUser && !isAdmin && <button onClick={() => setCurrentPage('track')} className="text-slate-600 hover:text-emerald-600 transition-colors">Track Order</button>}
          {isAdmin && <button onClick={() => setCurrentPage('admin')} className="text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</button>}
        </nav>
        <div className="flex items-center space-x-4">
          {!isAdmin && (
            <button onClick={() => setCurrentPage('cart')} className="relative text-slate-500 hover:text-emerald-600">
              <ShoppingCartIcon className="h-7 w-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
          
          <div className="border-l border-slate-200 pl-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 hidden sm:inline">
                  Welcome, {currentUser.name.split(' ')[0]}
                </span>
                {!isAdmin && 
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
                  >
                    Dashboard
                  </button>
                }
                <button
                  onClick={onLogout}
                  className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-sm font-semibold text-slate-600 hover:text-emerald-600"
                >
                  Login
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-md hover:bg-emerald-600"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};