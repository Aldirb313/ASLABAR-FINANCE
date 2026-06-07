import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Wallet, PlusCircle, CheckCircle } from 'lucide-react';

export function Tabungan() {
  const { profile } = useAuth();
  const [savings, setSavings] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [targetType, setTargetType] = useState('haji_reguler');
  const [targetAmount, setTargetAmount] = useState('35000000');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSavings();
  }, [profile]);

  async function fetchSavings() {
    if (!profile) return;
    const { data } = await supabase
      .from('savings')
      .select('*')
      .eq('user_id', profile.id)
      .single();
    setSavings(data);
    setLoading(false);
  }

  async function handleCreateTarget(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    const { error } = await supabase.from('savings').insert({
      user_id: profile?.id,
      target_type: targetType,
      target_amount: parseFloat(targetAmount),
      monthly_deposit: 500000,
      current_amount: 0
    });

    if (error) {
      alert(error.message);
    } else {
      fetchSavings();
    }
    setProcessing(false);
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);

    const depositAmount = parseFloat(amount);

    // 1. Add transaction
    const { error: txError } = await supabase.from('transactions').insert({
      user_id: profile?.id,
      type: 'deposit',
      amount: depositAmount
    });

    if (txError) {
      alert(txError.message);
      setProcessing(false);
      return;
    }

    // 2. Update savings balance
    const { error: saveError } = await supabase
      .from('savings')
      .update({ current_amount: savings.current_amount + depositAmount })
      .eq('id', savings.id);

    if (saveError) {
      alert(saveError.message);
    } else {
      alert('Setoran berhasil disimpan!');
      setAmount('');
      fetchSavings();
    }
    setProcessing(false);
  }

  const formatRupiah = (amount: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(amount) + ',-';
  };

  if (loading) return <div className="text-center mt-3">Memuat...</div>;

  return (
    <div className="tabungan-page">
      {!savings ? (
        <section className="card">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle size={32} color="var(--primary-color)" />
            <h2>Buat Target Tabungan</h2>
          </div>
          <form onSubmit={handleCreateTarget} className="flex flex-col gap-3">
            <div className="form-group">
              <label>Pilih Jenis Ibadah</label>
              <select 
                value={targetType} 
                onChange={(e) => setTargetType(e.target.value)}
                style={{padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}
              >
                <option value="haji_reguler">Haji Reguler</option>
                <option value="haji_khusus">Haji Khusus</option>
                <option value="umroh">Umroh</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Dana (Rupiah)</label>
              <input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(e.target.value)} 
                placeholder="Contoh: 35000000"
                style={{padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)'}}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Mulai Menabung'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="card">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={32} color="var(--primary-color)" />
              <h2>Setor Tabungan</h2>
            </div>
            <p className="mb-2">Masukkan nominal setoran Anda bulan ini.</p>
            <form onSubmit={handleDeposit} className="flex flex-col gap-3">
              <div className="form-group">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="Nominal (Rp)"
                  style={{padding: '16px', fontSize: '1.5rem', borderRadius: '8px', border: '2px solid var(--primary-color)'}}
                  required
                />
              </div>
              <div className="quick-amounts flex gap-2 overflow-x-auto pb-2">
                {[100000, 500000, 1000000].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    className="btn-secondary" 
                    style={{padding: '8px 16px', fontSize: '1rem', whiteSpace: 'nowrap'}}
                    onClick={() => setAmount(val.toString())}
                  >
                    + Rp {val.toLocaleString()}
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-primary" disabled={processing}>
                {processing ? 'Memproses...' : 'Konfirmasi Setoran'}
              </button>
            </form>
          </section>

          <section className="card mt-3">
            <h2>Ringkasan Target</h2>
            <div className="flex justify-between items-center mt-2 p-2 bg-light rounded">
              <div>
                <p className="text-muted">Target Anda</p>
                <p className="font-bold text-large">{formatRupiah(savings.target_amount)}</p>
              </div>
              <CheckCircle size={32} color="var(--success-color)" />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
