import React, { useState, useEffect, useMemo } from 'react';
import { 
  CarFront, 
  UserCircle2, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Gauge, 
  CheckCircle2,
  FileSignature,
  History,
  Download,
  Car,
  ChevronRight,
  Sparkles,
  Lock,
  KeyRound,
  LogOut,
  ShieldCheck,
  Building2,
  FileText,
  Search,
  Filter,
  Activity,
  Award,
  TrendingUp,
  QrCode,
  CheckCircle,
  X,
  Plus,
  Trash2,
  BarChart3,
  Sun,
  Moon,
  Users,
  Truck,
  Calendar,
  BarChart,
  Pencil,
  RotateCcw
} from 'lucide-react';

// --- DATA TETAP (DEFAULT) ---
const DEFAULT_DRIVERS = [
  "Encik Zayd Bin Zhari",
  "Puan Nor Fadhilah Binti Wahab",
  "Encik Iswandi Bin Abdul Mokmin@Mohd Amin",
  "Encik Mohd Mohsin Bin Sirun",
  "Encik Mohd Fakrur Amirul Bin Mohamad Rodzi",
  "Encik Jamaludin Bin Nayan",
  "Puan Jumizah binti Samsudin",
  "Puan Farrah Wahida binti Che Ros",
  "Encik Mohd Razin Bin Rosely",
  "Encik Mohd Rafizal Bin Husain",
  "Encik Mohamad Ikhwan Bin Ishak",
  "Encik Mohd Yusof Bin Bakar",
  "Encik Mohd Sha'arani Bin Shamsuddin",
  "Encik Samsul Amri Bin Ahmad"
];

const DEFAULT_VEHICLES = [
  "Nissan Serena (PPP 1983)",
  "Van Toyota (PJX 7122)"
];

const BULAN = [
  { nilai: 'Semua', nama: 'Semua Bulan' },
  { nilai: '01', nama: 'Januari' }, { nilai: '02', nama: 'Februari' },
  { nilai: '03', nama: 'Mac' }, { nilai: '04', nama: 'April' },
  { nilai: '05', nama: 'Mei' }, { nilai: '06', nama: 'Jun' },
  { nilai: '07', nama: 'Julai' }, { nilai: '08', nama: 'Ogos' },
  { nilai: '09', nama: 'September' }, { nilai: '10', nama: 'Oktober' },
  { nilai: '11', nama: 'November' }, { nilai: '12', nama: 'Disember' }
];

const NAMA_BULAN = {
  '01': 'Jan', '02': 'Feb', '03': 'Mac', '04': 'Apr',
  '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Ogo',
  '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Dis'
};

export default function App() {
  // --- STATE UTAMA ---
  const [activeTab, setActiveTab] = useState('borang');

  const [logs, setLogs] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- DARK MODE ---
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vlog_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // --- STATE NAVBAR (SCROLL) ---
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // State Sekuriti (Admin)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // State Penapis & Carian Laporan
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBulan, setFilterBulan] = useState(new Date().toISOString().slice(5, 7));
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [filterPemandu, setFilterPemandu] = useState('Semua');
  const [filterKenderaan, setFilterKenderaan] = useState('Semua');

  // State untuk statistik tahunan
  const [statsTahun, setStatsTahun] = useState(new Date().getFullYear().toString());
  const [statsKenderaanFilter, setStatsKenderaanFilter] = useState('Semua');

  // State Borang
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

  // State untuk senarai dinamik (pemandu & kenderaan)
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  // State untuk modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tarikh: '',
    masaMula: '',
    masaTamat: '',
    pemandu: '',
    kenderaan: '',
    tujuan: '',
    odometerMula: '',
    odometerTamat: ''
  });

  // State untuk tambah cepat di borang (hanya untuk admin)
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [quickDriverName, setQuickDriverName] = useState('');
  const [quickVehicleName, setQuickVehicleName] = useState('');

  // State untuk panel urus data induk (admin)
  const [newDriverAdmin, setNewDriverAdmin] = useState('');
  const [newVehicleAdmin, setNewVehicleAdmin] = useState('');

  // --- MUAT DATA DARI LOCALSTORAGE ---
  useEffect(() => {
    const savedLogs = localStorage.getItem('vlog_usm_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    const savedDrivers = localStorage.getItem('vlog_usm_drivers');
    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers));
    } else {
      setDrivers(DEFAULT_DRIVERS);
    }

    const savedVehicles = localStorage.getItem('vlog_usm_vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      setVehicles(DEFAULT_VEHICLES);
    }
  }, []);

  useEffect(() => {
    if (drivers.length > 0) {
      localStorage.setItem('vlog_usm_drivers', JSON.stringify(drivers));
    }
  }, [drivers]);

  useEffect(() => {
    if (vehicles.length > 0) {
      localStorage.setItem('vlog_usm_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  // Simpan mod gelap
  useEffect(() => {
    localStorage.setItem('vlog_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // --- KESAN SKROL UNTUK AUTO-HIDE NAVBAR ---
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
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // --- FUNGSI PENGENDALIAN BORANG ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));

    setSuccessMessage('Rekod baharu berjaya disimpan!');
    setShowSuccess(true);
    setFormData({
      tarikh: new Date().toISOString().slice(0, 10),
      masaMula: '',
      masaTamat: '',
      pemandu: '',
      kenderaan: '',
      tujuan: '',
      odometerMula: '',
      odometerTamat: ''
    });
    setTimeout(() => setShowSuccess(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cetakPDF = () => {
    window.print();
  };

  // --- FUNGSI PENGENDALIAN ADMIN ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (loginError) setLoginError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'abc@12345') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setLoginData({ username: '', password: '' });
    } else {
      setLoginError('ID Pengguna atau Kata Laluan tidak sah.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // --- FUNGSI TAMBAH CEPAT DARI BORANG (HANYA UNTUK ADMIN) ---
  const handleQuickAddDriver = () => {
    const trimmed = quickDriverName.trim();
    if (trimmed && !drivers.includes(trimmed)) {
      setDrivers(prev => [...prev, trimmed]);
      setQuickDriverName('');
      setShowAddDriverModal(false);
      setFormData(prev => ({ ...prev, pemandu: trimmed }));
    } else if (trimmed && drivers.includes(trimmed)) {
      alert('Pemandu ini sudah wujud.');
    }
  };

  const handleQuickAddVehicle = () => {
    const trimmed = quickVehicleName.trim();
    if (trimmed && !vehicles.includes(trimmed)) {
      setVehicles(prev => [...prev, trimmed]);
      setQuickVehicleName('');
      setShowAddVehicleModal(false);
      setFormData(prev => ({ ...prev, kenderaan: trimmed }));
    } else if (trimmed && vehicles.includes(trimmed)) {
      alert('Kenderaan ini sudah wujud.');
    }
  };

  // --- FUNGSI UNTUK PANEL URUS DATA INDUK (ADMIN) ---
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

  // --- FUNGSI PADAM REKOD PERJALANAN ---
  const handleDeleteLog = (id) => {
    if (window.confirm('Anda pasti mahu memadam rekod ini? Tindakan ini tidak boleh dibatalkan.')) {
      const updatedLogs = logs.filter(log => log.id !== id);
      setLogs(updatedLogs);
      localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));
      setSuccessMessage('Rekod berjaya dipadam!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // --- FUNGSI RESET PENAPIS ---
  const resetFilters = () => {
    setSearchQuery('');
    setFilterBulan(new Date().toISOString().slice(5, 7));
    setFilterTahun(new Date().getFullYear().toString());
    setFilterPemandu('Semua');
    setFilterKenderaan('Semua');
  };

  // --- FUNGSI EDIT REKOD ---
  const openEditModal = (log) => {
    setEditingLog(log);
    setEditFormData({
      tarikh: log.tarikh || '',
      masaMula: log.masaMula || '',
      masaTamat: log.masaTamat || '',
      pemandu: log.pemandu || '',
      kenderaan: log.kenderaan || '',
      tujuan: log.tujuan || '',
      odometerMula: log.odometerMula || '',
      odometerTamat: log.odometerTamat || ''
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingLog(null);
    setEditFormData({
      tarikh: '',
      masaMula: '',
      masaTamat: '',
      pemandu: '',
      kenderaan: '',
      tujuan: '',
      odometerMula: '',
      odometerTamat: ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const editJarak = useMemo(() => {
    const mula = parseFloat(editFormData.odometerMula) || 0;
    const tamat = parseFloat(editFormData.odometerTamat) || 0;
    return (tamat > mula) ? (tamat - mula) : 0;
  }, [editFormData.odometerMula, editFormData.odometerTamat]);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingLog) return;
    const updatedLog = {
      ...editingLog,
      ...editFormData,
      jarak: editJarak
    };
    const updatedLogs = logs.map(log => 
      log.id === editingLog.id ? updatedLog : log
    );
    setLogs(updatedLogs);
    localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));
    closeEditModal();
    setSuccessMessage('Rekod berjaya dikemas kini!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // --- DATA DITAPIS & STATISTIK ---
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

  // Statistik untuk kad ringkasan
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

  // Statistik bulanan
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

  // Statistik mengikut kenderaan
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

  // --- TOGGLE DARK MODE ---
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // --- ANTARAMUKA ---
  return (
    <div className={`relative min-h-screen font-sans text-slate-800 selection:bg-indigo-200 overflow-x-hidden flex flex-col justify-start transition-colors duration-300 ${
      darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* --- LATAR BELAKANG --- */}
      <div className="no-print fixed inset-0 z-[-1] overflow-hidden">
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.25] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)] pointer-events-none ${
          darkMode ? 'opacity-[0.05]' : ''
        }`}></div>
        <div className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full filter blur-[120px] pointer-events-none ${
          darkMode ? 'bg-[#4A154B]/20' : 'bg-[#4A154B]/[0.02]'
        }`}></div>
        <div className={`absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full filter blur-[100px] pointer-events-none ${
          darkMode ? 'bg-[#f39200]/10' : 'bg-[#f39200]/[0.03]'
        }`}></div>
      </div>

      <style>
        {`
          @media print {
            body { background-color: white; margin: 0; padding: 0; -webkit-print-color-adjust: exact; color-adjust: exact; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            #print-area { padding: 40px; color: #333; }
            .print-header { border-bottom: 3px solid #4A154B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .print-header img { height: 70px; object-fit: contain; }
            .print-header-text { text-align: right; }
            .print-header-text h1 { color: #4A154B; font-size: 24px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 1px; }
            .print-header-text p { margin: 2px 0; font-size: 12px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #ddd; padding: 10px 8px; text-align: left; }
            th { background-color: #4A154B !important; color: white !important; font-weight: bold; text-align: center; }
            tr:nth-child(even) { background-color: #f9f9f9 !important; }
            .print-summary { margin-top: 30px; padding: 15px; background-color: #f3f4f6 !important; border-radius: 8px; border-left: 4px solid #f39200; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
            .print-footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid; }
            .qr-section { text-align: center; }
            .qr-section img { width: 80px; height: 80px; margin: 0 auto; border: 1px solid #eee; padding: 4px; border-radius: 8px; }
            .signature-section { text-align: center; width: 250px; }
            .signature-line { border-bottom: 1px solid #000; margin: 40px 0 10px 0; }
            @page { size: A4 landscape; margin: 10mm; }
          }
          .print-only { display: none; }
        `}
      </style>

      {/* --- TOP NAVIGATION BAR --- */}
      <nav className={`no-print fixed top-0 w-full border-b shadow-[0_4px_20px_rgb(0,0,0,0.15)] z-50 transition-transform duration-500 ease-in-out ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#4A154B] border-white/10'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-2.5 rounded-xl shadow-inner transform transition-transform group-hover:scale-105 border ${
              darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white/10 border-white/20'
            }`}>
              <Building2 className={`w-5 h-5 ${darkMode ? 'text-[#f39200]' : 'text-[#f39200]'}`} />
            </div>
            <div>
              <h1 className={`text-lg font-black leading-tight tracking-tight ${darkMode ? 'text-white' : 'text-white'}`}>
                V-Log<span className="text-[#f39200]">@USM</span>
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-400' : 'text-white/70'}`}>
                Pusat Islam
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-colors ${
                darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label="Tukar mod gelap"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className={`hidden sm:flex items-center relative p-1.5 rounded-2xl border shadow-inner ${
              darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-black/20 border-white/10'
            }`}>
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[150px] bg-[#f39200] rounded-xl shadow-md transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
                  activeTab === 'borang' ? 'translate-x-0' : 'translate-x-[150px]'
                }`}
              ></div>
              
              <button 
                onClick={() => setActiveTab('borang')}
                className={`relative z-10 w-[150px] py-2 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                  activeTab === 'borang' ? 'text-white' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-white/60 hover:text-white')
                }`}
              >
                <FileText className="w-4 h-4" /> Borang
              </button>
              <button 
                onClick={() => setActiveTab('laporan')}
                className={`relative z-10 w-[150px] py-2 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
                  activeTab === 'laporan' ? 'text-white' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-white/60 hover:text-white')
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- KANDUNGAN UTAMA --- */}
      <div className={`no-print w-full mx-auto px-4 sm:px-6 pt-28 pb-32 relative z-10 flex-grow transition-all duration-500 ${
        activeTab === 'laporan' && isAdminLoggedIn ? 'max-w-6xl' : 'max-w-2xl'
      }`}>
        
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

        <div key={activeTab} className="animate-in fade-in zoom-in-[0.95] duration-500 ease-out fill-mode-both">
          
          {/* ===== BORANG ===== */}
          {activeTab === 'borang' && (
            <div>
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Rekod Perjalanan Baru
                </h2>
                <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sila lengkapkan butiran pergerakan kenderaan.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border space-y-5 ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                }`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${
                    darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'
                  }`}>
                    <CarFront className="w-4 h-4" /> Kenderaan & Pemandu
                  </h3>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Pilih Kenderaan
                    </label>
                    <div className="flex gap-2">
                      <select 
                        name="kenderaan" 
                        value={formData.kenderaan} 
                        onChange={handleInputChange} 
                        required 
                        className={`flex-1 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] appearance-none font-medium text-[15px] shadow-sm transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                        }`}
                      >
                        <option value="" disabled>Sila pilih...</option>
                        {vehicles.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                      {isAdminLoggedIn && (
                        <button
                          type="button"
                          onClick={() => setShowAddVehicleModal(true)}
                          className="px-4 py-3.5 bg-[#f39200] text-white rounded-xl font-bold hover:bg-[#e08600] active:scale-95 transition-all shadow-sm flex items-center gap-1"
                          title="Tambah kenderaan baharu"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Nama Pemandu
                    </label>
                    <div className="flex gap-2">
                      <select 
                        name="pemandu" 
                        value={formData.pemandu} 
                        onChange={handleInputChange} 
                        required 
                        className={`flex-1 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] appearance-none font-medium text-[15px] shadow-sm transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                        }`}
                      >
                        <option value="" disabled>Sila pilih...</option>
                        {drivers.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {isAdminLoggedIn && (
                        <button
                          type="button"
                          onClick={() => setShowAddDriverModal(true)}
                          className="px-4 py-3.5 bg-[#4A154B] text-white rounded-xl font-bold hover:bg-[#3a0f3b] active:scale-95 transition-all shadow-sm flex items-center gap-1"
                          title="Tambah pemandu baharu"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border space-y-5 ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                }`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${
                    darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'
                  }`}>
                    <MapPin className="w-4 h-4" /> Masa & Lokasi
                  </h3>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Tarikh Perjalanan
                    </label>
                    <input 
                      type="date" 
                      name="tarikh" 
                      value={formData.tarikh} 
                      onChange={handleInputChange} 
                      required 
                      className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm transition-all ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Mulai
                      </label>
                      <input 
                        type="time" 
                        name="masaMula" 
                        value={formData.masaMula} 
                        onChange={handleInputChange} 
                        required 
                        className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Hingga
                      </label>
                      <input 
                        type="time" 
                        name="masaTamat" 
                        value={formData.masaTamat} 
                        onChange={handleInputChange} 
                        required 
                        className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Tujuan & Destinasi
                    </label>
                    <textarea 
                      name="tujuan" 
                      value={formData.tujuan} 
                      onChange={handleInputChange} 
                      required 
                      rows="3" 
                      placeholder="Nyatakan PTJ/Jabatan dan destinasi..." 
                      className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] resize-none shadow-sm transition-all ${
                        darkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200] placeholder:text-slate-400' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200] placeholder:text-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div className={`p-6 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border space-y-5 ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                }`}>
                   <h3 className={`text-xs font-bold uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${
                    darkMode ? 'text-[#f39200] border-slate-700' : 'text-[#4A154B] border-slate-100'
                  }`}>
                    <Gauge className="w-4 h-4" /> Maklumat Odometer
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Odometer Mula (KM)
                      </label>
                      <input 
                        type="number" 
                        name="odometerMula" 
                        value={formData.odometerMula} 
                        onChange={handleInputChange} 
                        required 
                        min="0" 
                        placeholder="Contoh: 10800" 
                        className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center shadow-inner transition-all ${
                           darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-900 focus:border-[#f39200]'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Odometer Akhir (KM)
                      </label>
                      <input 
                        type="number" 
                        name="odometerTamat" 
                        value={formData.odometerTamat} 
                        onChange={handleInputChange} 
                        required 
                        min={formData.odometerMula || "0"} 
                        placeholder="Contoh: 10850" 
                        className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center shadow-inner transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-900 focus:border-[#f39200]'
                        }`}
                      />
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl flex justify-between items-center mt-2 shadow-sm ${
                    darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border border-slate-200/60'
                  }`}>
                    <span className={`font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Jumlah Jarak Dianggarkan:
                    </span>
                    <span className={`text-2xl font-black ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
                      {liveJarak} <span className="text-xs font-bold text-slate-400">KM</span>
                    </span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-[#4A154B] to-[#3a0f3b] active:from-[#3a0f3b] hover:from-[#3a0f3b] hover:shadow-lg text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 text-[15px]">
                  Sah & Hantar Rekod <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* ===== LAPORAN ADMIN ===== */}
          {activeTab === 'laporan' && (
            <div>
              {!isAdminLoggedIn ? (
                <div className={`max-w-md mx-auto mt-6 p-8 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border text-center space-y-6 ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                }`}>
                  <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-inner ${
                    darkMode ? 'bg-slate-700 border-slate-600' : 'bg-[#4A154B]/5 border border-[#4A154B]/10'
                  }`}>
                    <ShieldCheck className={`w-10 h-10 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`} />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Akses V-Log@USM
                    </h2>
                    <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Log masuk pentadbir sistem.
                    </p>
                  </div>
                  <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
                    {loginError && (
                      <div className={`text-[11px] font-bold p-3 rounded-lg border text-center ${
                        darkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {loginError}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className={`text-[12px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        ID Pengguna
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <UserCircle2 className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                        <input 
                          type="text" 
                          name="username" 
                          value={loginData.username} 
                          onChange={handleLoginChange} 
                          required 
                          placeholder="Masukkan ID" 
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-[14px] shadow-sm transition-all ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-[#f39200]' 
                              : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[12px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Kata Laluan
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <KeyRound className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        </div>
                        <input 
                          type="password" 
                          name="password" 
                          value={loginData.password} 
                          onChange={handleLoginChange} 
                          required 
                          placeholder="••••••••" 
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-[14px] shadow-sm transition-all ${
                            darkMode 
                              ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-[#f39200]' 
                              : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                          }`}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#f39200] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2 mt-4 text-[14px] hover:bg-[#e08600]">
                      Log Masuk <ChevronRight className="w-4 h-4"/>
                    </button>
                  </form>
                </div>
              ) : (
                /* --- PAPAN PEMUKA ADMIN --- */
                <div className="space-y-6">
                  
                  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-2xl shadow-sm border ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <div>
                      <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Building2 className="w-5 h-5 text-[#f39200]" /> Papan Pemuka V-Log@USM
                      </h2>
                      <p className={`text-sm mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Urus rekod, statistik, dan jana laporan PDF rasmi.
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={cetakPDF} disabled={filteredLogs.length === 0} className="flex-1 sm:flex-none bg-[#f39200] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-md hover:bg-[#e08600]">
                        <Download className="w-4 h-4" /> Eksport PDF
                      </button>
                      <button onClick={handleLogout} className={`p-2.5 rounded-xl transition-colors shadow-sm ${
                        darkMode ? 'bg-slate-700 text-slate-300 hover:bg-red-900/30 hover:text-red-400' : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600'
                      }`}>
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* --- KAD STATISTIK KORPORAT --- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className={`relative overflow-hidden rounded-2xl shadow-md p-6 flex flex-col justify-between border ${
                      darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-bold uppercase tracking-wider ${
                          darkMode ? 'text-slate-400' : 'text-indigo-700'
                        }`}>Jumlah Perjalanan</p>
                        <div className={`p-2.5 rounded-xl ${
                          darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          <Activity className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className={`text-4xl font-black mt-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {stats.totalTrips}
                      </h3>
                      <TrendingUp className={`absolute -right-6 -bottom-6 w-28 h-28 opacity-10 pointer-events-none ${
                        darkMode ? 'text-white' : 'text-indigo-600'
                      }`} />
                    </div>

                    <div className={`relative overflow-hidden rounded-2xl shadow-md p-6 flex flex-col justify-between border ${
                      darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-bold uppercase tracking-wider ${
                          darkMode ? 'text-slate-400' : 'text-emerald-700'
                        }`}>Jumlah (KM)</p>
                        <div className={`p-2.5 rounded-xl ${
                          darkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Gauge className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className={`text-4xl font-black mt-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {stats.totalKM} <span className="text-sm font-bold text-slate-400">KM</span>
                      </h3>
                    </div>

                    <div className={`relative overflow-hidden rounded-2xl shadow-md p-6 flex flex-col justify-between border ${
                      darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-bold uppercase tracking-wider ${
                          darkMode ? 'text-slate-400' : 'text-amber-700'
                        }`}>Pemandu Aktif</p>
                        <div className={`p-2.5 rounded-xl ${
                          darkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-600'
                        }`}>
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className={`text-2xl font-bold mt-3 leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {stats.topPemandu.split(' ').slice(0, 3).join(' ')}
                      </h3>
                      <Award className={`absolute -right-6 -bottom-6 w-28 h-28 opacity-10 pointer-events-none ${
                        darkMode ? 'text-white' : 'text-amber-600'
                      }`} />
                    </div>

                    <div className={`relative overflow-hidden rounded-2xl shadow-md p-6 flex flex-col justify-between border ${
                      darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100'
                    }`}>
                      <div className="flex justify-between items-start">
                        <p className={`text-[11px] font-bold uppercase tracking-wider ${
                          darkMode ? 'text-slate-400' : 'text-rose-700'
                        }`}>Kenderaan Kerap</p>
                        <div className={`p-2.5 rounded-xl ${
                          darkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-600'
                        }`}>
                          <Truck className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className={`text-lg font-bold mt-3 leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                        {stats.topKenderaan.split(' ').slice(0, 3).join(' ')}
                      </h3>
                    </div>
                  </div>

                  {/* --- PANEL URUS DATA INDUK (ADMIN) --- */}
                  <div className={`p-5 rounded-2xl shadow-sm border ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <h3 className={`text-sm font-bold flex items-center gap-2 ${
                      darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'
                    }`}>
                      <Users className="w-4 h-4" /> Urus Data Induk (Pemandu & Kenderaan)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {/* Bahagian Pemandu */}
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          Senarai Pemandu
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newDriverAdmin}
                            onChange={(e) => setNewDriverAdmin(e.target.value)}
                            placeholder="Nama pemandu..."
                            className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#f39200] outline-none ${
                              darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                          <button
                            onClick={handleAddDriverAdmin}
                            className="px-4 py-2 bg-[#4A154B] text-white rounded-xl text-sm font-bold hover:bg-[#3a0f3b] active:scale-95 transition-all"
                          >
                            Tambah
                          </button>
                        </div>
                        <div className={`flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border ${
                          darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                        }`}>
                          {drivers.map(d => (
                            <span key={d} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border ${
                              darkMode ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200'
                            }`}>
                              {d}
                              <button onClick={() => handleRemoveDriverAdmin(d)} className="text-red-400 hover:text-red-600 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Bahagian Kenderaan */}
                      <div className="space-y-2">
                        <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          Senarai Kenderaan
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newVehicleAdmin}
                            onChange={(e) => setNewVehicleAdmin(e.target.value)}
                            placeholder="Contoh: Toyota Camry (ABC 1234)"
                            className={`flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#f39200] outline-none ${
                              darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                          <button
                            onClick={handleAddVehicleAdmin}
                            className="px-4 py-2 bg-[#f39200] text-white rounded-xl text-sm font-bold hover:bg-[#e08600] active:scale-95 transition-all"
                          >
                            Tambah
                          </button>
                        </div>
                        <div className={`flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl border ${
                          darkMode ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
                        }`}>
                          {vehicles.map(v => (
                            <span key={v} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border ${
                              darkMode ? 'bg-slate-600 border-slate-500 text-slate-200' : 'bg-white border-slate-200'
                            }`}>
                              {v}
                              <button onClick={() => handleRemoveVehicleAdmin(v)} className="text-red-400 hover:text-red-600 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- STATISTIK BULANAN --- */}
                  <div className={`p-5 rounded-2xl shadow-sm border ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <h3 className={`text-sm font-bold flex items-center gap-2 ${
                        darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'
                      }`}>
                        <BarChart3 className="w-4 h-4" /> Statistik Penggunaan Mengikut Bulan
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Tahun:
                          </label>
                          <select
                            value={statsTahun}
                            onChange={(e) => setStatsTahun(e.target.value)}
                            className={`px-3 py-1.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#f39200] outline-none ${
                              darkMode 
                                ? 'bg-slate-700 border-slate-600 text-slate-100' 
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            {[2023, 2024, 2025, 2026, 2027].map(t => (
                              <option key={t} value={t.toString()}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Kenderaan:
                          </label>
                          <select
                            value={statsKenderaanFilter}
                            onChange={(e) => setStatsKenderaanFilter(e.target.value)}
                            className={`px-3 py-1.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#f39200] outline-none ${
                              darkMode 
                                ? 'bg-slate-700 border-slate-600 text-slate-100' 
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
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
                        const colorClass = isActive 
                          ? darkMode 
                            ? `bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-amber-500/30`
                            : `bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200`
                          : darkMode
                            ? 'bg-slate-700/30 border-slate-600/50'
                            : 'bg-slate-50/50 border-slate-200/50';
                        const textColor = isActive
                          ? darkMode ? 'text-amber-300' : 'text-amber-700'
                          : darkMode ? 'text-slate-500' : 'text-slate-400';

                        return (
                          <div
                            key={bulan}
                            className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                              isActive ? 'hover:scale-[1.02]' : 'opacity-60'
                            } ${colorClass}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-sm font-bold ${isActive ? darkMode ? 'text-white' : 'text-slate-800' : darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {nama}
                              </span>
                              <span className={`text-xs font-bold ${textColor}`}>
                                {data.km.toFixed(1)} km
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {data.trips} trip{data.trips !== 1 ? 's' : ''}
                              </span>
                              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    isActive ? 'bg-[#f39200]' : 'bg-slate-300 dark:bg-slate-500'
                                  }`}
                                  style={{ width: `${Math.max(percent, 2)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                      <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-indigo-50/80 border-indigo-100'
                      }`}>
                        <div>
                          <p className={`text-[11px] font-bold uppercase tracking-wider ${
                            darkMode ? 'text-slate-400' : 'text-indigo-600'
                          }`}>Jumlah Perjalanan</p>
                          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {totalYearStats.totalTrips}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-600' : 'bg-indigo-100'}`}>
                          <Calendar className={`w-5 h-5 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl border flex items-center justify-between ${
                        darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-emerald-50/80 border-emerald-100'
                      }`}>
                        <div>
                          <p className={`text-[11px] font-bold uppercase tracking-wider ${
                            darkMode ? 'text-slate-400' : 'text-emerald-600'
                          }`}>Jumlah Jarak</p>
                          <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {totalYearStats.totalKM.toFixed(1)} <span className="text-sm font-bold text-slate-400">KM</span>
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl ${darkMode ? 'bg-slate-600' : 'bg-emerald-100'}`}>
                          <Gauge className={`w-5 h-5 ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* --- STATISTIK MENGIKUT KENDERAAN --- */}
                  <div className={`p-5 rounded-2xl shadow-sm border ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <h3 className={`text-sm font-bold flex items-center gap-2 mb-4 ${
                      darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'
                    }`}>
                      <Truck className="w-4 h-4" /> Statistik Mengikut Kenderaan (Tahun {statsTahun})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                       {Object.keys(vehicleStats).map((v) => {
                        const data = vehicleStats[v];
                        const isActive = data.trips > 0 || data.km > 0;
                        const maxKM = Math.max(...Object.values(vehicleStats).map(d => d.km), 0.1);
                        const percent = maxKM > 0 ? (data.km / maxKM) * 100 : 0;

                        return (
                          <div
                            key={v}
                            className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                              isActive
                                ? darkMode
                                  ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30'
                                  : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200'
                                : darkMode
                                  ? 'bg-slate-700/30 border-slate-600/50 opacity-60'
                                  : 'bg-slate-50/50 border-slate-200/50 opacity-60'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-sm font-bold ${isActive ? (darkMode ? 'text-white' : 'text-slate-800') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                {v.split('(')[0].trim()}
                              </span>
                              <span className={`text-xs font-bold ${isActive ? (darkMode ? 'text-blue-300' : 'text-blue-600') : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                {data.km.toFixed(1)} km
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {data.trips} trip{data.trips !== 1 ? 's' : ''}
                              </span>
                              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    isActive ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-500'
                                  }`}
                                  style={{ width: `${Math.max(percent, 2)}%` }}
                                />
                              </div>
                            </div>
                            <p className={`text-[10px] font-medium mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {v}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* --- PENAPIS & CARIAN LENGKAP DENGAN BUTANG RESET --- */}
                  <div className={`p-5 rounded-2xl shadow-sm border space-y-4 ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <div className={`flex items-center justify-between mb-2 ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <h3 className={`text-sm font-bold ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
                          Tapisan & Carian Sistem
                        </h3>
                      </div>
                      <button
                        onClick={resetFilters}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          darkMode 
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                      <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama pemandu, tarikh, kenderaan, atau destinasi..."
                        className={`w-full pl-11 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[14px] shadow-sm transition-all ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-[#f39200]'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <select 
                        value={filterPemandu} 
                        onChange={(e) => setFilterPemandu(e.target.value)} 
                        className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'
                        }`}
                      >
                        <option value="Semua">Semua Pemandu</option>
                        {drivers.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      
                      <select 
                        value={filterKenderaan} 
                        onChange={(e) => setFilterKenderaan(e.target.value)} 
                        className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'
                        }`}
                      >
                        <option value="Semua">Semua Kenderaan</option>
                        {vehicles.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>

                      <select 
                        value={filterBulan} 
                        onChange={(e) => setFilterBulan(e.target.value)} 
                        className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'
                        }`}
                      >
                        {BULAN.map(b => <option key={b.nilai} value={b.nilai}>{b.nama}</option>)}
                      </select>

                      <select 
                        value={filterTahun} 
                        onChange={(e) => setFilterTahun(e.target.value)} 
                        className={`w-full py-2.5 px-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-semibold text-xs outline-none shadow-sm ${
                          darkMode 
                            ? 'bg-slate-700 border-slate-600 text-slate-300 focus:border-[#f39200]' 
                            : 'bg-white border-slate-200 text-slate-700 focus:border-[#f39200]'
                        }`}
                      >
                        <option value="Semua">Semua Tahun</option>
                        {[2023, 2024, 2025, 2026, 2027].map(t => <option key={t} value={t.toString()}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* --- SENARAI REKOD DENGAN BUTANG EDIT & DELETE --- */}
                  <div className={`rounded-2xl shadow-sm border overflow-hidden ${
                    darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 backdrop-blur-xl border-white/60'
                  }`}>
                    <div className="overflow-x-auto hidden sm:block">
                      <table className="w-full text-sm text-left">
                        <thead className={`border-b ${
                          darkMode ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-[#4A154B]/5 text-slate-600 border-[#4A154B]/10'
                        }`}>
                          <tr>
                            <th className="p-4 font-bold">Tarikh</th>
                            <th className="p-4 font-bold">Masa</th>
                            <th className="p-4 font-bold">Kenderaan</th>
                            <th className="p-4 font-bold">Pemandu</th>
                            <th className="p-4 font-bold">Destinasi</th>
                            <th className="p-4 text-center font-bold">Jarak</th>
                            <th className="p-4 text-center font-bold">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                          {filteredLogs.map(log => (
                             <tr key={log.id} className={`transition-colors ${
                               darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50/50'
                              }`}>
                               <td className={`p-4 font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                 {log.tarikh}
                               </td>
                               <td className={`p-4 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                 {log.masaMula} - {log.masaTamat}
                               </td>
                               <td className={`p-4 text-xs font-bold uppercase ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
                                 {log.kenderaan.split(' ')[0]}
                               </td>
                               <td className={`p-4 font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                 {log.pemandu}
                               </td>
                               <td className={`p-4 truncate max-w-[200px] ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                 {log.tujuan}
                               </td>
                               <td className={`p-4 text-center font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                 {log.jarak}
                               </td>
                               <td className="p-4 text-center">
                                 <div className="flex items-center justify-center gap-1.5">
                                   <button
                                     onClick={() => openEditModal(log)}
                                     className={`p-1.5 rounded-lg transition-all ${
                                       darkMode 
                                         ? 'hover:bg-slate-600 text-slate-400 hover:text-white' 
                                         : 'hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800'
                                     }`}
                                     title="Edit rekod"
                                   >
                                     <Pencil className="w-4 h-4" />
                                   </button>
                                   <button
                                     onClick={() => handleDeleteLog(log.id)}
                                     className={`p-1.5 rounded-lg transition-all ${
                                       darkMode 
                                         ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300' 
                                         : 'hover:bg-red-50 text-red-500 hover:text-red-700'
                                     }`}
                                     title="Padam rekod"
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </button>
                                 </div>
                               </td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Paparan Kad untuk Skrin Mudah Alih */}
                    <div className="p-4 space-y-4 sm:hidden">
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <div key={log.id} className={`p-5 rounded-2xl shadow-sm border flex flex-col gap-3 ${
                            darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                          }`}>
                            <div className={`flex justify-between items-start border-b pb-3 ${
                              darkMode ? 'border-slate-600' : 'border-slate-100'
                            }`}>
                              <div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 inline-block border ${
                                  darkMode ? 'bg-slate-600 text-[#f39200] border-slate-500' : 'bg-purple-50 text-[#4A154B] border-[#4A154B]/10'
                                }`}>
                                  {log.kenderaan.split(' ')[0]}
                                </span>
                                <h3 className={`font-bold text-[15px] ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                  {log.tarikh}
                                </h3>
                                <p className={`text-[12px] font-semibold flex items-center gap-1.5 mt-1 ${
                                  darkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  <Clock className="w-3 h-3" /> {log.masaMula} - {log.masaTamat}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className={`block text-xl font-black ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                  {log.jarak}
                                </span>
                                <span className="text-[9px] font-bold uppercase tracking-widest block -mt-0.5 text-slate-400">
                                  KM
                                </span>
                              </div>
                            </div>
                            <div className="pt-1">
                              <p className={`text-[13px] font-semibold flex items-center gap-2 mb-1 ${
                                darkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                <UserCircle2 className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} /> 
                                {log.pemandu}
                              </p>
                              <p className={`text-[13px] flex items-start gap-2 leading-snug ${
                                darkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} /> 
                                <span className="line-clamp-2">{log.tujuan}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                              <button
                                onClick={() => openEditModal(log)}
                                className={`p-2 rounded-lg transition-all ${
                                  darkMode 
                                    ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' 
                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                }`}
                                title="Edit rekod"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                className={`p-2 rounded-lg transition-all ${
                                  darkMode 
                                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                                }`}
                                title="Padam rekod"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center">
                          <div className={`p-4 rounded-full mb-3 shadow-sm border ${
                            darkMode ? 'bg-slate-700 text-slate-400 border-slate-600' : 'bg-white text-slate-400 border-slate-100'
                          }`}>
                            <History className="w-8 h-8" />
                          </div>
                          <p className={`font-semibold text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Tiada rekod dijumpai<br/>untuk tapisan ini.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className={`no-print w-full text-center pb-[90px] sm:pb-6 pt-5 px-4 mt-auto relative z-10 border-t ${
        darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-[#4A154B]/10 bg-gradient-to-b from-transparent to-[#4A154B]/5'
      }`}>
        <div className="flex flex-col items-center justify-center gap-3">
          <img 
            src="USM APEX-Ver-R-88255cc4.webp" 
            alt="Logo USM APEX" 
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm opacity-90"
          />
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${
              darkMode ? 'text-slate-500' : 'text-[#4A154B]/60'
            }`}>
               &copy; {new Date().getFullYear()} Hakcipta Terpelihara V-Log@USM
            </p>
            <div className="flex justify-center items-center gap-1.5 text-[#f39200]">
              <Building2 className="w-3.5 h-3.5" />
              <p className={`text-[10px] font-bold tracking-wide ${
                darkMode ? 'text-slate-400' : 'text-[#4A154B]/80'
              }`}>
                Pusat Islam USM Pulau Pinang
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* --- FLOATING BOTTOM NAVIGATION (MOBILE) --- */}
      <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[320px] sm:hidden">
        <div className={`border shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-full p-1.5 flex items-center justify-between gap-1 relative ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-[#4A154B] border-white/20'
        }`}>
          
          <div 
             className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#f39200] rounded-full shadow-md transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
               activeTab === 'borang' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
             }`}
          ></div>

          <button 
            onClick={() => setActiveTab('borang')}
            className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-full transition-colors duration-300 ${
              activeTab === 'borang' ? 'text-white' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-white/60 hover:text-white')
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[12px] font-bold">Borang</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('laporan')}
             className={`flex-1 relative z-10 flex items-center justify-center gap-2 py-3 rounded-full transition-colors duration-300 ${
              activeTab === 'laporan' ? 'text-white' : (darkMode ? 'text-slate-400 hover:text-white' : 'text-white/60 hover:text-white')
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[12px] font-bold">Admin</span>
          </button>
        </div>
      </div>

      {/* --- MODAL TAMBAH PEMANDU (dari borang) --- */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Tambah Pemandu Baharu
              </h3>
              <button onClick={() => { setShowAddDriverModal(false); setQuickDriverName(''); }} className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={quickDriverName}
              onChange={(e) => setQuickDriverName(e.target.value)}
              placeholder="Masukkan nama penuh pemandu..."
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#4A154B] outline-none text-sm ${
                darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAddDriver()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleQuickAddDriver}
                className="flex-1 bg-[#4A154B] text-white font-bold py-3 rounded-xl hover:bg-[#3a0f3b] active:scale-95 transition-all shadow-md"
              >
                Tambah
              </button>
              <button
                onClick={() => { setShowAddDriverModal(false); setQuickDriverName(''); }}
                className={`flex-1 font-bold py-3 rounded-xl active:scale-95 transition-all ${
                  darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMBAH KENDERAAN (dari borang) --- */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Tambah Kenderaan Baharu
              </h3>
              <button onClick={() => { setShowAddVehicleModal(false); setQuickVehicleName(''); }} className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={quickVehicleName}
              onChange={(e) => setQuickVehicleName(e.target.value)}
              placeholder="Contoh: Toyota Hilux (ABC 5678)"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] outline-none text-sm ${
                darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickAddVehicle()}
            />
            <div className="flex gap-3">
              <button
                onClick={handleQuickAddVehicle}
                className="flex-1 bg-[#f39200] text-white font-bold py-3 rounded-xl hover:bg-[#e08600] active:scale-95 transition-all shadow-md"
              >
                Tambah
              </button>
              <button
                onClick={() => { setShowAddVehicleModal(false); setQuickVehicleName(''); }}
                className={`flex-1 font-bold py-3 rounded-xl active:scale-95 transition-all ${
                  darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL EDIT REKOD --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 border ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-white/60'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${
              darkMode ? 'border-slate-700' : 'border-slate-100'
            }`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                <FileSignature className="w-5 h-5 text-[#f39200]" /> 
                Sunting Rekod Perjalanan
              </h3>
              <button onClick={closeEditModal} className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Pilih Kenderaan
                  </label>
                  <select 
                    name="kenderaan" 
                    value={editFormData.kenderaan} 
                    onChange={handleEditInputChange} 
                    required 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="" disabled>Sila pilih...</option>
                    {vehicles.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Nama Pemandu
                  </label>
                  <select 
                    name="pemandu" 
                    value={editFormData.pemandu} 
                    onChange={handleEditInputChange} 
                    required 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="" disabled>Sila pilih...</option>
                    {drivers.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Tarikh Perjalanan
                  </label>
                  <input 
                    type="date" 
                    name="tarikh" 
                    value={editFormData.tarikh} 
                    onChange={handleEditInputChange} 
                    required 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Mulai
                    </label>
                    <input 
                      type="time" 
                      name="masaMula" 
                      value={editFormData.masaMula} 
                      onChange={handleEditInputChange} 
                      required 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm ${
                        darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Hingga
                    </label>
                    <input 
                      type="time" 
                      name="masaTamat" 
                      value={editFormData.masaTamat} 
                      onChange={handleEditInputChange} 
                      required 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] shadow-sm ${
                        darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Tujuan & Destinasi
                  </label>
                  <textarea 
                    name="tujuan" 
                    value={editFormData.tujuan} 
                    onChange={handleEditInputChange} 
                    required 
                    rows="3" 
                    placeholder="Nyatakan PTJ/Jabatan dan destinasi..." 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-medium text-[15px] resize-none shadow-sm ${
                      darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Odometer Mula (KM)
                    </label>
                    <input 
                      type="number" 
                      name="odometerMula" 
                      value={editFormData.odometerMula} 
                      onChange={handleEditInputChange} 
                      required 
                      min="0" 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center shadow-inner ${
                        darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[13px] font-semibold ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Odometer Akhir (KM)
                    </label>
                    <input 
                      type="number" 
                      name="odometerTamat" 
                      value={editFormData.odometerTamat} 
                      onChange={handleEditInputChange} 
                      required 
                      min={editFormData.odometerMula || "0"} 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f39200] font-bold text-lg text-center shadow-inner ${
                        darkMode ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                <div className={`p-3 rounded-xl flex justify-between items-center ${
                  darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border border-slate-200/60'
                }`}>
                  <span className={`font-semibold text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Jarak:
                  </span>
                  <span className={`text-2xl font-black ${darkMode ? 'text-[#f39200]' : 'text-[#4A154B]'}`}>
                    {editJarak} <span className="text-xs font-bold text-slate-400">KM</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#4A154B] text-white font-bold py-3 rounded-xl hover:bg-[#3a0f3b] active:scale-[0.98] transition-all shadow-md">
                  Simpan Perubahan
                </button>
                <button type="button" onClick={closeEditModal} className={`flex-1 font-bold py-3 rounded-xl active:scale-[0.98] transition-all ${
                  darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== KAWASAN CETAKAN PDF ========================================== */}
      <div className="print-only" id="print-area">
        <div className="print-header">
          <img src="USM APEX-Ver-R-88255cc4.webp" alt="Logo USM" />
          <div className="print-header-text">
            <h1>Laporan V-Log@USM</h1>
            <p><strong>PUSAT ISLAM UNIVERSITI SAINS MALAYSIA</strong></p>
            <p>Tarikh Cetakan: {new Date().toLocaleDateString('ms-MY')}</p>
            <p>
              Tapisan: {filterBulan === 'Semua' ? 'Keseluruhan' : BULAN.find(b=>b.nilai===filterBulan)?.nama} / {filterTahun}
            </p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th rowSpan="2" style={{ width: '80px' }}>Tarikh</th>
              <th colSpan="2">Masa</th>
              <th rowSpan="2">Nama Pemandu</th>
              <th rowSpan="2">Kenderaan</th>
              <th rowSpan="2">Tujuan / Destinasi</th>
              <th colSpan="2">Odometer (Km)</th>
              <th rowSpan="2" style={{ width: '60px' }}>Jarak (Km)</th>
            </tr>
            <tr>
              <th style={{ width: '60px' }}>Mulai</th>
              <th style={{ width: '60px' }}>Hingga</th>
              <th style={{ width: '70px' }}>Mula</th>
              <th style={{ width: '70px' }}>Akhir</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ textAlign: 'center' }}>{log.tarikh}</td>
                  <td style={{ textAlign: 'center' }}>{log.masaMula}</td>
                  <td style={{ textAlign: 'center' }}>{log.masaTamat}</td>
                  <td>{log.pemandu}</td>
                  <td>{log.kenderaan}</td>
                  <td>{log.tujuan}</td>
                  <td style={{ textAlign: 'center' }}>{log.odometerMula}</td>
                  <td style={{ textAlign: 'center' }}>{log.odometerTamat}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{log.jarak}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  Tiada rekod penggunaan untuk tapisan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {filteredLogs.length > 0 && (
          <div className="print-summary">
            <span>JUMLAH KESELURUHAN PERJALANAN: {stats.totalTrips} Rekod</span>
            <span>JUMLAH JARAK KESELURUHAN: {stats.totalKM} KM</span>
          </div>
        )}

        <div className="print-footer">
          <div className="qr-section">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Disahkan+oleh+Sistem+V-Log@USM+Pada+${new Date().toISOString()}`} alt="QR Code" />
             <p style={{ fontSize: '10px', marginTop: '5px', color: '#666', fontWeight: 'bold' }}>KOD PENGESAHAN SISTEM</p>
          </div>
         
          <div className="signature-section">
            <p style={{ textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Disediakan / Disahkan Oleh:</p>
            <div className="signature-line"></div>
            <p style={{ fontSize: '12px', textAlign: 'left' }}>Nama:</p>
            <p style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px' }}>Jawatan: Pentadbir Sistem</p>
            <p style={{ fontSize: '12px', textAlign: 'left', marginTop: '5px' }}>Pusat Islam, USM</p>
          </div>
        </div>
      </div>
    </div>
  );
}