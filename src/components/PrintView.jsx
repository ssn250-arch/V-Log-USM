import React from 'react';

export default function PrintView({ logs, filterBulan, filterTahun }) {
  // Kira total untuk print
  const totalTrips = logs ? logs.length : 0;
  const totalKM = logs ? logs.reduce((sum, log) => sum + (parseFloat(log.jarak) || 0), 0) : 0;

  return (
    <div className="print-only" id="print-area">
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
            
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; page-break-inside: auto; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            th, td { border: 1px solid #ddd; padding: 10px 8px; text-align: left; }
            th { background-color: #4A154B !important; color: white !important; font-weight: bold; text-align: center; }
            tr:nth-child(even) { background-color: #f9f9f9 !important; }
            
            .print-summary { margin-top: 30px; padding: 15px; background-color: #f3f4f6 !important; border-radius: 8px; border-left: 4px solid #f39200; display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
            .print-footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; page-break-inside: avoid; }
            .qr-section { text-align: center; }
            .qr-section img { width: 80px; height: 80px; margin: 0 auto; border: 1px solid #eee; padding: 4px; border-radius: 8px; }
            .signature-section { text-align: right; width: auto; align-self: center; }
            
            @page { size: A4 landscape; margin: 10mm; }
          }
          /* INI PENYELESAIANNYA: Sembunyikan div print pada skrin biasa */
          .print-only { display: none; }
        `}
      </style>

      <div className="print-header">
        <img src="USM APEX-Ver-R-88255cc4.webp" alt="Logo USM" />
        <div className="print-header-text">
          <h1>Laporan V-Log@USM</h1>
          <p><strong>PUSAT ISLAM UNIVERSITI SAINS MALAYSIA</strong></p>
          <p>Tarikh Cetakan: {new Date().toLocaleDateString('ms-MY')}</p>
          <p>Tapisan: {filterBulan || 'Keseluruhan'} / {filterTahun || new Date().getFullYear()}</p>
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
          {logs && logs.length > 0 ? (
            logs.map((log) => (
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
      
      {logs && logs.length > 0 && (
        <div className="print-summary">
          <span>JUMLAH KESELURUHAN PERJALANAN: {totalTrips} Rekod</span>
          <span>JUMLAH JARAK KESELURUHAN: {totalKM} KM</span>
        </div>
      )}

      <div className="print-footer">
        <div className="qr-section">
           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Disahkan+oleh+Sistem+V-Log@USM+Pada+${new Date().toISOString()}`} alt="QR Code" />
           <p style={{ fontSize: '10px', marginTop: '5px', color: '#666', fontWeight: 'bold' }}>KOD PENGESAHAN SISTEM</p>
        </div>
        <div className="signature-section">
          <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#555', fontWeight: '500' }}>
            * Tidak perlu tandatangan kerana dokumen ini adalah cetakan digital.<br/>
            (Disahkan melalui kod QR Sistem V-Log@USM)
          </p>
        </div>
      </div>
    </div>
  );
}