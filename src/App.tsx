import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pinjaman } from './pages/Pinjaman';
import { Tabungan } from './pages/Tabungan';
import { Jamaah } from './pages/Jamaah';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login, Register } from './pages/Auth';
import { AdminClientManagement } from './components/AdminClientManagement';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuth();
  
  if (loading) return <div className="loading-screen text-center mt-3"><h2>Memuat...</h2></div>;
  if (!profile) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const Profil = () => {
  const { profile, isAdmin } = useAuth();
  return (
    <div className="profil-page">
      <div className="card mt-3">
        <h2>Profil Saya</h2>
        <div className="mt-2 p-2 bg-light rounded">
          <p className="text-muted">Nama Lengkap</p>
          <p className="font-bold text-large">{profile?.full_name}</p>
        </div>
        <div className="mt-1 p-2 bg-light rounded">
          <p className="text-muted">Akses Pinjaman</p>
          <p className="font-bold text-large">{profile?.is_loan_authorized ? 'Aktif' : 'Non-aktif (Butuh Izin Admin)'}</p>
        </div>
        {isAdmin && (
          <div className="mt-1 p-2 bg-light rounded" style={{border: '1px solid var(--primary-color)'}}>
            <p className="text-muted">Peran Akun</p>
            <p className="font-bold text-large" style={{color: 'var(--primary-color)'}}>SUPER ADMIN</p>
          </div>
        )}
        <button 
          className="btn-secondary w-full mt-3" 
          style={{borderColor: 'var(--danger-color)', color: 'var(--danger-color)'}}
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
