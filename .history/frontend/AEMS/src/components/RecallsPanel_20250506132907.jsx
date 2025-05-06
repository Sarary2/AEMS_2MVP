export default function RecallsPanel({ recalls }) {
    return (
      <div className="card h-100">
        <div className="card-header fw-bold">Recent Recalls</div>
        <div className="card-body p-0">
          <table className="table mb-0 table-hover">
            <thead className="table-light">
              <tr>
                <th>Brand</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recalls.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No recent recalls.</td>
                </tr>
              ) : (
                recalls.map((recall, idx) => (
                  <tr key={idx}>
                    <td>{recall.brandName}</td>
                    <td>{recall.recallReason}</td>
                    <td>{recall.recallDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  