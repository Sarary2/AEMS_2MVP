import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusChart({ data }) {
  const chartData = {
    labels: ['Safe', 'Warning', 'Critical'],
    datasets: [
      {
        data: [data.Safe, data.Warning, data.Critical],
        backgroundColor: ['#198754', '#ffc107', '#dc3545'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="card h-100">
      <div className="card-header fw-semibold">Status Distribution</div>
      <div className="card-body" style={{ height: '350px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
