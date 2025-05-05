import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Fetch failed:', err));
  }, []);

  const countByField = (field, value) => {
    return devices.filter(d => d[field] === value).length;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Device Risk Overview</h2>

      {/* Row 1: Event Frequency-Based Classification */}
      <div className="row mb-3">
        <div className="col"><div className="alert alert-primary">Total: {devices.length}</div></div>
        <div className="col"><div className="alert alert-success">Safe: {countByField('status', 'Safe')}</div></div>
        <div className="col"><div className="alert alert-warning">Warning: {countByField('status', 'Warning')}</div></div>
        <div className="col"><div className="alert alert-danger">Critical: {countByField('status', 'Critical')}</div></div>
      </div>

      {/* Row 2: Patient Harm-Based Classification */}
      <div className="row mb-4">
        <div className="col"><div className="alert alert-primary">Harm Total: {devices.length}</div></div>
        <div className="col"><div className="alert alert-success">Harm Safe: {countByField('harmStatus', 'Safe')}</div></div>
        <div className="col"><div className="alert alert-warning">Harm Warning: {countByField('harmStatus', 'Warning')}</div></div>
        <div className="col"><div className="alert alert-danger">Harm Critical: {countByField('harmStatus', 'Critical')}</div></div>
      </div>

      {/* Device Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Device Name</th>
            <th>Model</th>
            <th>Status</th>
            <th>Harm Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, idx) => (
            <tr key={idx}>
              <td>{device.deviceName}</td>
              <td>{device.model}</td>
              <td><span className={`badge bg-${getColor(device.status)}`}>{device.status}</span></td>
              <td><span className={`badge bg-${getColor(device.harmStatus)}`}>{device.harmStatus}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getColor(status) {
  if (status === 'Safe') return 'success';
  if (status === 'Warning') return 'warning text-dark';
  if (status === 'Critical') return 'danger';
  return 'secondary';
}


