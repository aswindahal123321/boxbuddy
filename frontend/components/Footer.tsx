import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
    setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string) => {
    e.preventDefault();
    setCurrentPage(page);
  };
    
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2">
                <Logo className="h-10 w-10 text-emerald-500" />
                <h2 className="text-3xl font-bold text-white">BoxBuddy</h2>
            </div>
            <p className="text-slate-400 text-base">
              Delicious, healthy meals delivered to your doorstep.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-base text-slate-400 hover:text-white">Meal Plans</a></li>
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'pricing')} className="text-base text-slate-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'gifting')} className="text-base text-slate-400 hover:text-white">Gifting</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'about')} className="text-base text-slate-400 hover:text-white">About</a></li>
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'blog')} className="text-base text-slate-400 hover:text-white">Blog</a></li>
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'careers')} className="text-base text-slate-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'privacy')} className="text-base text-slate-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" onClick={(e) => handleNavClick(e, 'terms')} className="text-base text-slate-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-base text-slate-400 xl:text-center">&copy; {new Date().getFullYear()} BoxBuddy, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};