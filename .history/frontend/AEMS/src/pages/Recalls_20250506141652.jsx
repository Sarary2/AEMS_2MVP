import { useEffect, useState } from 'react';
import { fetchDeviceRecalls } from '../utils/fetchRecalls';

export default function Recalls() {
  const [recalls, setRecalls] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceRecalls().then(data => {
      setRecalls(data);
      setFiltered(data); // default shows all
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filteredResults = recalls.filter(recall =>
      recall.brandName.toLowerCase().includes(term)
    );
    setFiltered(filteredResults);
  }, [searchTerm, recalls]);

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
      <h2 className="my-4">🚨 Medical Device Recalls</h2>

      <div className="mb-3 row">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by device brand (e.g. Medtronic, Pump, Abbott)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white fw-bold">
          Search Results from OpenFDA
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4 text-muted">Loading recall data...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-4 text-muted">No recalls found for "{searchTerm}".</div>
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
                  {filtered.map((recall, i) => (
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
