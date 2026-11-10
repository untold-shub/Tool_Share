import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Compass, Wrench, ArrowDownUp, Inbox, User, LogOut, Plus, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/explore', label: 'Explore Tools', icon: Compass },
  { to: '/my-listings', label: 'My Listings', icon: Wrench },
  { to: '/borrowing', label: 'My Borrowing Requests', icon: ArrowDownUp },
  { to: '/lender', label: 'Lender Requests', icon: Inbox },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ onLogout }) {
  const { currentUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <>
      <div className="sidebar-brand">
        <Wrench size={22} className="brand-icon" />
        <span>ToolShare</span>
      </div>
      <Link to="/list-tool" className="btn btn-primary btn-block" onClick={() => setMobileOpen(false)}>
        <Plus size={18} /> List a Tool
      </Link>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <button className="nav-link nav-logout" onClick={onLogout}>
          <LogOut size={18} /> Logout
        </button>
      </nav>
      {currentUser && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="sidebar-user-name">{currentUser.name}</p>
            <p className="sidebar-user-email">{currentUser.email}</p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <aside className="sidebar">{content}</aside>
      <button className="mobile-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {mobileOpen && <div className="sidebar-mobile">{content}</div>}
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
