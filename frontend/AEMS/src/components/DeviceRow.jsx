export default function DeviceRow({ device, onRemove }) {
  const colorMap = { Safe: 'success', Warning: 'warning', Critical: 'danger' };
  const firstEvent = device.events?.[0] || {};
  const deviceProblem = firstEvent.deviceProblem || 'N/A';
  const patientProblem = firstEvent.patientProblem || 'N/A';

  return (
    <tr>
      <td><strong>{device.brandName}</strong></td>
      <td>{deviceProblem}</td>
      <td>{patientProblem}</td>
      <td>
        <span className={`badge bg-${colorMap[device.status]}`}>
          {device.status}
        </span>
      </td>
      <td>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onRemove?.(device.brandName)}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}

