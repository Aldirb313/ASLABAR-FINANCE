import { FileText, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Pinjaman.css';

export function Pinjaman() {
  const { canAccessLoans } = useAuth();

  if (!canAccessLoans) {
    return (
      <div className="card text-center locked-screen">
        <AlertTriangle size={64} color="var(--danger-color)" className="mb-2" />
        <h2>Akses Terbatas</h2>
        <p className="text-muted mb-3">
          Fitur Simpan-Pinjam hanya dapat diakses oleh anggota yang telah diberikan izin khusus oleh Super Admin.
        </p>
        <button className="btn-primary" onClick={() => window.history.back()}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="pinjaman-page">
      <section className="card promo-card">
        <div className="flex items-center gap-3 mb-2">
          <Calculator size={32} color="var(--primary-color)" />
          <h2>Simulasi Pinjaman</h2>
        </div>
        <p>Hitung cicilan bulanan Anda dengan bunga rendah.</p>
        <button className="btn-secondary mt-2 w-full">Mulai Hitung</button>
      </section>

      <section className="card mt-3">
        <h2>Pinjaman Aktif</h2>
        <div className="empty-state">
          <FileText size={48} className="text-muted mb-1" />
          <p>Anda belum memiliki pinjaman aktif.</p>
          <button className="btn-primary mt-2 flex items-center gap-2 justify-center">
            Ajukan Sekarang <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <section className="card mt-3">
        <h2>Syarat & Ketentuan</h2>
        <ul className="terms-list mt-1">
          <li>Anggota aktif minimal 6 bulan.</li>
          <li>Melampirkan KTP & Slip Gaji.</li>
          <li>Persetujuan dalam 1x24 jam.</li>
        </ul>
      </section>
    </div>
  );
}
