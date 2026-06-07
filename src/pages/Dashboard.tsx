import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Heart,
  BookOpen,
  Wallet,
  User,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { profile, canAccessLoans } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingsData, setSavingsData] = useState<any>(null);
  const prepProgress = 65; // Mock for now

  useEffect(() => {
    async function fetchData() {
      if (!profile) return;
      const { data: savings } = await supabase
        .from('savings')
        .select('*')
        .eq('user_id', profile.id)
        .single();
      setSavingsData(savings);
      setLoading(false);
    }
    fetchData();
  }, [profile]);

  const formatRupiah = (amount: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount) + ',-';
  };

  if (loading) return <div className="text-center py-20 text-primary font-medium animate-pulse">Menyiapkan Dashboard Anda...</div>;

  return (
    <div className="space-y-6">
      {/* SPIRITUAL GREETING */}
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-primary font-medium">Assalamu'alaikum,</p>
          <h2 className="text-2xl font-extrabold text-primary-dark">Bpk/Ibu {profile?.full_name?.split(' ')[0]} 🤲</h2>
        </motion.div>
        <div className="bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 flex items-center gap-2">
          <Sparkles size={14} className="text-secondary" />
          <span className="text-[10px] font-bold text-secondary-dark uppercase tracking-tighter">
            {profile?.plan_type === 'premium' ? 'Jamaah Premium' : 'Calon Jamaah'}
          </span>
        </div>
      </div>

      {/* COUNTDOWN & PREP TRACKER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/40 border border-white"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <img src="/logo.png" alt="" className="h-24 w-auto" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Persiapan Perjalanan</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-primary-dark">{prepProgress}%</span>
                <div className="h-8 w-[2px] bg-gray-100" />
                <div>
                  <p className="text-xs font-bold text-gray-500">H-47 Hari lagi</p>
                  <p className="text-[10px] text-gray-400">Menuju Tanah Suci</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/perencanaan')}
              className="bg-cream p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden flex gap-1">
             <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${prepProgress}%` }} />
             <div className="bg-secondary h-full opacity-30" style={{ width: '15%' }} />
          </div>
          
          <div className="flex gap-2">
             <div className="flex-1 bg-primary/5 rounded-2xl p-3 border border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Selanjutnya</p>
                <p className="text-xs font-medium text-gray-700 truncate">Vaksin Meningitis</p>
             </div>
             <div className="flex-1 bg-secondary/5 rounded-2xl p-3 border border-secondary/10">
                <p className="text-[10px] font-bold text-secondary uppercase mb-1">Doa Hari Ini</p>
                <p className="text-xs font-medium text-gray-700 truncate">Doa Naik Kendaraan</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK ACTIONS GRID */}
      <div className="grid grid-cols-2 gap-4">
         <button 
          onClick={() => navigate('/doa')}
          className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col items-center gap-3 group active:scale-95 transition-all"
         >
            <div className="h-14 w-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
               <Heart size={28} />
            </div>
            <span className="font-bold text-sm text-gray-700">Bank Doa</span>
         </button>

         <button 
          onClick={() => navigate('/panduan')}
          className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col items-center gap-3 group active:scale-95 transition-all"
         >
            <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
               <BookOpen size={28} />
            </div>
            <span className="font-bold text-sm text-gray-700">Manasik Digital</span>
         </button>
      </div>

      {/* SAVINGS SYNC CARD */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-primary-dark">Tabungan Umroh</h3>
          <button onClick={() => navigate('/tabungan')} className="text-xs font-bold text-primary flex items-center gap-1">Detail <ArrowRight size={12}/></button>
        </div>

        {!savingsData ? (
          <div className="bg-white p-8 rounded-[32px] text-center border-2 border-dashed border-gray-100 space-y-4">
            <div className="h-16 w-16 bg-cream rounded-full flex items-center justify-center mx-auto">
              <Wallet size={30} className="text-primary/40" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800">Mulai Tabungan Haji Anda</h4>
              <p className="text-xs text-gray-400">Wujudkan impian ke Baitullah dengan rencana matang.</p>
            </div>
            <button onClick={() => navigate('/tabungan')} className="btn-spiritual w-full py-4 text-sm">Buat Target Tabungan</button>
          </div>
        ) : (
          <div className="bg-primary-dark rounded-[32px] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Wallet size={80} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Total Saldo Terkumpul</p>
                <h2 className="text-3xl font-black">{formatRupiah(savingsData.current_amount)}</h2>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-white/60">
                    <span>Progress Tabungan</span>
                    <span>Target: {formatRupiah(savingsData.target_amount)}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-secondary h-full shadow-[0_0_10px_#C9A84C]" 
                      style={{ width: `${Math.min((savingsData.current_amount / savingsData.target_amount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/tabungan')}
                  className="bg-white h-12 w-12 rounded-2xl flex items-center justify-center text-primary-dark active:scale-90 transition-all"
                >
                  <ArrowUpRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* LOANS & ADMIN SHORTCUTS */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/pinjaman')}
          className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm active:scale-95 transition-all"
        >
          <div className="h-10 w-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
             {canAccessLoans ? <Sparkles size={20} /> : <Lock size={20} />}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-700">Layanan SP</p>
            <p className="text-[10px] text-gray-400">{canAccessLoans ? 'Akses Aktif' : 'Terbatas'}</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/profil')}
          className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm active:scale-95 transition-all"
        >
          <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
             <User size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-gray-700">Akun Saya</p>
            <p className="text-[10px] text-gray-400">Kelola Profil</p>
          </div>
        </button>
      </div>

      {/* DAILY TIP */}
      <div className="bg-secondary-light/30 border border-secondary/20 p-4 rounded-3xl flex gap-3 items-center">
        <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-secondary/20">
          <Sparkles size={20} />
        </div>
        <p className="text-xs text-primary-dark font-medium leading-relaxed italic">
          "Barangsiapa melakukan Umroh di bulan Ramadhan, maka ia seperti melakukan Haji bersamaku." (HR. Bukhari)
        </p>
      </div>
    </div>
  );
}
