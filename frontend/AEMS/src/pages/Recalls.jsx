export default function Recalls() {
    const recalls = [
      { brandName: 'Infusion Pump A', reason: 'Leak detected', date: '2025-05-04' },
      { brandName: 'Heart Monitor Q', reason: 'Display malfunction', date: '2025-04-30' },
    ];
  
    return (
      <div>
        <h2 className="mb-4">📋 Recent Device Recalls</h2>
        <table className="table table-striped">
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
                <td>{r.brandName}</td>
                <td>{r.reason}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  