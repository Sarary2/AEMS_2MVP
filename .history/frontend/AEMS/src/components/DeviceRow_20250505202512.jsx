import React from 'react';

export default function DeviceRow({ deviceName, model, status }) {
  const badgeClass = {
    Safe: 'bg-success',
    Warning: 'bg-warning text-dark',
    Critical: 'bg-danger'
  };

  return (
    <tr>
      <td>{deviceName}</td>
      <td>{model}</td>
      <td><span className={`badge ${badgeClass[status]}`}>{status}</span></td>
    </tr>
  );
}
