import React from 'react';
import { Building2 } from 'lucide-react';

export default function Footer({ darkMode }) {
  return (
    <footer className={`no-print w-full text-center pb-[90px] sm:pb-6 pt-5 px-4 mt-auto relative z-10 border-t ${darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-[#4A154B]/10 bg-gradient-to-b from-transparent to-[#4A154B]/5'}`}>
      <div className="flex flex-col items-center justify-center gap-3">
        <img src="USM APEX-Ver-R-88255cc4.webp" alt="Logo USM APEX" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm opacity-90" />
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${darkMode ? 'text-slate-500' : 'text-[#4A154B]/60'}`}>
             &copy; {new Date().getFullYear()} Hakcipta Terpelihara V-Log@USM
          </p>
          <div className="flex justify-center items-center gap-1.5 text-[#f39200]">
            <Building2 className="w-3.5 h-3.5" />
            <p className={`text-[10px] font-bold tracking-wide ${darkMode ? 'text-slate-400' : 'text-[#4A154B]/80'}`}>Pusat Islam USM Pulau Pinang</p>
          </div>
        </div>
      </div>
    </footer>
  );
}