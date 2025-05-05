export default function DeviceRow({ name, status }) {
    const colorMap = {
      Safe: 'green',
      Warning: 'yellow',
      Critical: 'red'
    };
  
    return (
      <tr className="border-b">
        <td className="p-2 font-medium">{name}</td>
        <td className="p-2">
          <span className={`bg-${colorMap[status]}-500 text-white px-3 py-1 rounded text-xs`}>
            {status}
          </span>
        </td>
      </tr>
    );
  }
  