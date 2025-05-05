import React from 'react';

export default function DeviceRow({ name, model, status, harmStatus }) {
  const colorMap = {
    Safe: 'success',
    Warning: 'warning',
    Critical: 'danger'
  };

  return (
    <tr>
      <td>{name}</td>
      <td>{model}</td>
      <td>
        <span className={`badge bg-${colorMap[status]}`}>
          {status}
        </span>
      </td>
      <td>
        <span className={`badge bg-${colorMap[harmStatus]}`}>
          {harmStatus}
        </span>
      </td>
    </tr>
  );
}
