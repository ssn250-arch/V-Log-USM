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

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const vlogData = useVlogData();
  const [activeTab, setActiveTab] = useState('borang');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  return (
    <div className={`relative min-h-screen flex flex-col justify-start ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={`w-full mx-auto px-4 sm:px-6 pt-28 pb-32 flex-grow ${activeTab === 'laporan' && isAdminLoggedIn ? 'max-w-6xl' : 'max-w-2xl'}`}>
        {activeTab === 'borang' && <TripForm darkMode={darkMode} {...vlogData} />}
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