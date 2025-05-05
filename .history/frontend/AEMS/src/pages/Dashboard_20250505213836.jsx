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

  const getStatusCounts = (key) => ({
    total: devices.length,
    safe: devices.filter(d => d[key] === 'Safe').length,
    warning: devices.filter(d => d[key] === 'Warning').length,
    critical: devices.filter(d => d[key] === 'Critical').length
  });

  const frequency = getStatusCounts('status');
  const harm = getStatusCounts('harmStatus');

  return (
    <div className="container-fluid">
      <h2 className="my-4">Device Risk Overview</h2>

      <div className="row mb-4">
        <StatCard title="Total Devices" count={frequency.total} color="primary" />
        <StatCard title="Safe" count={frequency.safe} color="success" />
        <StatCard title="Warning" count={frequency.warning} color="warning" />
        <StatCard title="Critical" count={frequency.critical} color="danger" />
      </div>

      <div className="row mb-4">
        <StatCard title="Harm Safe" count={harm.safe} color="success" />
        <StatCard title="Harm Warning" count={harm.warning} color="warning" />
        <StatCard title="Harm Critical" count={harm.critical} color="danger" />
      </div>

      {/* ✅ Insert the charts here */}
      {devices.length > 0 && (
        <>
          <EventsChart devices={devices} />
          <StatusChart devices={devices} />
        </>
      )}

      <h4>Tracked Devices</h4>
      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Status</th>
            <th>Harm Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, i) => (
            <DeviceRow
              key={i}
              name={device.deviceName}
              model={device.model}
              status={device.status}
              harmStatus={device.harmStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
