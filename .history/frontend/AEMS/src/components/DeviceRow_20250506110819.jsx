export default function DeviceRow({ name, model, patientProblem, status }) {
  const colorMap = { Safe: 'success', Warning: 'warning', Critical: 'danger' };

  return (
    <tr>
      <td>{name}</td>
      <td>{model}</td>
      <td>{patientProblem}</td>
      <td><span className={`badge bg-${colorMap[status]}`}>{status}</span></td>
    </tr>
  );
}
