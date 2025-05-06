import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DeviceRow from '../components/DeviceRow';
import StatusChart from '../components/StatusChart';
import EventsChart from '../components/EventsChart';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Failed to fetch devices', err));
  }, []);

  const getStatusCounts = () => {
    const total = devices.length;
    const safe = devices.filter(d => d.status === 'Safe').length;
    const warning = devices.filter(d => d.status === 'Warning').length;
    const critical = devices.filter(d => d.status === 'Critical').length;
    return { total, safe, warning, critical };
  };

  const { total, safe, warning, critical } = getStatusCounts();
  const filteredDevices = filter === 'All' ? devices : devices.filter(d => d.status === filter);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2>Device Risk Overview</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/register')}>Register</button>
          <button className="btn btn-outline-danger" onClick={() => alert('Logged out')}>Logout</button>
        </div>
      </div>

      <div className="row mb-4">
        <StatCard title="Total Devices" count={total} color="primary" />
        <StatCard title="Safe" count={safe} color="success" />
        <StatCard title="Warning" count={warning} color="warning" />
        <StatCard title="Critical" count={critical} color="danger" />
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <StatusChart data={{ Safe: safe, Warning: warning, Critical: critical }} />
        </div>
        <div className="col-md-6">
          <EventsChart devices={devices} />
        </div>
      </div>

      <div className="mb-3">
        <strong>Filter by Status:</strong>{' '}
        {['All', 'Safe', 'Warning', 'Critical'].map((s) => (
          <button
            key={s}
            className={`btn btn-sm mx-1 btn-${s === 'All' ? 'secondary' : s === 'Safe' ? 'success' : s === 'Warning' ? 'warning' : 'danger'}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <h4>Tracked Devices ({filteredDevices.length})</h4>
      <table className="table table-striped table-bordered mt-2">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Device Problem</th>
            <th>Patient Problem</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.map((device, i) => (
            <DeviceRow
              key={i}
              name={device.deviceName}
              model={device.deviceProblem || 'N/A'}
              patientProblem={device.patientProblem || 'N/A'}
              status={device.status}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
