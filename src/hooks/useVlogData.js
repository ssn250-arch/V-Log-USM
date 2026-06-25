import { useState, useEffect } from 'react';
import { DEFAULT_DRIVERS, DEFAULT_VEHICLES } from '../constants';

export function useVlogData() {
  const [logs, setLogs] = useState([]); // [cite: 7]
  const [drivers, setDrivers] = useState([]); // [cite: 15]
  const [vehicles, setVehicles] = useState([]); // [cite: 15]

  useEffect(() => {
    const savedLogs = localStorage.getItem('vlog_usm_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs)); // [cite: 21]

    const savedDrivers = localStorage.getItem('vlog_usm_drivers');
    setDrivers(savedDrivers ? JSON.parse(savedDrivers) : DEFAULT_DRIVERS); // [cite: 22]

    const savedVehicles = localStorage.getItem('vlog_usm_vehicles');
    setVehicles(savedVehicles ? JSON.parse(savedVehicles) : DEFAULT_VEHICLES); // [cite: 22]
  }, []);

  useEffect(() => {
    if (drivers.length > 0) localStorage.setItem('vlog_usm_drivers', JSON.stringify(drivers));
  }, [drivers]); // [cite: 23]

  useEffect(() => {
    if (vehicles.length > 0) localStorage.setItem('vlog_usm_vehicles', JSON.stringify(vehicles));
  }, [vehicles]); // [cite: 24]

  const addLog = (newLog) => {
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));
  }; // [cite: 32]

  const deleteLog = (id) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));
  }; // [cite: 56, 57]

  const updateLog = (id, updatedData) => {
    const updatedLogs = logs.map(log => log.id === id ? { ...log, ...updatedData } : log);
    setLogs(updatedLogs);
    localStorage.setItem('vlog_usm_logs', JSON.stringify(updatedLogs));
  }; // [cite: 67, 68]

  return { logs, drivers, vehicles, setDrivers, setVehicles, addLog, deleteLog, updateLog };
}