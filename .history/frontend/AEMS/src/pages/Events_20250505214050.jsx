import { useEffect, useState } from 'react';

export default function Events() {
  const [device, setDevice] = useState(null);
  const [query, setQuery] = useState({ name: '', model: '' });
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.name || !query.model) return;

    setError('');
    setDevice(null);

    try {
      const res = await fetch(`http://localhost:5001/api/devices?name=${encodeURIComponent(query.name)}&model=${encodeURIComponent(query.model)}`);
      if (!res.ok) throw new Error('Device not found.');
      const data = await res.json();
      setDevice(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Device Event Details</h3>

      <form onSubmit={handleSearch} className="row g-3 mb-4">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Device Name"
            value={query.name}
            onChange={e => setQuery({ ...query, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Model Code"
            value={query.model}
            onChange={e => setQuery({ ...query, model: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {device && (
        <>
          <div className="mb-4">
            <h5>{device.deviceName} ({device.model})</h5>
            <p><strong>Status:</strong> <span className={`badge bg-${getColor(device.status)}`}>{device.status}</span></p>
            <p><strong>Harm Status:</strong> <span className={`badge bg-${getColor(device.harmStatus)}`}>{device.harmStatus}</span></p>
          </div>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Event Type</th>
                <th>Problem</th>
                <th>Patient Problem</th>
                <th>Severity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {device.events.map((event, idx) => (
                <tr key={idx}>
                  <td>{event.eventType}</td>
                  <td>{event.description}</td>
                  <td>{event.patientProblem}</td>
                  <td><span className={`badge bg-${getColor(event.severity)}`}>{event.severity}</span></td>
                  <td>{event.reportDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function getColor(level) {
  return {
    Safe: 'success',
    Warning: 'warning',
    Critical: 'danger',
    Minor: 'secondary',
    Moderate: 'warning',
    Severe: 'danger'
  }[level] || 'secondary';
}
