import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { FileText, Calculator, AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export function Pinjaman() {
  const { canAccessLoans } = useAuth();
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canAccessLoans) fetchLoans();
    else setLoading(false);
  }, [canAccessLoans]);

  async function fetchLoans() {
    const { data } = await supabase.from('loans').select('*').order('created_at', { ascending: false });
    setActiveLoans(data || []);
    setLoading(false);
  }

  if (loading) return <div className="text-center py-20 text-primary font-bold animate-pulse">Memverifikasi Akses...</div>;

  if (!canAccessLoans) {
    return (
      <div className="space-y-6">
        <header className="px-2">
           <h2 className="text-2xl font-black text-primary-dark">Layanan Pinjaman 💳</h2>
        </header>
        
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl text-center space-y-6">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
             <AlertTriangle size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-primary-dark">Akses Terbatas</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Fitur Pinjaman Darurat/Tambahan hanya tersedia bagi jamaah yang telah diverifikasi dan diberikan izin khusus oleh Super Admin Fav Tour.
            </p>
          </div>
          <div className="bg-cream/50 p-5 rounded-3xl border border-primary/5 text-left">
             <p className="text-[10px] font-black text-primary uppercase mb-2">Syarat Pengajuan:</p>
             <ul className="text-[10px] text-gray-600 space-y-1 font-medium">
                <li>• Menjadi jamaah aktif minimal 6 bulan.</li>
                <li>• Memiliki saldo tabungan minimal 20% dari target.</li>
                <li>• Melengkapi dokumen KTP & Slip Gaji.</li>
             </ul>
          </div>
          <button className="btn-spiritual w-full py-4 text-sm" onClick={() => window.history.back()}>Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="px-2">
         <h2 className="text-2xl font-black text-primary-dark">Layanan Pinjaman 💳</h2>
         <p className="text-gray-400 text-sm font-medium">Bantuan dana talangan ibadah Anda.</p>
      </header>

      <section className="bg-primary-dark p-8 rounded-[40px] text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10"><Calculator size={100} /></div>
         <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-black">Simulasi Pinjaman</h3>
            <p className="text-sm text-white/60 leading-relaxed">Dapatkan dana tambahan untuk pelunasan biaya umroh dengan margin rendah.</p>
            <button className="bg-secondary text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-secondary/20 active:scale-95 transition-all">Mulai Simulasi <ArrowRight size={14}/></button>
         </div>
      </section>

      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2 text-primary-dark">
            <Clock size={18} />
            <h3 className="font-black">Pinjaman Aktif</h3>
         </div>
         {activeLoans.length === 0 ? (
           <div className="bg-white p-12 rounded-[40px] text-center border border-gray-100 shadow-sm space-y-4">
              <FileText size={40} className="mx-auto text-gray-200" />
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Belum ada pengajuan</p>
           </div>
         ) : (
           <div className="space-y-3">
              {activeLoans.map(loan => (
                <div key={loan.id} className="bg-white p-5 rounded-[28px] border border-gray-50 flex justify-between items-center shadow-sm">
                   <div>
                      <p className="font-bold text-gray-700 text-sm">Rp {new Intl.NumberFormat('id-ID').format(loan.amount)}</p>
                      <p className="text-[10px] font-bold text-primary uppercase">{loan.status}</p>
                   </div>
                   <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                      <ChevronRight size={18} />
                   </div>
                </div>
              ))}
           </div>
         )}
      </section>

      <div className="bg-secondary/10 p-6 rounded-[32px] border border-secondary/20 flex gap-4 items-center">
         <ShieldCheck size={32} className="text-secondary" />
         <p className="text-[10px] font-bold text-secondary-dark leading-relaxed">
            Izin pengajuan Anda telah <strong>AKTIF</strong>. Silakan hubungi admin via WhatsApp untuk konsultasi dokumen fisik.
         </p>
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
