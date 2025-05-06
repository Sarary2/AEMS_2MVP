import { useEffect, useState } from 'react';
import { fetchDeviceRecalls } from '../utils/fetchRecalls';

export default function Recalls() {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTrackedDevices = () =>
    JSON.parse(localStorage.getItem('trackedDevices') || '[]').map(t => t.toLowerCase());

  useEffect(() => {
    const tracked = getTrackedDevices();

    fetchDeviceRecalls().then(data => {
      const matched = data.filter(recall =>
        tracked.some(t => recall.brandName?.toLowerCase().includes(t))
      );
      setRecalls(matched);
      setLoading(false);
    });
  }, []);

  const formatDate = (rawDate) => {
    if (!rawDate || rawDate.length !== 8) return 'N/A';
    return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6)}`;
  };

  const statusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'terminated': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="my-4">🚨 Recalls Matching Your Tracked Devices</h2>

      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white fw-bold">
          Filtered Recalls from OpenFDA
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4 text-muted">Loading recall data...</div>
          ) : recalls.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No recalls match your tracked devices.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Brand</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recalls.map((recall, i) => (
                    <tr key={i}>
                      <td>{recall.brandName}</td>
                      <td>{recall.recallReason}</td>
                      <td>{formatDate(recall.recallDate)}</td>
                      <td>
                        <span className={`badge bg-${statusColor(recall.status)}`}>
                          {recall.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
