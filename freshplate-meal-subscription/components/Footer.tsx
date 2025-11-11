import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-3xl font-bold text-emerald-500">FreshPlate</h2>
            <p className="text-slate-400 text-base">
              Delicious, healthy meals delivered to your doorstep.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Meal Plans</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Gifting</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Privacy</a></li>
                  <li><a href="#" className="text-base text-slate-400 hover:text-white">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-base text-slate-400 xl:text-center">&copy; {new Date().getFullYear()} FreshPlate, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
