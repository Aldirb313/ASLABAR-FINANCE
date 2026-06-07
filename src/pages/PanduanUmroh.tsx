import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, 
  MapPin, 
  Info, 
  Volume2, 
  CheckCircle2, 
  ArrowLeft,
  Circle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UMROH_STEPS_DETAIL = [
  { id: 1, title: 'Miqat & Niat', icon: '📍', description: 'Memulai ibadah dari titik awal yang ditentukan.' },
  { id: 2, title: 'Tawaf', icon: '🕋', description: "Mengelilingi Ka'bah sebanyak 7 putaran." },
  { id: 3, title: 'Makam Ibrahim', icon: '🕌', description: 'Sholat sunnah 2 rakaat di belakang Makam Ibrahim.' },
  { id: 4, title: 'Multazam & Zamzam', icon: '💧', description: 'Berdoa di Multazam dan meminum air Zamzam.' },
  { id: 5, title: "Sa'i", icon: '🏃', description: 'Berjalan kaki antara bukit Shafa dan Marwa.' },
  { id: 6, title: 'Tahallul', icon: '✂️', description: 'Mencukur atau memotong rambut sebagai penutup.' },
];

export function PanduanUmroh() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <header className="px-2">
         <h2 className="text-2xl font-black text-primary-dark">Manasik Digital 🕋</h2>
         <p className="text-gray-400 text-sm font-medium">Panduan ibadah umroh step-by-step.</p>
      </header>

      {/* PROGRESS TRACKER VISUAL */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative">
         <div className="flex justify-between items-center relative z-10">
            {UMROH_STEPS_DETAIL.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2 relative">
                <button 
                  onClick={() => setActiveStep(step.id)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 ${
                    activeStep === step.id ? 'bg-primary text-white scale-125 shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border border-gray-100'
                  }`}
                >
                  {step.id}
                </button>
                {idx < UMROH_STEPS_DETAIL.length - 1 && (
                  <div className="absolute top-5 left-10 w-full h-[2px] bg-gray-50 -z-0" />
                )}
              </div>
            ))}
         </div>
      </div>

      {/* STEP LIST */}
      <div className="space-y-4">
        <AnimatePresence mode='wait'>
          {activeStep ? (
             <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl"
             >
                <button onClick={() => setActiveStep(null)} className="flex items-center gap-2 text-primary font-bold text-xs mb-6 uppercase tracking-widest">
                  <ArrowLeft size={16} /> Kembali ke Daftar
                </button>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-4xl">{UMROH_STEPS_DETAIL.find(s => s.id === activeStep)?.icon}</div>
                  <div>
                    <h3 className="text-2xl font-black text-primary-dark">{UMROH_STEPS_DETAIL.find(s => s.id === activeStep)?.title}</h3>
                    <p className="text-sm text-gray-400 font-medium">Tahap Ke-{activeStep} dari 6</p>
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="bg-cream/50 p-5 rounded-3xl border border-primary/5">
                      <div className="flex gap-3 mb-2">
                        <Info size={18} className="text-primary mt-1" />
                        <h4 className="font-bold text-primary-dark">Penjelasan</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {UMROH_STEPS_DETAIL.find(s => s.id === activeStep)?.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                   </div>

                   {activeStep === 1 && (
                     <div className="space-y-4">
                        <h4 className="font-bold text-primary-dark flex items-center gap-2 px-1">
                          <MapPin size={18} className="text-secondary" /> Lokasi Miqat
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <p className="font-bold text-xs">Bir Ali</p>
                              <p className="text-[10px] text-gray-400">Rute dari Madinah</p>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <p className="font-bold text-xs">Yalamlam</p>
                              <p className="text-[10px] text-gray-400">Rute via Udara</p>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeStep === 2 && (
                     <div className="text-center space-y-4 py-4">
                        <p className="text-xs font-bold text-gray-400 uppercase">Putaran Tawaf</p>
                        <div className="flex items-center justify-center gap-6">
                           <button className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 font-black text-2xl">-</button>
                           <div className="h-32 w-32 bg-primary/10 rounded-full border-4 border-primary flex items-center justify-center">
                              <span className="text-5xl font-black text-primary">0/7</span>
                           </div>
                           <button className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">+</button>
                        </div>
                     </div>
                   )}

                   <div className="bg-primary-dark p-6 rounded-[32px] text-white">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bacaan Doa</p>
                        <button className="bg-secondary p-2 rounded-xl text-white shadow-lg shadow-secondary/20">
                          <Volume2 size={20} />
                        </button>
                      </div>
                      <p className="arabic-text text-2xl text-center mb-4">لَبَّيْكَ اللَّهُمَّ عُمْرَةً</p>
                      <p className="text-xs text-center text-white/60 italic">"Labbaykallahumma 'umratan"</p>
                   </div>
                </div>

                <button className="btn-spiritual w-full mt-10 py-5 rounded-[24px]">
                  Tandai Selesai <CheckCircle2 size={20} />
                </button>
             </motion.div>
          ) : (
            UMROH_STEPS_DETAIL.map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-cream rounded-2xl flex items-center justify-center text-2xl border border-gray-50 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-dark group-hover:text-primary transition-colors">{step.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ketuk untuk Panduan</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
