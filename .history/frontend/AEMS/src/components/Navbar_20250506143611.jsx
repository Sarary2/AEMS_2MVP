// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
      <div className="container-fluid justify-content-end">
        <button className="btn btn-outline-primary me-2" onClick={() => navigate('/login')}>Login</button>
        <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/register')}>Register</button>
        <button className="btn btn-outline-danger me-3" onClick={() => alert('🔒 Logged out')}>Logout</button>
        <button className="btn btn-outline-dark" onClick={() => navigate('/settings')}>
          <FaCog className="me-1" /> Settings
        </button>
      </div>
    </nav>
  );
}
