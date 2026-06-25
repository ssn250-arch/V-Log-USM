import React, { useState } from 'react';
import { ShieldCheck, UserCircle2, KeyRound, ChevronRight } from 'lucide-react';

export default function AdminLogin({ darkMode, onLogin }) {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'abc@12345') {
      onLogin(true);
      setLoginError('');
    } else {
      setLoginError('ID Pengguna atau Kata Laluan tidak sah.');
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-6 p-8 rounded-[1.5rem] shadow-sm border text-center ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/60'}`}>
      <ShieldCheck className={`w-10 h-10 mx-auto ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`} />
      <h2 className="text-2xl font-bold mt-4">Akses V-Log@USM</h2>
      <form onSubmit={handleSubmit} className="space-y-5 text-left mt-6">
        {loginError && <div className="text-[11px] font-bold p-3 rounded-lg border text-center bg-red-50 text-red-600">{loginError}</div>}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold">ID Pengguna</label>
          <div className="relative">
            <UserCircle2 className="w-4 h-4 absolute top-3.5 left-3.5 text-slate-400" />
            <input type="text" onChange={e => setLoginData({...loginData, username: e.target.value})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="Masukkan ID" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold">Kata Laluan</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute top-3.5 left-3.5 text-slate-400" />
            <input type="password" onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="••••••••" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-[#f39200] text-white font-bold py-3.5 rounded-xl flex justify-center gap-2">Log Masuk <ChevronRight className="w-4 h-4"/></button>
      </form>
    </div>
  );
}