import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Wallet, PlusCircle, ArrowUpRight, History } from 'lucide-react';

export function Tabungan() {
  const { profile } = useAuth();
  const [savings, setSavings] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [targetType, setTargetType] = useState('haji_reguler');
  const [targetAmount, setTargetAmount] = useState('35000000');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchSavings();
    fetchTransactions();
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

  async function fetchTransactions() {
    if (!profile) return;
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    setTransactions(data || []);
  }

  const formatRupiah = (amount: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount) + ',-';
  };

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

    if (error) alert(error.message);
    else fetchSavings();
    setProcessing(false);
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setProcessing(true);

    const depositAmount = parseFloat(amount);
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

    const { error: saveError } = await supabase
      .from('savings')
      .update({ current_amount: (savings?.current_amount || 0) + depositAmount })
      .eq('id', savings?.id);

    if (saveError) alert(saveError.message);
    else {
      alert('Setoran berhasil disimpan!');
      setAmount('');
      fetchSavings();
      fetchTransactions();
    }
    setProcessing(false);
  }

  if (loading) return <div className="text-center py-20 text-primary font-bold animate-pulse">Memuat Data Tabungan...</div>;

  return (
    <div className="space-y-6">
      <header className="px-2 pt-2">
         <h2 className="text-2xl font-black text-primary-dark">Tabungan Umroh 💰</h2>
         <p className="text-gray-400 text-sm font-medium">Kumpulkan bekal menuju Baitullah.</p>
      </header>

      {!savings ? (
        <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <PlusCircle size={32} className="text-primary" />
            <h3 className="text-xl font-black text-primary-dark">Buat Target Baru</h3>
          </div>
          <form onSubmit={handleCreateTarget} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jenis Ibadah</label>
              <select 
                value={targetType} 
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none"
              >
                <option value="haji_reguler">Haji Reguler</option>
                <option value="haji_khusus">Haji Khusus</option>
                <option value="umroh">Umroh</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Target Dana</label>
              <input 
                type="number" 
                value={targetAmount} 
                onChange={(e) => setTargetAmount(e.target.value)} 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none"
                placeholder="Contoh: 35000000"
              />
            </div>
            <button type="submit" className="btn-spiritual w-full py-5 rounded-[24px]" disabled={processing}>
              {processing ? 'Menyimpan...' : 'Mulai Menabung'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <div className="bg-primary-dark rounded-[40px] p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={100} /></div>
             <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                   <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Saldo Saat Ini</p>
                   <h2 className="text-4xl font-black">{formatRupiah(savings.current_amount)}</h2>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-secondary uppercase">Progress {Math.round((savings.current_amount / savings.target_amount) * 100)}%</span>
                      <span className="opacity-50">Target: {formatRupiah(savings.target_amount)}</span>
                   </div>
                   <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full" style={{ width: `${Math.min((savings.current_amount / savings.target_amount) * 100, 100)}%` }} />
                   </div>
                </div>
             </div>
          </div>

          <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <ArrowUpRight size={28} className="text-primary" />
              <h3 className="text-xl font-black text-primary-dark">Tambah Setoran</h3>
            </div>
            <form onSubmit={handleDeposit} className="space-y-6">
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="w-full p-6 bg-gray-50 border-none rounded-3xl font-black text-3xl text-primary text-center outline-none focus:ring-4 focus:ring-primary/5"
                placeholder="Rp 0,-"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                {[100000, 500000, 1000000].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    className="py-3 bg-cream rounded-xl font-bold text-[10px] text-primary-dark border border-primary/10 active:scale-95 transition-all"
                    onClick={() => setAmount(val.toString())}
                  >
                    + {val / 1000}rb
                  </button>
                ))}
              </div>
              <button type="submit" className="btn-spiritual w-full py-5 rounded-[24px]" disabled={processing}>
                {processing ? 'Memproses...' : 'Konfirmasi Setoran'}
              </button>
            </form>
          </section>

          <section className="space-y-4 pb-10">
             <div className="flex items-center gap-2 px-2 text-primary-dark">
                <History size={18} />
                <h3 className="font-black uppercase text-xs tracking-widest">Riwayat Setoran</h3>
             </div>
             <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center py-10 text-gray-400 text-sm">Belum ada riwayat setoran.</p>
                ) : transactions.map(tx => (
                  <div key={tx.id} className="bg-white p-5 rounded-[28px] border border-gray-50 flex justify-between items-center shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                           <ArrowUpRight size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-700 text-sm">Setoran Rutin</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                     </div>
                     <span className="font-black text-primary text-sm">+{formatRupiah(tx.amount)}</span>
                  </div>
                ))}
             </div>
          </section>
        </>
      )}
    </div>
  );
}
