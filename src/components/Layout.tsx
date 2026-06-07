import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, FileText, User, Lock, Users, BookOpen, Heart, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { canAccessLoans, isAdmin, loading } = useAuth();

  const navItems = [
    { label: 'Beranda', path: '/', icon: <Home size={24} /> },
    { label: 'Doa', path: '/doa', icon: <Heart size={24} /> },
    { label: 'Panduan', path: '/panduan', icon: <BookOpen size={24} /> },
    { label: 'Perencanaan', path: '/perencanaan', icon: <ClipboardList size={24} /> },
    { label: 'Tabungan', path: '/tabungan', icon: <Wallet size={24} /> },
    { 
      label: 'Pinjaman', 
      path: '/pinjaman', 
      icon: canAccessLoans ? <FileText size={24} /> : <Lock size={24} />
    },
    { label: 'Jamaah', path: '/jamaah', icon: <Users size={24} />, adminOnly: true },
    { label: 'Profil', path: '/profil', icon: <User size={24} /> },
  ];

  if (loading) return <div className="loading-screen text-primary font-bold">Memuat Perjalananmu...</div>;

  return (
    <div className="bg-cream min-h-screen">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 bg-primary-dark text-white px-6 py-4 flex items-center justify-between shadow-lg border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Fav Umroh" className="h-10 w-auto brightness-0 invert" />
          <h1 className="font-bold text-lg leading-tight">Fav Tour<br/><span className="text-secondary text-xs uppercase tracking-widest">Magetan Timur</span></h1>
        </div>
        <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
          <User size={20} className="text-secondary" />
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="pb-32 px-4 pt-6 max-w-4xl mx-auto">
        <Outlet />
      </main>

      {/* BOTTOM NAVIGATION - COMPREHENSIVE */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-2 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center overflow-x-auto no-scrollbar">
          {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
            const isActive = location.pathname === item.path;
            const isLocked = item.path === '/pinjaman' && !canAccessLoans;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center min-w-[70px] transition-all duration-300 relative",
                  isActive ? "text-primary scale-110" : "text-gray-400 grayscale opacity-70",
                  isLocked && "opacity-50"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  {item.icon}
                </div>
                <span className={cn(
                  "text-[10px] font-bold mt-1 tracking-tight",
                  isActive ? "opacity-100" : "opacity-0 h-0"
                )}>{item.label}</span>
                {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
