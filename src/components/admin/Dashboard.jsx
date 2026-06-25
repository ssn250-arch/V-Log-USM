import React, { useState, useMemo } from 'react';
import { Download, LogOut, Building2, Filter, Search, RotateCcw, Users, X, Truck, BarChart3, Calendar, Gauge } from 'lucide-react';
import StatCards from './StatCards';
import LogTable from './LogTable';
import { BULAN, NAMA_BULAN } from '../../constants';

export default function Dashboard({ darkMode, logs, drivers, vehicles, setDrivers, setVehicles, deleteLog, openEditModal, setIsAdminLoggedIn }) {
  // --- STATE PENAPIS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(5, 7));
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [filterPemandu, setFilterPemandu] = useState('Semua');
  const [filterKenderaan, setFilterKenderaan] = useState('Semua');

  // --- STATE URUS DATA INDUK ---
  const [newDriverAdmin, setNewDriverAdmin] = useState('');
  const [newVehicleAdmin, setNewVehicleAdmin] = useState('');

  // --- STATE STATISTIK ---
  const [statsTahun, setStatsTahun] = useState(new Date().getFullYear().toString());
  const [statsKenderaanFilter, setStatsKenderaanFilter] = useState('Semua');

  // --- FUNGSI URUS DATA INDUK ---
  const handleAddDriverAdmin = () => {
    const trimmed = newDriverAdmin.trim();
    if (trimmed && !drivers.includes(trimmed)) {
      setDrivers(prev => [...prev, trimmed]);
      setNewDriverAdmin('');
    } else if (trimmed && drivers.includes(trimmed)) {
      alert('Pemandu ini sudah wujud.');
    }
  };

  const handleRemoveDriverAdmin = (driver) => {
    if (window.confirm('Padam pemandu "' + driver + '"?')) {
      setDrivers(prev => prev.filter(d => d !== driver));
    }
  };

  const handleAddVehicleAdmin = () => {
    const trimmed = newVehicleAdmin.trim();
    if (trimmed && !vehicles.includes(trimmed)) {
      setVehicles(prev => [...prev, trimmed]);
      setNewVehicleAdmin('');
    } else if (trimmed && vehicles.includes(trimmed)) {
      alert('Kenderaan ini sudah wujud.');
    }
  };

  const handleRemoveVehicleAdmin = (vehicle) => {
    if (window.confirm('Padam kenderaan "' + vehicle + '"?')) {
      setVehicles(prev => prev.filter(v => v !== vehicle));
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterBulan(new Date().toISOString().slice(5, 7));
    setFilterTahun(new Date().getFullYear().toString());
    setFilterPemandu('Semua');
    setFilterKenderaan('Semua');
  };

  // --- MEMOIZED DATA & STATISTIK ---
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (!log.tarikh) return false;
      const [tahun, bulan] = log.tarikh.split('-');
      
      const matchBulan = filterBulan === 'Semua' || bulan === filterBulan;
      const matchTahun = filterTahun === 'Semua' || tahun === filterTahun;
      const matchPemandu = filterPemandu === 'Semua' || log.pemandu === filterPemandu;
      const matchKenderaan = filterKenderaan === 'Semua' || log.kenderaan === filterKenderaan;
      
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = 
        log.pemandu.toLowerCase().includes(searchLower) || 
        log.kenderaan.toLowerCase().includes(searchLower) || 
        log.tujuan.toLowerCase().includes(searchLower) ||
        log.tarikh.includes(searchLower);

      return matchBulan && matchTahun && matchPemandu && matchKenderaan && matchSearch;
    });
  }, [logs, filterBulan, filterTahun, filterPemandu, filterKenderaan, searchQuery]);

  const stats = useMemo(() => {
    const totalTrips = filteredLogs.length;
    const totalKM = filteredLogs.reduce((sum, log) => sum + (parseFloat(log.jarak) || 0), 0);
    
    const pemanduCount = {};
    const kenderaanCount = {};
    filteredLogs.forEach(log => {
        pemanduCount[log.pemandu] = (pemanduCount[log.pemandu] || 0) + 1;
        kenderaanCount[log.kenderaan] = (kenderaanCount[log.kenderaan] || 0) + 1;
    });
    
    const topPemandu = Object.entries(pemanduCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Tiada Data';
    const topKenderaan = Object.entries(kenderaanCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Tiada Data';

    return { totalTrips, totalKM, topPemandu, topKenderaan };
  }, [filteredLogs]);

  const monthlyStats = useMemo(() => {
    const tahun = statsTahun;
    const filtered = logs.filter(log => {
      if (!log.tarikh) return false;
      const [t] = log.tarikh.split('-');
      const matchTahun = t === tahun;
      const matchKenderaan = statsKenderaanFilter === 'Semua' || log.kenderaan === statsKenderaanFilter;
      return matchTahun && matchKenderaan;
    });

    const bulanData = {};
    for (let i = 1; i <= 12; i++) {
      const key = String(i).padStart(2, '0');
      bulanData[key] = { trips: 0, km: 0 };
    }

    filtered.forEach(log => {
      const [, bulan] = log.tarikh.split('-');
      if (bulanData[bulan]) {
        bulanData[bulan].trips += 1;
        bulanData[bulan].km += parseFloat(log.jarak) || 0;
      }
    });

    return bulanData;
  }, [logs, statsTahun, statsKenderaanFilter]);

  const totalYearStats = useMemo(() => {
    let totalTrips = 0;
    let totalKM = 0;
    Object.values(monthlyStats).forEach(m => {
      totalTrips += m.trips;
      totalKM += m.km;
    });
    return { totalTrips, totalKM };
  }, [monthlyStats]);

  const vehicleStats = useMemo(() => {
    const tahun = statsTahun;
    const filtered = logs.filter(log => {
      if (!log.tarikh) return false;
      const [t] = log.tarikh.split('-');
      return t === tahun;
    });

    const statsMap = {};
    vehicles.forEach(v => { statsMap[v] = { trips: 0, km: 0 }; });

    filtered.forEach(log => {
      const v = log.kenderaan;
      if (statsMap[v]) {
        statsMap[v].trips += 1;
        statsMap[v].km += parseFloat(log.jarak) || 0;
      }
    });

    return statsMap;
  }, [logs, statsTahun, vehicles]);

  return (
    <div className="space-y-6">
      
      {/* HEADER DASHBOARD */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'}`}>
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            <Building2 className="w-5 h-5 text-[#f39200]" /> Papan Pemuka V-Log@USM
          </h2>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Urus rekod, statistik, dan jana laporan PDF rasmi.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => window.print()} disabled={filteredLogs.length === 0} className="flex-1 sm:flex-none bg-[#f39200] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-md hover:bg-[#e08600]">
            <Download className="w-4 h-4" /> Eksport PDF
          </button>
          <button onClick={() => setIsAdminLoggedIn(false)} className={`p-2.5 rounded-xl transition-colors shadow-sm ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-red-900/30 hover:text-red-400' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'}`}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KAD STATISTIK */}
      <StatCards darkMode={darkMode} stats={stats} />

      {/* PANEL URUS DATA INDUK */}
      <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'}`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
          <Users className="w-4 h-4" /> Urus Data Induk (Pemandu & Kenderaan)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="space-y-2">
            <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Senarai Pemandu</label>
            <div className="flex gap-2">
              <input type="text" value={newDriverAdmin} onChange={(e) => setNewDriverAdmin(e.target.value)} placeholder="Nama pemandu..." className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#f39200] outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`} />
              <button onClick={handleAddDriverAdmin} className="px-4 py-2 bg-[#4A154B] text-white rounded-xl text-sm font-bold hover:bg-[#3a0f3b] active:scale-95 transition-all">Tambah</button>
            </div>
            <div className={`flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
              {drivers.map(d => (
                <span key={d} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border ${darkMode ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200'}`}>
                  {d}
                  <button onClick={() => handleRemoveDriverAdmin(d)} className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Senarai Kenderaan</label>
            <div className="flex gap-2">
              <input type="text" value={newVehicleAdmin} onChange={(e) => setNewVehicleAdmin(e.target.value)} placeholder="Contoh: Toyota Camry (ABC 1234)" className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#f39200] outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`} />
              <button onClick={handleAddVehicleAdmin} className="px-4 py-2 bg-[#f39200] text-white rounded-xl text-sm font-bold hover:bg-[#e08600] active:scale-95 transition-all">Tambah</button>
            </div>
            <div className={`flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border ${darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
              {vehicles.map(v => (
                <span key={v} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border ${darkMode ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200'}`}>
                  {v}
                  <button onClick={() => handleRemoveVehicleAdmin(v)} className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATISTIK BULANAN */}
      <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
            <BarChart3 className="w-4 h-4" /> Statistik Penggunaan Mengikut Bulan
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tahun:</label>
              <select value={statsTahun} onChange={(e) => setStatsTahun(e.target.value)} className={`px-3 py-1.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#f39200] outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                {[2023, 2024, 2025, 2026, 2027].map(t => (<option key={t} value={t.toString()}>{t}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Kenderaan:</label>
              <select value={statsKenderaanFilter} onChange={(e) => setStatsKenderaanFilter(e.target.value)} className={`px-3 py-1.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#f39200] outline-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
                <option value="Semua">Semua</option>
                {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.keys(monthlyStats).map((bulan) => {
            const data = monthlyStats[bulan];
            const nama = NAMA_BULAN[bulan] || bulan;
            const maxKM = Math.max(...Object.values(monthlyStats).map(m => m.km), 0.1);
            const percent = maxKM > 0 ? (data.km / maxKM) * 100 : 0;
            const isActive = data.trips > 0 || data.km > 0;
            const colorClass = isActive ? darkMode ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200' : darkMode ? 'bg-slate-700/30 border-slate-600/50' : 'bg-slate-50/50 border-slate-200/50';
            const textColor = isActive ? darkMode ? 'text-amber-300' : 'text-amber-700' : darkMode ? 'text-slate-500' : 'text-slate-400';

            return (
              <div key={bulan} className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${isActive ? 'hover:scale-[1.02]' : 'opacity-60'} ${colorClass}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold ${isActive ? darkMode ? 'text-white' : 'text-slate-800' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{nama}</span>
                  <span className={`text-xs font-bold ${textColor}`}>{data.km.toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{data.trips} trip</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${isActive ? 'bg-[#f39200]' : 'bg-slate-300 dark:bg-slate-500'}`} style={{ width: `${Math.max(percent, 2)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-indigo-50/80 border-indigo-100'}`}>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-indigo-600'}`}>Jumlah Perjalanan</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{totalYearStats.totalTrips}</p>
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-600' : 'bg-indigo-100'}`}><Calendar className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} /></div>
          </div>
          <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-emerald-50/80 border-emerald-100'}`}>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-emerald-600'}`}>Jumlah Jarak</p>
              <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>{totalYearStats.totalKM.toFixed(1)} <span className="text-sm font-bold text-slate-400">KM</span></p>
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-600' : 'bg-emerald-100'}`}><Gauge className={`w-5 h-5 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`} /></div>
          </div>
        </div>
      </div>

      {/* STATISTIK KENDERAAN */}
      <div className={`p-5 rounded-2xl shadow-sm border ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'}`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 mb-4 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
          <Truck className="w-4 h-4" /> Statistik Mengikut Kenderaan (Tahun {statsTahun})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.keys(vehicleStats).map((v) => {
            const data = vehicleStats[v];
            const isActive = data.trips > 0 || data.km > 0;
            const maxKM = Math.max(...Object.values(vehicleStats).map(d => d.km), 0.1);
            const percent = maxKM > 0 ? (data.km / maxKM) * 100 : 0;

            return (
              <div key={v} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${isActive ? darkMode ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30' : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200' : darkMode ? 'bg-slate-700/30 border-slate-600/50 opacity-60' : 'bg-slate-50/50 border-slate-200/50 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-bold ${isActive ? (darkMode ? 'text-white' : 'text-slate-800') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>{v.split('(')[0].trim()}</span>
                  <span className={`text-xs font-bold ${isActive ? (darkMode ? 'text-blue-300' : 'text-blue-600') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>{data.km.toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{data.trips} trip</span>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${isActive ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-500'}`} style={{ width: `${Math.max(percent, 2)}%` }} />
                  </div>
                </div>
                <p className={`text-[10px] font-medium mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{v}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PENAPIS DAN CARIAN */}
      <div className={`p-5 rounded-2xl shadow-sm border space-y-4 ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'}`}>
        <div className={`flex items-center justify-between mb-2 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
          <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><h3 className={`text-sm font-bold ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>Tapisan & Carian Sistem</h3></div>
          <button onClick={resetFilters} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} /></div>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama pemandu, tarikh, kenderaan, atau destinasi..." className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[14px] shadow-sm transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-[#f39200]' : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'}`} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={filterPemandu} onChange={(e) => setFilterPemandu(e.target.value)} className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'}`}>
            <option value="Semua">Semua Pemandu</option>
            {drivers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterKenderaan} onChange={(e) => setFilterKenderaan(e.target.value)} className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'}`}>
            <option value="Semua">Semua Kenderaan</option>
            {vehicles.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'}`}>
            {BULAN.map(b => <option key={b.nilai} value={b.nilai}>{b.nama}</option>)}
          </select>
          <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'}`}>
            <option value="Semua">Semua Tahun</option>
            {[2023, 2024, 2025, 2026, 2027].map(t => <option key={t} value={t.toString()}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* JADUAL REKOD */}
      <LogTable darkMode={darkMode} filteredLogs={filteredLogs} onEdit={openEditModal} onDelete={deleteLog} />
      
    </div>
  );
}