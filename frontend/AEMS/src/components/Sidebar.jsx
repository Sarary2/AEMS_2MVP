import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaHeartbeat, FaClipboardList, FaCog, FaStethoscope } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <div className="bg-primary text-white d-flex flex-column p-3" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="text-white mb-4">AEMS</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) =>
            `nav-link d-flex align-items-center text-white ${isActive ? 'fw-bold' : ''}`
          }>
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/events" className={({ isActive }) =>
            `nav-link d-flex align-items-center text-white ${isActive ? 'fw-bold' : ''}`
          }>
            <FaHeartbeat className="me-2" /> Events
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/recalls" className={({ isActive }) =>
            `nav-link d-flex align-items-center text-white ${isActive ? 'fw-bold' : ''}`
          }>
            <FaClipboardList className="me-2" /> Recalls
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={({ isActive }) =>
            `nav-link d-flex align-items-center text-white ${isActive ? 'fw-bold' : ''}`
          }>
            <FaCog className="me-2" /> Settings
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/tracked" className={({ isActive }) =>
            `nav-link d-flex align-items-center text-white ${isActive ? 'fw-bold' : ''}`
          }>
            <FaStethoscope className="me-2" /> My Devices
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
