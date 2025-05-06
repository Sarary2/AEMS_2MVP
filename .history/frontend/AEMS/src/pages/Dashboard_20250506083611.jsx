import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import DeviceRow from '../components/DeviceRow';
import StatusChart from '../components/StatusChart';
import EventsChart from '../components/EventsChart'; // ✅ Add this line

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Failed to fetch devices', err));
  }, []);

  const total = devices.length;
  const safe = devices.filter(d => d.status === 'Safe').length;
  const warning = devices.filter(d => d.status === 'Warning').length;
  const critical = devices.filter(d => d.status === 'Critical').length;

  return (
    <div className="container-fluid">
      <h2 className="my-4">Device Risk Overview</h2>

      <div className="row mb-4">
        <StatCard title="Total Devices" count={total} color="primary" />
        <StatCard title="Safe" count={safe} color="success" />
        <StatCard title="Warning" count={warning} color="warning" />
        <StatCard title="Critical" count={critical} color="danger" />
      </div>

      <div className="row mb-5">
        <div className="col-md-6">
          <StatusChart data={{ Safe: safe, Warning: warning, Critical: critical }} />
        </div>
        <div className="col-md-6">
          <EventsChart devices={devices} />
        </div>
      </div>

      <h4>Tracked Devices</h4>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, i) => (
            <DeviceRow
              key={i}
              name={device.deviceName}
              model={device.model}
              status={device.status}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
