import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceRow from '../components/DeviceRow';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/devices/all')
      .then(res => setDevices(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Device Overview</h2>
      <div className="row mb-4">
        <div className="col"><div className="alert alert-primary">Total: {devices.length}</div></div>
        <div className="col"><div className="alert alert-success">Safe: {devices.filter(d => d.status === 'Safe').length}</div></div>
        <div className="col"><div className="alert alert-warning">Warning: {devices.filter(d => d.status === 'Warning').length}</div></div>
        <div className="col"><div className="alert alert-danger">Critical: {devices.filter(d => d.status === 'Critical').length}</div></div>
      </div>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Device Name</th>
            <th>Model</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, i) => (
            <DeviceRow key={i} {...device} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
