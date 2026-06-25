import React, { useState, useEffect } from 'react';
import { Building2, Sun, Moon, FileText, ShieldCheck } from 'lucide-react';

export default function Navbar({ darkMode, toggleDarkMode, activeTab, setActiveTab }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 60) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]); // [cite: 26, 27]

  return (
    <nav className={`no-print fixed top-0 w-full border-b shadow-[0_4px_20px_rgb(0,0,0,0.15)] z-50 transition-transform duration-500 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'} ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#4A154B] border-white/10'}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className={`p-2.5 rounded-xl border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white/10 border-white/20'}`}>
            <Building2 className="w-5 h-5 text-[#f39200]" />
          </div>
          <div>
            <h1 className="text-lg font-black leading-tight tracking-tight text-white">V-Log<span className="text-[#f39200]">@USM</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Pusat Islam</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-slate-700 text-yellow-400' : 'bg-white/10 text-white'}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className={`hidden sm:flex items-center relative p-1.5 rounded-2xl border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-black/20 border-white/10'}`}>
            <button onClick={() => setActiveTab('borang')} className={`relative z-10 w-[150px] py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'borang' ? 'text-white bg-[#f39200]' : 'text-white/60'}`}>
              <FileText className="w-4 h-4" /> Borang
            </button>
            <button onClick={() => setActiveTab('laporan')} className={`relative z-10 w-[150px] py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'laporan' ? 'text-white bg-[#f39200]' : 'text-white/60'}`}>
              <ShieldCheck className="w-4 h-4" /> Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}