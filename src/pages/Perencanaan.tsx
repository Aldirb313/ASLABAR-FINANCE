import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Sparkles,
  Plane,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Perencanaan() {
  const [activeTab, setActiveTab] = useState('biaya');
  
  // Calculator State
  const [people, setProfilePeople] = useState(2);
  const [days, setDays] = useState(12);
  const [hotelStar, setHotelStar] = useState(4);

  const calculateTotal = () => {
    const flight = 14000000;
    const visa = 2500000;
    const hotel = hotelStar === 5 ? 1500000 : (hotelStar === 4 ? 800000 : 500000);
    const consumption = 300000;
    
    const perPerson = flight + visa + (hotel * days) + (consumption * days);
    return perPerson * people;
  };

  const formatRupiah = (amount: number) => {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount) + ',-';
  };

  return (
    <div className="space-y-6">
      <header className="px-2">
         <h2 className="text-2xl font-black text-primary-dark">Perencanaan 📋</h2>
         <p className="text-gray-400 text-sm font-medium">Susun strategi umroh mandiri Anda.</p>
      </header>

      {/* TABS */}
      <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
        {['biaya', 'checklist', 'itinerary'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all ${
              activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-400'
            }`}
          >
            {tab === 'biaya' ? 'Kalkulator' : (tab === 'checklist' ? 'Persiapan' : 'Jadwal')}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'biaya' && (
          <motion.div 
            key="biaya"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jumlah Orang</label>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setProfilePeople(Math.max(1, people - 1))} className="h-12 w-12 bg-gray-50 rounded-xl font-black text-xl">-</button>
                       <span className="text-2xl font-black text-primary-dark flex-1 text-center">{people} Orang</span>
                       <button onClick={() => setProfilePeople(people + 1)} className="h-12 w-12 bg-primary/10 text-primary rounded-xl font-black text-xl">+</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Durasi Perjalanan</label>
                    <select 
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value))}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none"
                    >
                      <option value={9}>9 Hari (Makkah Focus)</option>
                      <option value={12}>12 Hari (Balanced)</option>
                      <option value={14}>14 Hari (Lengkap)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Kelas Hotel</label>
                    <div className="flex gap-2">
                       {[3, 4, 5].map(star => (
                         <button 
                          key={star}
                          onClick={() => setHotelStar(star)}
                          className={`flex-1 py-3 rounded-xl font-black border-2 transition-all ${
                            hotelStar === star ? 'border-secondary bg-secondary/5 text-secondary' : 'border-gray-50 text-gray-300'
                          }`}
                         >
                           {star} ⭐
                         </button>
                       ))}
                    </div>
                  </div>
               </div>

               <div className="pt-6 border-t border-dashed border-gray-100 space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-gray-400">Total Estimasi</p>
                    <h2 className="text-3xl font-black text-primary">{formatRupiah(calculateTotal())}</h2>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-2xl flex items-center gap-3">
                     <Sparkles size={20} className="text-secondary" />
                     <p className="text-[10px] font-bold text-secondary-dark leading-tight">
                       Saran: Mulai menabung <strong>{formatRupiah(calculateTotal() / 12)}</strong> per bulan untuk keberangkatan tahun depan.
                     </p>
                  </div>
               </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-3">
                  <Plane className="text-blue-400" size={20} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400">Tiket PP</p>
                    <p className="text-xs font-black">Rp 14jt-an</p>
                  </div>
               </div>
               <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-3">
                  <Building className="text-orange-400" size={20} />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400">Visa & Asuransi</p>
                    <p className="text-xs font-black">Rp 2.5jt-an</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'checklist' && (
          <motion.div 
            key="checklist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
             <div className="bg-primary-dark p-6 rounded-[32px] text-white flex justify-between items-center">
                <div>
                  <h4 className="font-black">Dokumen Wajib</h4>
                  <p className="text-[10px] text-white/50">Jangan sampai tertinggal di rumah.</p>
                </div>
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                   <FileText size={24} className="text-secondary" />
                </div>
             </div>

             {[
               { t: 'Paspor Valid > 6 Bulan', d: 'H-6 Bulan' },
               { t: 'Vaksin Meningitis', d: 'H-1 Bulan' },
               { t: 'Aplikasi Nusuk', d: 'H-1 Minggu' },
               { t: 'Kain Ihram / Mukena', d: 'H-1 Minggu' }
             ].map((item, i) => (
               <div key={i} className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-6 w-6 rounded-lg border-2 border-primary/20" />
                     <div>
                        <p className="font-bold text-gray-700 text-sm">{item.t}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{item.d}</p>
                     </div>
                  </div>
                  <Plus size={20} className="text-gray-200" />
               </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
