import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canAccessLoans, loading } = useAuth();

  const navItems = [
    { label: 'Beranda', path: '/', icon: <Home size={28} />, visible: true },
    { label: 'Tabungan', path: '/tabungan', icon: <Wallet size={28} />, visible: true },
    { 
      label: 'Pinjaman', 
      path: '/pinjaman', 
      icon: canAccessLoans ? <FileText size={28} /> : <Lock size={28} />, 
      visible: true // Always visible but can show lock icon or different state
    },
    { label: 'Profil', path: '/profil', icon: <User size={28} />, visible: true },
  ];

  if (loading) return <div className="loading-screen">Memuat...</div>;

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
            className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${item.path === '/pinjaman' && !canAccessLoans ? 'locked' : ''}`}
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
