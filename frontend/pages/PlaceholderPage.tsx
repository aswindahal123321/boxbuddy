import React from 'react';

interface PlaceholderPageProps {
  title: string;
  message: string;
  onNavigate: (page: string) => void;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">{title}</h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">{message}</p>
      <button
        onClick={() => onNavigate('home')}
        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        &larr; Back to Home
      </button>
    </div>
  );
};
