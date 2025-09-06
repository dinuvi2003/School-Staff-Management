import React from 'react';

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-200/80 bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg px-6 py-10 w-11/12 max-w-[600px] relative">
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>
            {children}
        </div>
    </div>
);
};

export default Popup;
