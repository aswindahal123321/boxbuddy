import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center z-50 transition-opacity" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4 relative transform transition-all">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};
