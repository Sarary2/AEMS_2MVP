import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EventsChart({ devices }) {
  const severityCounts = { Severe: 0, Moderate: 0, Minor: 0 };

  devices.forEach(device => {
    device.events.forEach(event => {
      if (severityCounts[event.severity] !== undefined) {
        severityCounts[event.severity]++;
      }
    });
  });

  const chartData = {
    labels: ['Severe', 'Moderate', 'Minor'],
    datasets: [
      {
        label: 'Event Count',
        data: [
          severityCounts.Severe,
          severityCounts.Moderate,
          severityCounts.Minor
        ],
        backgroundColor: ['#dc3545', '#ffc107', '#198754']
      }
    ]
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Event Severity Distribution</h5>
        <Bar data={chartData} />
      </div>
    </div>
  );
}
