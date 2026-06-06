import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, User } from 'lucide-react';
import './Layout.css';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Beranda', path: '/', icon: <Home size={28} /> },
    { label: 'Tabungan', path: '/tabungan', icon: <Wallet size={28} /> },
    { label: 'Pinjaman', path: '/pinjaman', icon: <FileText size={28} /> },
    { label: 'Profil', path: '/profil', icon: <User size={28} /> },
  ];

  return (
    <div className="container">
      <header className="app-header">
        <h1>Aslabar Finance</h1>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
