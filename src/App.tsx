import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pinjaman } from './pages/Pinjaman';
import { Tabungan } from './pages/Tabungan';
import { Jamaah } from './pages/Jamaah';
import { BankDoa } from './pages/BankDoa';
import { PanduanUmroh } from './pages/PanduanUmroh';
import { Perencanaan } from './pages/Perencanaan';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login, Register } from './pages/Auth';
import { AdminClientManagement } from './components/AdminClientManagement';
import { ShieldCheck } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();
  
  if (loading) return <div className="loading-screen text-primary font-bold">Memverifikasi Sesi...</div>;
  if (!profile) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const Profil = () => {
  const { profile, isAdmin } = useAuth();
  return (
    <div className="space-y-6">
      <header className="px-2">
         <h2 className="text-2xl font-black text-primary-dark">Akun Saya 👤</h2>
         <p className="text-gray-400 text-sm font-medium">Kelola informasi profil Anda.</p>
      </header>

      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
           <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border-4 border-white shadow-lg">
              <span className="text-3xl font-black">{profile?.full_name?.charAt(0)}</span>
           </div>
           <div>
              <h3 className="text-xl font-black text-primary-dark">{profile?.full_name}</h3>
              <p className="text-sm text-gray-400 font-medium">{profile?.email}</p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div className="bg-cream/50 p-4 rounded-2xl border border-primary/5">
              <p className="text-[10px] font-bold text-primary/60 uppercase">Tipe Akun</p>
              <p className="font-black text-primary uppercase">{profile?.plan_type}</p>
           </div>
           <div className="bg-secondary/10 p-4 rounded-2xl border border-secondary/5">
              <p className="text-[10px] font-bold text-secondary/60 uppercase">Akses Pinjam</p>
              <p className="font-black text-secondary-dark uppercase">{profile?.is_loan_authorized ? 'Aktif' : 'Terbatas'}</p>
           </div>
        </div>

        {isAdmin && (
          <div className="bg-primary-dark p-4 rounded-2xl flex items-center gap-3 text-white">
             <ShieldCheck className="text-secondary" size={24} />
             <div>
                <p className="text-[10px] font-bold opacity-50 uppercase">Peran Sistem</p>
                <p className="font-black uppercase tracking-widest text-secondary">Super Admin</p>
             </div>
          </div>
        )}

        <button 
          className="w-full py-4 border-2 border-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all"
          onClick={() => import('./lib/supabase').then(m => m.supabase.auth.signOut())}
        >
          Keluar Akun
        </button>
      </div>

      {isAdmin && <AdminClientManagement />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="doa" element={<BankDoa />} />
            <Route path="panduan" element={<PanduanUmroh />} />
            <Route path="perencanaan" element={<Perencanaan />} />
            <Route path="tabungan" element={<Tabungan />} />
            <Route path="pinjaman" element={<Pinjaman />} />
            <Route path="jamaah" element={<Jamaah />} />
            <Route path="profil" element={<Profil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
