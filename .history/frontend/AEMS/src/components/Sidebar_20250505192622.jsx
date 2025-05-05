import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-blue-900 text-white w-60 h-screen fixed p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-6">AEMS</h1>
      <NavLink to="/" className="hover:text-blue-300">Dashboard</NavLink>
      <NavLink to="/events" className="hover:text-blue-300">Events</NavLink>
      <NavLink to="/recalls" className="hover:text-blue-300">Recalls</NavLink>
      <NavLink to="/settings" className="hover:text-blue-300">Settings</NavLink>
    </div>
  );
}
