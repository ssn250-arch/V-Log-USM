import { useState, useEffect } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vlog_dark_mode');
    return saved ? JSON.parse(saved) : false;
  }); // [cite: 8]

  useEffect(() => {
    localStorage.setItem('vlog_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]); // [cite: 25]

  const toggleDarkMode = () => setDarkMode(prev => !prev); // [cite: 78]

  return { darkMode, toggleDarkMode };
}