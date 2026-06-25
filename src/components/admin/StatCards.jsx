import React from 'react';
import { Activity, Gauge, Users, Truck, TrendingUp, Award } from 'lucide-react';

export default function StatCards({ darkMode, stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between border ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-indigo-50 to-indigo-100/50'}`}>
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold uppercase">Jumlah Perjalanan</p>
          <Activity className="w-5 h-5 text-indigo-500" />
        </div>
        <h3 className="text-4xl font-black mt-3">{stats.totalTrips}</h3>
        <TrendingUp className="absolute -right-6 -bottom-6 w-28 h-28 opacity-10" />
      </div>
      <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between border ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50'}`}>
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold uppercase">Jumlah (KM)</p>
          <Gauge className="w-5 h-5 text-emerald-500" />
        </div>
        <h3 className="text-4xl font-black mt-3">{stats.totalKM} <span className="text-sm font-bold">KM</span></h3>
      </div>
      <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between border ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-amber-50 to-amber-100/50'}`}>
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold uppercase">Pemandu Aktif</p>
          <Users className="w-5 h-5 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold mt-3 leading-tight">{stats.topPemandu.split(' ').slice(0, 3).join(' ')}</h3>
        <Award className="absolute -right-6 -bottom-6 w-28 h-28 opacity-10" />
      </div>
      <div className={`relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between border ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-rose-50 to-rose-100/50'}`}>
        <div className="flex justify-between items-start">
          <p className="text-[11px] font-bold uppercase">Kenderaan Kerap</p>
          <Truck className="w-5 h-5 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold mt-3 leading-tight">{stats.topKenderaan.split(' ').slice(0, 3).join(' ')}</h3>
      </div>
    </div>
  );
}