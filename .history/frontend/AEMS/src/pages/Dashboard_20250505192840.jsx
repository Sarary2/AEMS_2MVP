import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import DeviceRow from '../components/DeviceRow';
import EventsChart from '../components/EventsChart';
import StatusChart from '../components/StatusChart';
import axios from 'axios';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ Safe: 0, Warning: 0, Critical: 0 });
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/devices/all') // or your real endpoint
      .then(res => {
        const all = res.data;
        setDevices(all);

        const status = { Safe: 0, Warning: 0, Critical: 0 };
        const eventsTimeline = {};

        all.forEach(d => {
          // classify each device based on most severe event
          let highest = 'Safe';
          d.events?.forEach(ev => {
            const day = ev.reportDate?.split(' ')[0];
            eventsTimeline[day] = (eventsTimeline[day] || 0) + 1;

            if (ev.severity === 'Critical') highest = 'Critical';
            else if (ev.severity === 'Moderate' && highest !== 'Critical') highest = 'Warning';
          });
          status[highest]++;
        });

        setStatusCounts(status);
        setEventData(Object.entries(eventsTimeline).map(([date, count]) => ({ date, count })));
      });
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Device Overview</h1>
        <p className="text-gray-600 mb-6">
          {devices.length} devices online, {statusCounts.Warning} in warning state
        </p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Devices" value={devices.length} color="blue" />
          <StatCard label="Safe" value={statusCounts.Safe} color="green" />
          <StatCard label="Warning" value={statusCounts.Warning} color="yellow" />
          <StatCard label="Critical" value={statusCounts.Critical} color="red" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Events Over Time</h2>
            <EventsChart data={eventData} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-2">Devices by Status</h2>
            <StatusChart
              data={[
                { status: 'Safe', value: statusCounts.Safe },
                { status: 'Warning', value: statusCounts.Warning },
                { status: 'Critical', value: statusCounts.Critical }
              ]}
            />
          </div>
        </div>

        <div className="mt-8 bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Device List</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Device Name</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device, idx) => (
                <DeviceRow key={idx} name={device.deviceName} status={
                  device.events?.some(e => e.severity === 'Critical') ? 'Critical' :
                  device.events?.some(e => e.severity === 'Moderate') ? 'Warning' :
                  'Safe'
                } />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
