export default function DeviceRow({ device }) {
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
        <span className={`badge rounded-pill bg-${colorMap[device.status]}`}>
          {device.status}
        </span>
      </td>
    </tr>
  );
}
