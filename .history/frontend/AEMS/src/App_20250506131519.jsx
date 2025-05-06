import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';

function LayoutWithSidebar({ children }) {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 bg-light p-4 overflow-auto">
        {children}
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
        <Route path="/recalls" element={<div>Recalls Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        <Route path="/tracked" element={<div>Tracked Devices Page</div>} />
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
