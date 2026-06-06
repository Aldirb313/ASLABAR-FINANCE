import { ArrowUpRight, ArrowDownRight, Clock, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export function Dashboard() {
  const { canAccessLoans } = useAuth();
  const navigate = useNavigate();

  // Mock data
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
      <div className="alert-box">
        <AlertCircle size={24} className="alert-icon" />
        <div>
          <strong>Informasi:</strong> Pantau terus tabungan Haji & Umroh Anda setiap hari.
        </div>
      </div>

      <section className="card balance-card">
        <h2>Total Tabungan Haji</h2>
        <div className="balance-amount">{formatRupiah(data.saldo)}</div>
        
        <div className="progress-container">
          <div className="flex justify-between mb-1">
            <span>Progres: {progressPercent.toFixed(0)}%</span>
            <span>Target: {formatRupiah(data.target)}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </section>

      <section className="card schedule-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-wrapper">
            <Clock size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h3>Setoran Rutin</h3>
            <p className="text-muted">{data.jadwalSetoran.tanggal}</p>
          </div>
        </div>
        <div className="font-bold text-large">
          {formatRupiah(data.jadwalSetoran.nominal)}
        </div>
      </section>

      <section className="quick-actions">
        <button className="action-btn primary-action" onClick={() => navigate('/tabungan')}>
          <ArrowUpRight size={32} />
          <span>Setor Tabungan</span>
        </button>
        
        <button 
          className={`action-btn secondary-action ${!canAccessLoans ? 'disabled-action' : ''}`}
          onClick={() => canAccessLoans ? navigate('/pinjaman') : null}
        >
          {canAccessLoans ? <ArrowDownRight size={32} /> : <Lock size={32} />}
          <span>Pinjaman</span>
          {!canAccessLoans && <small style={{fontSize: '0.7rem'}}>Butuh Izin Admin</small>}
        </button>
      </section>

      <section className="card mt-3">
        <div className="flex justify-between items-center mb-2">
          <h2>Riwayat Tabungan</h2>
          <button className="btn-text" onClick={() => navigate('/tabungan')}>Lihat Semua</button>
        </div>
        
        <div className="transaction-list">
          <div className="transaction-item">
            <div className="tx-info">
              <h4>Setoran Rutin</h4>
              <span className="text-muted">15 Juni 2026</span>
            </div>
            <div className="tx-amount tx-plus">+{formatRupiah(500000)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
