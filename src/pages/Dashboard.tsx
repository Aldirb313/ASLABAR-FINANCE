import { ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  // Mock data for MVP UI testing
  const data = {
    saldo: 12500000,
    target: 35000000,
    jadwalSetoran: {
      tanggal: '15 Juli 2026',
      nominal: 500000
    }
  };

  const progressPercent = Math.min((data.saldo / data.target) * 100, 100);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="dashboard">
      {/* Notifikasi Penting */}
      <div className="alert-box">
        <AlertCircle size={24} className="alert-icon" />
        <div>
          <strong>Pengingat:</strong> Setoran bulan ini jatuh tempo dalam 3 hari.
        </div>
      </div>

      {/* Ringkasan Saldo Tabungan */}
      <section className="card balance-card">
        <h2>Total Tabungan Haji</h2>
        <div className="balance-amount">{formatRupiah(data.saldo)}</div>
        
        <div className="progress-container">
          <div className="flex justify-between mb-1">
            <span>Progress: {progressPercent.toFixed(0)}%</span>
            <span>Target: {formatRupiah(data.target)}</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <p className="mt-1 text-muted">
            Sisa yang dibutuhkan: <strong>{formatRupiah(data.target - data.saldo)}</strong>
          </p>
        </div>
      </section>

      {/* Jadwal Setoran Berikutnya */}
      <section className="card schedule-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-wrapper">
            <Clock size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h3>Jadwal Setoran</h3>
            <p className="text-muted">{data.jadwalSetoran.tanggal}</p>
          </div>
        </div>
        <div className="font-bold text-large">
          {formatRupiah(data.jadwalSetoran.nominal)}
        </div>
      </section>

      {/* Tombol Akses Cepat */}
      <section className="quick-actions">
        <button className="action-btn primary-action">
          <ArrowUpRight size={32} />
          <span>Setor Sekarang</span>
        </button>
        
        <button className="action-btn secondary-action">
          <ArrowDownRight size={32} />
          <span>Ajukan Pinjaman</span>
        </button>
      </section>

      {/* Histori Singkat */}
      <section className="card mt-3">
        <div className="flex justify-between items-center mb-2">
          <h2>Transaksi Terakhir</h2>
          <button className="btn-text">Lihat Semua</button>
        </div>
        
        <div className="transaction-list">
          <div className="transaction-item">
            <div className="tx-info">
              <h4>Setoran Haji</h4>
              <span className="text-muted">15 Juni 2026</span>
            </div>
            <div className="tx-amount tx-plus">+{formatRupiah(500000)}</div>
          </div>
          <div className="transaction-item">
            <div className="tx-info">
              <h4>Setoran Haji</h4>
              <span className="text-muted">15 Mei 2026</span>
            </div>
            <div className="tx-amount tx-plus">+{formatRupiah(500000)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
