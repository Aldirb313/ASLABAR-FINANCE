import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pinjaman } from './pages/Pinjaman';
import { AuthProvider } from './context/AuthContext';

// Mock empty pages for routing
const Tabungan = () => <div className="card mt-3"><h2>Tabungan Haji & Umroh</h2><p>Halaman pemantauan setoran rutin Anda.</p></div>;
const Profil = () => <div className="card mt-3"><h2>Profil Saya</h2><p>Pengaturan akun dan informasi pribadi.</p></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tabungan" element={<Tabungan />} />
            <Route path="pinjaman" element={<Pinjaman />} />
            <Route path="profil" element={<Profil />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
