export default function RecallsPanel({ recalls }) {
    return (
      <div className="card h-100">
        <div className="card-header fw-semibold">Recent Recalls</div>
        <div className="card-body p-0">
          {recalls.length === 0 ? (
            <p className="text-muted text-center py-3">No recent recalls reported.</p>
          ) : (
            <table className="table mb-0 table-sm table-striped">
              <thead className="table-light">
                <tr>
                  <th>Brand</th>
                  <th>Reason</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recalls.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.brandName}</strong></td>
                    <td>{r.recallReason}</td>
                    <td>{r.recallDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
  