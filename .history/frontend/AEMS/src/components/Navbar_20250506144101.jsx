import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

export default function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4">
      <div className="container-fluid d-flex justify-content-end">
        <div className="btn-group" role="group" aria-label="Auth Buttons">
          {user ? (
            <>
              <button className="btn btn-outline-dark" onClick={() => navigate('/settings')}>
                <FaUserCog className="me-1" /> Settings
              </button>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-1" /> Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
                <FaSignInAlt className="me-1" /> Login
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate('/register')}>
                <FaUserPlus className="me-1" /> Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
