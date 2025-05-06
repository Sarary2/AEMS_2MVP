import { useEffect, useState } from 'react';
import { fetchDeviceRecalls } from '../utils/fetchRecalls';

export default function Recalls() {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceRecalls(25).then(data => {
      setRecalls(data);
      setLoading(false);
    });
  }, []);

  const formatDate = (rawDate) => {
    if (!rawDate || rawDate.length !== 8) return 'N/A';
    const year = rawDate.slice(0, 4);
    const month = rawDate.slice(4, 6);
    const day = rawDate.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing': return 'warning';
      case 'completed': return 'success';
      case 'terminated': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="my-4">🚨 Medical Device Recalls</h2>

      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white fw-bold">
          Recent Recall Events
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4 text-muted">Loading recalls...</div>
          ) : (
            <table className="table table-striped table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Brand Name</th>
                  <th>Reason for Recall</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recalls.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No recalls found.</td>
                  </tr>
                ) : (
                  recalls.map((recall, i) => (
                    <tr key={i}>
                      <td>{recall.brandName}</td>
                      <td>{recall.recallReason}</td>
                      <td>{formatDate(recall.recallDate)}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(recall.status)}`}>
                          {recall.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
