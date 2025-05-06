import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function EventsChart({ devices }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;

    const deviceCounts = devices.reduce((acc, d) => {
      const name = d.brandName || 'Unknown';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(deviceCounts),
      datasets: [
        {
          label: 'Number of Events',
          data: Object.values(deviceCounts),
          backgroundColor: '#0d6efd',
        },
      ],
    };

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [devices]);

  return (
    <div className="card h-100">
      <div className="card-header fw-semibold">Event Count by Device</div>
      <div className="card-body" style={{ height: '350px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
