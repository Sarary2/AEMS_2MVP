import { useEffect, useState } from 'react';
import { fetchDeviceRecalls } from '../utils/fetchRecalls';

export default function Recalls() {
  const [recalls, setRecalls] = useState([]);

  useEffect(() => {
    fetchDeviceRecalls(25).then(setRecalls);
  }, []);

  return (
    <div className="container-fluid">
      <h2 className="my-4">🚨 Device Recalls</h2>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Brand</th>
                <th>Reason</th>
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
                    <td>{recall.recallDate}</td>
                    <td>
                      <span className={`badge bg-${recall.status === 'Ongoing' ? 'warning' : 'secondary'}`}>
                        {recall.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
