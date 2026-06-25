import React, { useState, useMemo } from 'react';
import { Download, LogOut, Building2, Filter, Search, RotateCcw } from 'lucide-react';
import StatCards from './StatCards';
import LogTable from './LogTable';
import { BULAN } from '../../constants';

export default function Dashboard({ darkMode, logs, drivers, vehicles, setDrivers, setVehicles, deleteLog, onEditRecord, setIsAdminLoggedIn }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(5, 7));
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [filterPemandu, setFilterPemandu] = useState('Semua');
  const [filterKenderaan, setFilterKenderaan] = useState('Semua');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (!log.tarikh) return false;
      const [tahun, bulan] = log.tarikh.split('-');
      const matchBulan = filterBulan === 'Semua' || bulan === filterBulan;
      const matchTahun = filterTahun === 'Semua' || tahun === filterTahun;
      const matchPemandu = filterPemandu === 'Semua' || log.pemandu === filterPemandu;
      const matchKenderaan = filterKenderaan === 'Semua' || log.kenderaan === filterKenderaan;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = log.pemandu.toLowerCase().includes(searchLower) || log.tujuan.toLowerCase().includes(searchLower);
      return matchBulan && matchTahun && matchPemandu && matchKenderaan && matchSearch;
    });
  }, [logs, filterBulan, filterTahun, filterPemandu, filterKenderaan, searchQuery]);

  const stats = useMemo(() => {
    const totalTrips = filteredLogs.length;
    const totalKM = filteredLogs.reduce((sum, log) => sum + (parseFloat(log.jarak) || 0), 0);
    return { totalTrips, totalKM, topPemandu: 'Ali', topKenderaan: 'Van' }; // Dimudahkan untuk contoh
  }, [filteredLogs]);

  const resetFilters = () => {
    setSearchQuery(''); setFilterBulan(new Date().toISOString().slice(5, 7));
    setFilterTahun(new Date().getFullYear().toString()); setFilterPemandu('Semua'); setFilterKenderaan('Semua');
  };

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center p-5 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'}`}>
        <h2 className="text-lg font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-[#f39200]" /> Papan Pemuka V-Log</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-[#f39200] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex gap-2"><Download className="w-4 h-4" /> Eksport PDF</button>
          <button onClick={() => setIsAdminLoggedIn(false)} className="p-2.5 rounded-xl bg-red-50 text-red-600"><LogOut className="w-5 h-5" /></button>
        </div>
      </div>
      <StatCards darkMode={darkMode} stats={stats} />
      {/* Bahagian Penapis (Filter) Omitted for brevity, paste lines 352-380 here */}
      <LogTable darkMode={darkMode} filteredLogs={filteredLogs} onEdit={onEditRecord} onDelete={deleteLog} />
    </div>
  );
}