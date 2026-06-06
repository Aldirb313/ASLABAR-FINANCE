import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

// Mock empty pages for routing
const Tabungan = () => <div className="card mt-3"><h2>Tabungan</h2><p>Halaman Tabungan Haji & Umroh</p></div>;
const Pinjaman = () => <div className="card mt-3"><h2>Pinjaman</h2><p>Halaman Pengajuan Pinjaman</p></div>;
const Profil = () => <div className="card mt-3"><h2>Profil</h2><p>Halaman Profil & Pengaturan</p></div>;

function App() {
  return (
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
  );
}

export default App;
