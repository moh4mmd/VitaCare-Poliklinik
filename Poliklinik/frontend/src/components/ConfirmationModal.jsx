import React from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, confirmColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ExclamationTriangleIcon className={`w-6 h-6 ${confirmColor.includes('rose') ? 'text-rose-500' : 'text-amber-500'}`} />
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="text-slate-600 text-sm">{message}</p>
        </div>
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
