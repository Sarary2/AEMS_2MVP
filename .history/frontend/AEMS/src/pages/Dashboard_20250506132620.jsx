import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DeviceRow from '../components/DeviceRow';
import StatusChart from '../components/StatusChart';
import RecallsPanel from '../components/RecallsPanel'; // <-- NEW

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [tracked, setTracked] = useState(() =>
    JSON.parse(localStorage.getItem('trackedDevices') || '[]')
  );
  const [deviceInput, setDeviceInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Failed to fetch devices', err));
  }, []);

  const handleTrackAdd = () => {
    const input = deviceInput.trim().toLowerCase();
    if (!input || tracked.includes(input)) return;
    const updated = [...tracked, input];
    setTracked(updated);
    localStorage.setItem('trackedDevices', JSON.stringify(updated));
    setDeviceInput('');
  };

  const handleTrackRemove = (brandName) => {
    const normalized = tracked.find(t => brandName.toLowerCase().includes(t));
    if (!normalized) return;
    const updated = tracked.filter(t => t !== normalized);
    setTracked(updated);
    localStorage.setItem('trackedDevices', JSON.stringify(updated));
  };

  const matchedTrackedDevices = devices.filter(d =>
    tracked.some(t => d.brandName.toLowerCase().includes(t))
  );

  const filteredDevices =
    filter === 'All'
      ? matchedTrackedDevices
      : matchedTrackedDevices.filter(d => d.status === filter);

  const getStatusCounts = () => {
    const safe = filteredDevices.filter(d => d.status === 'Safe').length;
    const warning = filteredDevices.filter(d => d.status === 'Warning').length;
    const critical = filteredDevices.filter(d => d.status === 'Critical').length;
    return {
      total: filteredDevices.length,
      safe,
      warning,
      critical,
    };
  };

  const { total, safe, warning, critical } = getStatusCounts();

  const statusIcons = {
    Safe: '✅',
    Warning: '⚠️',
    Critical: '❌',
  };

  // Temporary dummy recalls
  const dummyRecalls = [
    { brandName: 'Infusion Pump A', recallReason: 'Leak detected', recallDate: '2025-05-04' },
    { brandName: 'Heart Monitor Q', recallReason: 'Display malfunction', recallDate: '2025-04-30' },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2>📊 Device Risk Overview</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/register')}>Register</button>
          <button className="btn btn-outline-danger" onClick={() => alert('🔒 Logged out')}>Logout</button>
        </div>
      </div>

      <div className="mb-3 row">
        <div className="col-md-10">
          <input
            placeholder="Enter device name to track"
            className="form-control"
            value={deviceInput}
            onChange={(e) => setDeviceInput(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleTrackAdd}>
            ➕ Track Device
          </button>
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
            {s} {statusIcons[s] || ''}
          </button>
        ))}
      </div>

      <h4>📋 Tracked Devices ({filteredDevices.length})</h4>
      <div className="table-responsive mb-4">
        <table className="table table-striped table-bordered mt-2">
          <thead className="table-light">
            <tr>
              <th>Brand Name</th>
              <th>Device Problem</th>
              <th>Patient Problem</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device, i) => (
              <DeviceRow key={i} device={device} onRemove={handleTrackRemove} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="row mb-4">
        <StatCard title="Total Devices" count={total} />
        <StatCard title="Safe" count={safe} />
        <StatCard title="Warning" count={warning} />
        <StatCard title="Critical" count={critical} />
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <StatusChart data={{ Safe: safe, Warning: warning, Critical: critical }} />
        </div>
        <div className="col-md-6">
          <RecallsPanel recalls={dummyRecalls} />
        </div>
      </div>
    </div>
  );
}
