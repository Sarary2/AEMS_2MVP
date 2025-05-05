import React from 'react';

const statusClassMap = {
  Safe: 'bg-green-500',
  Warning: 'bg-yellow-500',
  Critical: 'bg-red-500',
};

export default function DeviceRow({ name, model, status }) {
  return (
    <tr className="border-b">
      <td className="p-2 font-medium text-gray-800">{name}</td>
      <td className="p-2 text-gray-600">{model}</td>
      <td className="p-2">
        <span className={`${statusClassMap[status]} text-white px-3 py-1 rounded text-xs`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
