import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <div className="container-fluid d-flex justify-content-end">
        <div className="btn-group" role="group" aria-label="Auth buttons">
          <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
            <FaSignInAlt className="me-1" /> Login
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/register')}>
            <FaUserPlus className="me-1" /> Register
          </button>
          <button className="btn btn-outline-danger" onClick={() => alert('🔒 Logged out')}>
            <FaSignOutAlt className="me-1" /> Logout
          </button>
          <button className="btn btn-outline-dark" onClick={() => navigate('/settings')}>
            <FaUserCog className="me-1" /> Settings
          </button>
        </div>
      </div>
    </nav>
  );
}
