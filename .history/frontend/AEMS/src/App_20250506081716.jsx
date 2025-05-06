import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import TrackedDevices from './pages/TrackedDevices';
function LayoutWithSidebar({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  return (
    hideSidebar ? (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tracked" element={<TrackedDevices />} />
      </Routes>
    ) : (
      <LayoutWithSidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </LayoutWithSidebar>
    )
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
