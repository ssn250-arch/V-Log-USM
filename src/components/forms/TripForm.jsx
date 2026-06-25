import React, { useState, useMemo } from 'react';
import { CarFront, MapPin, Gauge, ChevronRight, Plus } from 'lucide-react';

export default function TripForm({ darkMode, drivers, vehicles, addLog, isAdminLoggedIn, setShowAddDriverModal, setShowAddVehicleModal, setSuccessMessage, setShowSuccess }) {
  const [formData, setFormData] = useState({
    tarikh: new Date().toISOString().slice(0, 10),
    masaMula: '',
    masaTamat: '',
    pemandu: '',
    kenderaan: '',
    tujuan: '',
    odometerMula: '',
    odometerTamat: ''
  });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const liveJarak = useMemo(() => {
    const mula = parseFloat(formData.odometerMula) || 0;
    const tamat = parseFloat(formData.odometerTamat) || 0;
    return (tamat > mula) ? (tamat - mula) : 0;
  }, [formData.odometerMula, formData.odometerTamat]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now().toString(),
      ...formData,
      jarak: liveJarak,
      timestamp: new Date().toISOString()
    };
    
    addLog(newLog);
    setSuccessMessage('Rekod baharu berjaya disimpan!');
    setShowSuccess(true);
    setFormData({ 
      tarikh: new Date().toISOString().slice(0, 10), 
      masaMula: '', masaTamat: '', pemandu: '', kenderaan: '', 
      tujuan: '', odometerMula: '', odometerTamat: '' 
    });
    setTimeout(() => setShowSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bahagian Kenderaan & Pemandu */}
      <div className={`p-6 rounded-[1.5rem] shadow-sm border space-y-5 ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/60'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'}`}>
          <CarFront className="w-4 h-4" /> Kenderaan & Pemandu
        </h3>
        
        <div className="space-y-1.5">
          <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Pilih Kenderaan</label>
          <div className="flex gap-2">
            <select name="kenderaan" value={formData.kenderaan} onChange={handleInputChange} required className={`flex-1 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              <option value="" disabled>Sila pilih...</option>
              {vehicles.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            {isAdminLoggedIn && (
              <button type="button" onClick={() => setShowAddVehicleModal(true)} className="px-4 py-3.5 bg-[#f39200] text-white rounded-xl font-bold hover:bg-[#e08600] flex items-center">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Nama Pemandu</label>
          <div className="flex gap-2">
            <select name="pemandu" value={formData.pemandu} onChange={handleInputChange} required className={`flex-1 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
              <option value="" disabled>Sila pilih...</option>
              {drivers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {isAdminLoggedIn && (
              <button type="button" onClick={() => setShowAddDriverModal(true)} className="px-4 py-3.5 bg-[#4A154B] text-white rounded-xl font-bold hover:bg-[#3a0f3b] flex items-center">
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bahagian Masa & Lokasi */}
      <div className={`p-6 rounded-[1.5rem] shadow-sm border space-y-5 ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/60'}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'}`}>
          <MapPin className="w-4 h-4" /> Masa & Lokasi
        </h3>
        <div className="space-y-1.5">
          <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tarikh Perjalanan</label>
          <input type="date" name="tarikh" value={formData.tarikh} onChange={handleInputChange} required className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Mulai</label>
            <input type="time" name="masaMula" value={formData.masaMula} onChange={handleInputChange} required className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`} />
          </div>
          <div className="space-y-1.5">
            <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Hingga</label>
            <input type="time" name="masaTamat" value={formData.masaTamat} onChange={handleInputChange} required className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Tujuan & Destinasi</label>
          <textarea name="tujuan" value={formData.tujuan} onChange={handleInputChange} required rows="3" placeholder="Nyatakan PTJ/Jabatan dan destinasi..." className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'}`} />
        </div>
      </div>

      {/* Bahagian Odometer */}
      <div className={`p-6 rounded-[1.5rem] shadow-sm border space-y-5 ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/60'}`}>
         <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'}`}>
          <Gauge className="w-4 h-4" /> Maklumat Odometer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Odometer Mula (KM)</label>
            <input type="number" name="odometerMula" value={formData.odometerMula} onChange={handleInputChange} required min="0" placeholder="Contoh: 10800" className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`} />
          </div>
          <div className="space-y-1.5">
            <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Odometer Akhir (KM)</label>
            <input type="number" name="odometerTamat" value={formData.odometerTamat} onChange={handleInputChange} required min={formData.odometerMula || "0"} placeholder="Contoh: 10850" className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`} />
          </div>
        </div>
        <div className={`p-4 rounded-xl flex justify-between items-center mt-2 ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border border-slate-200/60'}`}>
          <span className={`font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Jumlah Jarak Dianggarkan:</span>
          <span className={`text-2xl font-black ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>{liveJarak} <span className="text-xs font-bold text-slate-400">KM</span></span>
        </div>
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-[#4A154B] to-[#3a0f3b] text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 text-[15px]">
        Sah & Hantar Rekod <ChevronRight className="w-5 h-5" />
      </button>
    </form>
  );
}