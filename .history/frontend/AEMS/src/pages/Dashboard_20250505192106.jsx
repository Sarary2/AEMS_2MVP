import { useState } from 'react';
import axios from 'axios';
import SearchForm from '../components/SearchForm';

export default function Dashboard() {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (name, model) => {
    setError('');
    setDevice(null);
    try {
      const res = await axios.get(`http://localhost:5001/api/devices`, {
        params: { name, model }
      });
      setDevice(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching device.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Device Event Dashboard</h1>
      <SearchForm onSearch={handleSearch} />

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {device && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{device.deviceName} ({device.model})</h2>
          <p className="text-gray-600 mb-2">Manufacturer: {device.manufacturer}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {device.events.map((event, idx) => (
              <div key={idx} className="border rounded p-4 shadow">
                <p><strong>Type:</strong> {event.eventType}</p>
                <p><strong>Severity:</strong> <span className={`text-${event.severity === 'Severe' ? 'red' : event.severity === 'Moderate' ? 'orange' : 'green'}-600 font-semibold`}>{event.severity}</span></p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Patient Problem:</strong> {event.patientProblem}</p>
                <p><strong>Reported:</strong> {event.reportDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
