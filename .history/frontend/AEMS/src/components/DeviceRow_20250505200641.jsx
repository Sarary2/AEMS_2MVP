export default function DeviceRow({ name, status }) {
  const statusClasses = {
    Safe: 'bg-green-500',
    Warning: 'bg-yellow-500',
    Critical: 'bg-red-500',
  };

  return (
    <tr className="border-b">
      <td className="p-2 font-medium">{name}</td>
      <td className="p-2">
        <span className={`${statusClasses[status]} text-white px-3 py-1 rounded text-xs`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
