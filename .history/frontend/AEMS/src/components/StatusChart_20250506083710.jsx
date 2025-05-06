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

  return (
    <div className="card">
      <div className="card-header">Status Distribution</div>
      <div className="card-body">
        <Pie data={chartData} />
      </div>
    </div>
  );
}
