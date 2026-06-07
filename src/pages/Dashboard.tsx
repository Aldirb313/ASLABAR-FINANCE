import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

export function Dashboard() {
  const { profile, canAccessLoans } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingsData, setSavingsData] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!profile) return;

      // Fetch savings info
      const { data: savings } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      
      setSavingsData(savings);

      // Fetch recent transactions
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setRecentTransactions(txs || []);
      setLoading(false);
    }

    fetchData();
  }, [profile]);

  const formatRupiah = (amount: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(amount) + ',-';
  };

  const progressPercent = savingsData ? Math.min((savingsData.current_amount / savingsData.target_amount) * 100, 100) : 0;

  if (loading) return <div className="text-center mt-3">Mengambil data...</div>;

  return (
    <div className="dashboard">
      <div className="welcome-section mb-2">
        <p className="text-muted">Assalamu'alaikum,</p>
        <h2 className="text-xxl">Bpk/Ibu {profile?.full_name}</h2>
      </div>

      {!savingsData ? (
        <div className="card text-center">
          <h3>Mulai Tabungan Haji Anda</h3>
          <p className="text-muted mb-2">Anda belum memiliki target tabungan.</p>
          <button className="btn-primary" onClick={() => navigate('/tabungan')}>Buat Target Sekarang</button>
        </div>
      ) : (
        <section className="card balance-card">
          <h2>Total Tabungan {savingsData.target_type === 'umroh' ? 'Umroh' : 'Haji'}</h2>
          <div className="balance-amount">{formatRupiah(savingsData.current_amount)}</div>
          
          <div className="progress-container">
            <div className="flex justify-between mb-1">
              <span>Progres: {progressPercent.toFixed(0)}%</span>
              <span>Target: {formatRupiah(savingsData.target_amount)}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </section>
      )}

      <section className="card schedule-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="icon-wrapper">
            <Clock size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h3>Setoran Rutin</h3>
            <p className="text-muted">Setiap bulan</p>
          </div>
        </div>
        <div className="font-bold text-large">
          {formatRupiah(savingsData?.monthly_deposit || 0)}
        </div>
      </section>

      <section className="quick-actions">
        <button className="action-btn primary-action" onClick={() => navigate('/tabungan')}>
          <ArrowUpRight size={32} />
          <span>Setor Tabungan</span>
        </button>
        
        <button 
          className={`action-btn secondary-action ${!canAccessLoans ? 'disabled-action' : ''}`}
          onClick={() => canAccessLoans ? navigate('/pinjaman') : navigate('/pinjaman')}
        >
          {canAccessLoans ? <ArrowDownRight size={32} /> : <Lock size={32} />}
          <span>Pinjaman</span>
        </button>
      </section>

      <section className="card mt-3">
        <div className="flex justify-between items-center mb-2">
          <h2>Riwayat Terakhir</h2>
          <button className="btn-text" onClick={() => navigate('/tabungan')}>Lihat Semua</button>
        </div>
        
        <div className="transaction-list">
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted">Belum ada transaksi.</p>
          ) : (
            recentTransactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-info">
                  <h4>{tx.type === 'deposit' ? 'Setoran Tabungan' : tx.type}</h4>
                  <span className="text-muted">{new Date(tx.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className={`tx-amount ${tx.amount > 0 ? 'tx-plus' : 'tx-minus'}`}>
                  {tx.amount > 0 ? '+' : ''}{formatRupiah(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
