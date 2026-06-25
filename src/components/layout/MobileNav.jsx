import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';

export default function MobileNav({ darkMode, activeTab, setActiveTab }) {
  return (
    <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 sm:hidden">
      <div className={`flex items-center gap-1.5 p-1.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] border backdrop-blur-xl ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200/80'}`}>
        <button onClick={() => setActiveTab('borang')} className={`flex items-center justify-center h-12 rounded-full transition-all ${activeTab === 'borang' ? (darkMode ? 'text-[#f39200] bg-slate-800 border-slate-700/60 px-5 font-bold' : 'text-[#4A154B] bg-[#4A154B]/5 px-5 font-bold') : 'text-slate-500 w-12'}`}>
          <FileText className="w-5 h-5 shrink-0" />
          {activeTab === 'borang' && <span className="text-[11px] font-bold ml-2">Borang</span>}
        </button>
        <button onClick={() => setActiveTab('laporan')} className={`flex items-center justify-center h-12 rounded-full transition-all ${activeTab === 'laporan' ? (darkMode ? 'text-[#f39200] bg-slate-800 border-slate-700/60 px-5 font-bold' : 'text-[#4A154B] bg-[#4A154B]/5 px-5 font-bold') : 'text-slate-500 w-12'}`}>
          <ShieldCheck className="w-5 h-5 shrink-0" />
          {activeTab === 'laporan' && <span className="text-[11px] font-bold ml-2">Admin</span>}
        </button>
      </div>
    </div>
  );
}