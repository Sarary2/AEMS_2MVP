import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EventsChart({ devices }) {
  const chartData = {
    labels: devices.map((d) => d.deviceName.split(' ')[0]).slice(0, 10),
    datasets: [
      {
        label: 'Reported Events',
        data: devices.map((d) => d.events.length).slice(0, 10),
        backgroundColor: '#0d6efd',
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-header">Event Count (Top 10 Devices)</div>
      <div className="card-body">
        <Bar data={chartData} />
      </div>
    </div>
  );
}
