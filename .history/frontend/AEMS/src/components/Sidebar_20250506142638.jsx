import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaHeartbeat,
  FaClipboardList,
  FaCog,
  FaStethoscope,
} from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Sidebar() {
  return (
    <div
      className="bg-primary text-white d-flex flex-column align-items-start p-3"
      style={{ width: '250px', minHeight: '100vh' }}
    >
      {/* Logo and Branding */}
      <div className="w-100 text-center mb-4">
        <img
          src={logo}
          alt="AEMS Logo"
          className="img-fluid"
          style={{ height: '50px', objectFit: 'contain' }}
        />
        <h5 className="mt-2 fw-bold">AEMS</h5>
      </div>

      {/* Navigation */}
      <ul className="nav flex-column w-100">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white px-2 py-2 ${isActive ? 'fw-bold bg-white bg-opacity-25 rounded' : ''}`
            }
          >
            <FaTachometerAlt className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/events"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white px-2 py-2 ${isActive ? 'fw-bold bg-white bg-opacity-25 rounded' : ''}`
            }
          >
            <FaHeartbeat className="me-2" />
            Events
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/recalls"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white px-2 py-2 ${isActive ? 'fw-bold bg-white bg-opacity-25 rounded' : ''}`
            }
          >
            <FaClipboardList className="me-2" />
            Recalls
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white px-2 py-2 ${isActive ? 'fw-bold bg-white bg-opacity-25 rounded' : ''}`
            }
          >
            <FaCog className="me-2" />
            Settings
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/tracked"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center text-white px-2 py-2 ${isActive ? 'fw-bold bg-white bg-opacity-25 rounded' : ''}`
            }
          >
            <FaStethoscope className="me-2" />
            My Devices
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
