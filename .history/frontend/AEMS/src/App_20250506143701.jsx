import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar'; // ✅ Import the new Navbar
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Recalls from './pages/Recalls';
import Settings from './pages/Settings';
import TrackedDevices from './pages/TrackedDevices';

function LayoutWithSidebar({ children }) {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-light d-flex flex-column">
        <Navbar /> {/* ✅ Add the top navbar */}
        <div className="flex-grow-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  return hideSidebar ? (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  ) : (
    <LayoutWithSidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/recalls" element={<Recalls />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tracked" element={<TrackedDevices />} />
      </Routes>
    </LayoutWithSidebar>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

