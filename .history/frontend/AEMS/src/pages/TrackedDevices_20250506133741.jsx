import { useEffect, useState } from 'react';
import DeviceRow from '../components/DeviceRow';

export default function TrackedDevices() {
  const [devices, setDevices] = useState([]);
  const [tracked, setTracked] = useState(() =>
    JSON.parse(localStorage.getItem('trackedDevices') || '[]')
  );
  const [deviceInput, setDeviceInput] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(err => console.error('Error fetching devices', err));
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

  const statusIcons = {
    Safe: '✅',
    Warning: '⚠️',
    Critical: '❌'
  };

  return (
    <div className="container-fluid">
      <h2 className="mt-4 mb-3">📋 Tracked Devices</h2>

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

      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3">
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
            {filteredDevices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No tracked devices match this filter.</td>
              </tr>
            ) : (
              filteredDevices.map((device, i) => (
                <DeviceRow key={i} device={device} onRemove={handleTrackRemove} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
