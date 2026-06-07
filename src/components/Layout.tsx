import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, User, Lock, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canAccessLoans, isAdmin, loading } = useAuth();

  const navItems = [
    { label: 'Beranda', path: '/', icon: <Home size={28} /> },
    { label: 'Tabungan', path: '/tabungan', icon: <Wallet size={28} /> },
    { 
      label: 'Pinjaman', 
      path: '/pinjaman', 
      icon: canAccessLoans ? <FileText size={28} /> : <Lock size={28} />
    },
    { label: 'Jamaah', path: '/jamaah', icon: <Users size={28} />, adminOnly: true },
    { label: 'Profil', path: '/profil', icon: <User size={28} /> },
  ];

  if (loading) return <div className="loading-screen">Memuat...</div>;

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-content">
          <img 
            src="/logo.png" 
            alt="Logo Fav Tour" 
            className="app-logo"
          />
          <h1>Fav Tour Magetan Timur</h1>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
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
