import React, { useState, useMemo } from 'react';
import { CarFront, MapPin, Gauge, ChevronRight, Plus } from 'lucide-react';

export default function TripForm({ darkMode, drivers, vehicles, addLog, isAdminLoggedIn, setShowAddDriverModal, setShowAddVehicleModal, setSuccessMessage, setShowSuccess }) {
  const [formData, setFormData] = useState({
    tarikh: new Date().toISOString().slice(0, 10), masaMula: '', masaTamat: '',
    pemandu: '', kenderaan: '', tujuan: '', odometerMula: '', odometerTamat: ''
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
    setFormData({ ...formData, masaMula: '', masaTamat: '', tujuan: '', odometerMula: '', odometerTamat: '' }); // Reset fields
    setTimeout(() => setShowSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {/* Letakkan keseluruhan UI borang dari `<div className={p-6 rounded-[1.5rem]...}>` di sini. 
           Pastikan pembolehubah seperti darkMode, formData.xxx dihubungkan. */}
       <button type="submit" className="w-full bg-gradient-to-r from-[#4A154B] to-[#3a0f3b] text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2">
         Sah & Hantar Rekod <ChevronRight className="w-5 h-5" />
       </button>
    </form>
  );
}