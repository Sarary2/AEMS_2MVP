export default function DeviceRow({ name, deviceProblem, patientProblem, status }) {
  const colorMap = { Safe: 'success', Warning: 'warning', Critical: 'danger' };

  return (
    <tr>
      <td><strong>{name}</strong></td>
      <td>{deviceProblem}</td>
      <td>{patientProblem}</td>
      <td>
        <span className={`badge rounded-pill bg-${colorMap[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
