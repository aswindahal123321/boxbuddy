import React from 'react';

interface HeroProps {
  setCurrentPage: (page: string) => void;
}


export const Hero: React.FC<HeroProps> = ({ setCurrentPage }) => {
  const handleViewPlansClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage('home');
    // Use a timeout to ensure the home page has rendered before scrolling
    setTimeout(() => {
        const menuElement = document.getElementById('menu');
        if (menuElement) {
            menuElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, 0);
  };
  
  return (
    <div className="relative bg-slate-800">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
          alt="Healthy salad"
        />
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Healthy Eating, Made Simple.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-200">
          Delicious, chef-prepared meals delivered right to your door. Stop stressing, start enjoying.
        </p>
        <div className="mt-10">
          <a
            href="#menu"
            onClick={handleViewPlansClick}
            className="bg-emerald-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-600 transition-transform hover:scale-105 inline-block"
          >
            View Our Plans
          </a>
        </div>
      </div>
    </div>
  );
};