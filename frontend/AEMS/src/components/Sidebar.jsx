import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-primary text-white vh-100 p-3">
      <h4 className="text-white">AEMS</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item"><Link className="nav-link text-white" to="/">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/events">Events</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/recalls">Recalls</Link></li>
        <li className="nav-item"><Link className="nav-link text-white" to="/settings">Settings</Link></li>
        <li className="nav-item">
  <a className="nav-link" href="/tracked">My Devices</a>
</li>
      </ul>
    </div>
  );
}
