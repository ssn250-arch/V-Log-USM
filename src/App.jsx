import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useVlogData } from './hooks/useVlogData';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import TripForm from './components/forms/TripForm';
import Dashboard from './components/admin/Dashboard';
import AdminLogin from './components/admin/AdminLogin';
import PrintView from './components/PrintView';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const vlogData = useVlogData();
  const [activeTab, setActiveTab] = useState('borang');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // --- STATE NOTIFIKASI & MODAL YANG TERTINGGAL ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  return (
    <div className={`relative min-h-screen flex flex-col justify-start ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={`w-full mx-auto px-4 sm:px-6 pt-28 pb-32 flex-grow ${activeTab === 'laporan' && isAdminLoggedIn ? 'max-w-6xl' : 'max-w-2xl'}`}>
        
        {/* PAPARAN NOTIFIKASI BERJAYA */}
        {showSuccess && (
          <div className={`mb-6 p-4 rounded-2xl shadow-sm flex items-center gap-3 transform transition-all animate-in fade-in slide-in-from-top-4 z-50 relative ${
            darkMode ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-200' : 'bg-emerald-50 border border-emerald-200'
          }`}>
            <CheckCircle2 className={`w-6 h-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <div>
              <p className={`font-bold text-sm ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>{successMessage}</p>
              <p className={`text-xs font-medium ${darkMode ? 'text-emerald-300/70' : 'text-emerald-600'}`}>Sistem telah mengemas kini pangkalan data V-Log@USM.</p>
            </div>
          </div>
        )}

        {/* TAB BORANG */}
        {activeTab === 'borang' && (
          <TripForm 
            darkMode={darkMode} 
            {...vlogData} 
            isAdminLoggedIn={isAdminLoggedIn}
            setShowAddDriverModal={setShowAddDriverModal}
            setShowAddVehicleModal={setShowAddVehicleModal}
            setSuccessMessage={setSuccessMessage}
            setShowSuccess={setShowSuccess}
          />
        )}

        {/* TAB ADMIN */}
        {activeTab === 'laporan' && (
          isAdminLoggedIn 
            ? <Dashboard darkMode={darkMode} setIsAdminLoggedIn={setIsAdminLoggedIn} {...vlogData} /> 
            : <AdminLogin darkMode={darkMode} onLogin={setIsAdminLoggedIn} />
        )}
      </div>

      <Footer darkMode={darkMode} />
      <MobileNav darkMode={darkMode} activeTab={activeTab} setActiveTab={setActiveTab} />
      <PrintView logs={vlogData.logs} />
    </div>
  );
}