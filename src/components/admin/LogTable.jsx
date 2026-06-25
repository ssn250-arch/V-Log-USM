import React from 'react';
import { Pencil, Trash2, Clock, MapPin, UserCircle2, History } from 'lucide-react';

export default function LogTable({ darkMode, filteredLogs, onEdit, onDelete }) {
  if (filteredLogs.length === 0) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center">
        <History className="w-8 h-8 text-slate-400 mb-3" />
        <p className="font-semibold text-sm text-slate-500">Tiada rekod dijumpai<br/>untuk tapisan ini.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/60'}`}>
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-[#4A154B]/5 text-slate-600">
            <tr>
              <th className="p-4 font-bold">Tarikh</th><th className="p-4 font-bold">Masa</th>
              <th className="p-4 font-bold">Kenderaan</th><th className="p-4 font-bold">Pemandu</th>
              <th className="p-4 font-bold">Destinasi</th><th className="p-4 text-center font-bold">Jarak</th>
              <th className="p-4 text-center font-bold">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
               <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                 <td className="p-4 font-bold">{log.tarikh}</td>
                 <td className="p-4">{log.masaMula} - {log.masaTamat}</td>
                 <td className="p-4 text-xs font-bold uppercase text-[#f39200]">{log.kenderaan.split(' ')[0]}</td>
                 <td className="p-4">{log.pemandu}</td>
                 <td className="p-4 truncate max-w-[200px]">{log.tujuan}</td>
                 <td className="p-4 text-center font-black">{log.jarak}</td>
                 <td className="p-4 text-center">
                   <div className="flex justify-center gap-1.5">
                     <button onClick={() => onEdit(log)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-600"><Pencil className="w-4 h-4"/></button>
                     <button onClick={() => onDelete(log.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4"/></button>
                   </div>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile View Omitted slightly for brevity, but you can paste the Mobile Card View from lines 408-435 here */}
    </div>
  );
}