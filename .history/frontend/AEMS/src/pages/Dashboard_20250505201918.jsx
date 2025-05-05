import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceRow from '../components/DeviceRow';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/devices/all').then(res => setDevices(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Device Overview</h1>
      <div className="bg-white rounded shadow p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Device Name</th>
              <th className="p-2">Model</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, idx) => (
              <DeviceRow
                key={idx}
                name={device.deviceName}
                model={device.model}
                status={device.status}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
