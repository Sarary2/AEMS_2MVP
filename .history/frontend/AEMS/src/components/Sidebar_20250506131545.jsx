import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-primary text-white d-flex flex-column p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="text-white mb-4">AEMS</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/events">Events</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/recalls">Recalls</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/settings">Settings</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/tracked">My Devices</Link>
        </li>
      </ul>
    </div>
  );
}
