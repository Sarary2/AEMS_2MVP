import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackedDevices() {
  const [allDevices, setAllDevices] = useState([]);
  const [tracked, setTracked] = useState(() =>
    JSON.parse(localStorage.getItem('trackedDevices') || '[]')
  );
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => setAllDevices(data))
      .catch(err => console.error('Failed to load devices', err));
  }, []);

  const handleAdd = () => {
    if (!selected || tracked.find(d => d.deviceName === selected)) return;
    const found = allDevices.find(d => d.deviceName === selected);
    if (found) {
      const updated = [...tracked, found];
      setTracked(updated);
      localStorage.setItem('trackedDevices', JSON.stringify(updated));
      setSelected('');
    }
  };

  const handleRemove = (name) => {
    const updated = tracked.filter(d => d.deviceName !== name);
    setTracked(updated);
    localStorage.setItem('trackedDevices', JSON.stringify(updated));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Track Devices in Your Hospital</h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-10">
          <select
            className="form-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            <option value="">-- Select Device --</option>
            {allDevices.map((d, i) => (
              <option key={i} value={d.deviceName}>
                {d.deviceName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleAdd}>
            Add Device
          </button>
        </div>
      </div>

      <h5>Tracked Devices</h5>
      {tracked.length > 0 ? (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Model</th>
              <th>Status</th>
              <th>Harm Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tracked.map((d, i) => (
              <tr key={i}>
                <td>{d.deviceName}</td>
                <td>{d.model}</td>
                <td>
                  <span className={`badge bg-${statusColor(d.status)}`}>{d.status}</span>
                </td>
                <td>
                  <span className={`badge bg-${statusColor(d.harmStatus)}`}>{d.harmStatus}</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(d.deviceName)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">No devices being tracked yet.</p>
      )}
    </div>
  );
}

function statusColor(status) {
  const map = { Safe: 'success', Warning: 'warning', Critical: 'danger' };
  return map[status] || 'secondary';
}
