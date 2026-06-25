import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddItemModal({ title, placeholder, onAdd, onClose, darkMode }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) onAdd(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className={`rounded-2xl max-w-md w-full p-6 space-y-4 border ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border rounded-xl" onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
        <div className="flex gap-3">
          <button onClick={handleAdd} className="flex-1 bg-[#f39200] text-white font-bold py-3 rounded-xl">Tambah</button>
          <button onClick={onClose} className="flex-1 bg-slate-100 font-bold py-3 rounded-xl">Batal</button>
        </div>
      </div>
    </div>
  );
}