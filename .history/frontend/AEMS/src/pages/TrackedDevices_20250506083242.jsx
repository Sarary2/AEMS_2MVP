import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackedDevices() {
  const [deviceInput, setDeviceInput] = useState('');
  const [tracked, setTracked] = useState(() =>
    JSON.parse(localStorage.getItem('trackedDevices') || '[]')
  );
  const [matched, setMatched] = useState([]);
  const navigate = useNavigate();

  const normalize = (str) => str.trim().toLowerCase();

  const handleAdd = () => {
    const name = normalize(deviceInput);
    if (!name || tracked.includes(name)) return;

    const updated = [...tracked, name];
    setTracked(updated);
    localStorage.setItem('trackedDevices', JSON.stringify(updated));
    setDeviceInput('');
  };

  const handleRemove = (name) => {
    const updated = tracked.filter(d => d !== name);
    setTracked(updated);
    localStorage.setItem('trackedDevices', JSON.stringify(updated));
  };

  useEffect(() => {
    if (tracked.length === 0) {
      setMatched([]);
      return;
    }

    fetch('http://localhost:5001/api/devices/all')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(d =>
          tracked.some(t => d.deviceName.toLowerCase().includes(t))
        );
        setMatched(filtered);
      })
      .catch(err => console.error('Match fetch failed', err));
  }, [tracked]);

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
          <input
            placeholder="Enter device name (e.g. Dexcom)"
            className="form-control"
            value={deviceInput}
            onChange={e => setDeviceInput(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleAdd}>
            Add Device
          </button>
        </div>
      </div>

      <h5>Matched Devices</h5>
      {matched.length > 0 ? (
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
            {matched.map((d, i) => (
              <tr key={i}>
                <td>{d.deviceName}</td>
                <td>{d.model}</td>
                <td>
                  <span className={`badge bg-${statusColor(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${statusColor(d.harmStatus)}`}>
                    {d.harmStatus}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemove(
                      tracked.find(t => d.deviceName.toLowerCase().includes(t))
                    )}
                  >
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
