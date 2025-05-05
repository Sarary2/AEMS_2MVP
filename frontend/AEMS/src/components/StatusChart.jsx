import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusChart({ devices }) {
  const counts = {
    Safe: 0,
    Warning: 0,
    Critical: 0
  };

  devices.forEach(device => {
    if (counts[device.status] !== undefined) {
      counts[device.status]++;
    }
  });

  const chartData = {
    labels: ['Safe', 'Warning', 'Critical'],
    datasets: [
      {
        label: 'Devices',
        data: [counts.Safe, counts.Warning, counts.Critical],
        backgroundColor: ['#198754', '#ffc107', '#dc3545']
      }
    ]
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Device Status Distribution</h5>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

