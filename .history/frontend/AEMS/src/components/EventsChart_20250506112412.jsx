import { useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function EventsChart({ devices }) {
  useEffect(() => {
    const ctx = document.getElementById('eventsChart');

    const deviceCounts = devices.reduce((acc, d) => {
      const name = d.deviceName || 'Unknown';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(deviceCounts),
      datasets: [
        {
          label: 'Number of Events',
          data: Object.values(deviceCounts),
          backgroundColor: ['#0d6efd', '#ffc107', '#dc3545', '#198754', '#6f42c1'],
        },
      ],
    };

    const chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
    });

    return () => chart.destroy();
  }, [devices]);

  return (
    <div>
      <h5 className="mb-3">Event Count by Device</h5>
      <canvas id="eventsChart" width="400" height="250"></canvas>
    </div>
  );
}
