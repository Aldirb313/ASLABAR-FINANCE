import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminClientManagement() {
  const { isAdmin } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin]);

  async function fetchProfiles() {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    setProfiles(data || []);
    setLoading(false);
  }

  async function toggleLoanAccess(profileId: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_loan_authorized: !currentStatus })
      .eq('id', profileId);
    
    if (error) alert(error.message);
    else fetchProfiles();
  }

  if (!isAdmin) return null;

  const filtered = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-2 px-2 text-primary-dark">
        <ShieldCheck size={20} className="text-secondary" />
        <h3 className="font-black uppercase tracking-tighter">Manajemen Akses Client</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari jamaah..." 
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm font-medium outline-none focus:border-primary transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
        {loading ? (
           <p className="text-center py-10 text-xs font-bold text-gray-300 uppercase tracking-widest animate-pulse">Menilik Data Jamaah...</p>
        ) : filtered.length === 0 ? (
           <p className="text-center py-10 text-gray-400 text-sm">Tidak ada data profil.</p>
        ) : filtered.map((profile, idx) => (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.02 }}
            key={profile.id} 
            className="flex justify-between items-center p-5 hover:bg-gray-50/50 transition-colors"
          >
            <div className="space-y-0.5">
              <p className="font-bold text-gray-800 text-sm leading-none">{profile.full_name || 'Tanpa Nama'}</p>
              <p className="text-[10px] text-gray-400 font-medium">{profile.email}</p>
            </div>
            <button 
              className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-tighter transition-all active:scale-95 ${
                profile.is_loan_authorized 
                ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                : 'bg-primary/5 text-primary border border-primary/10'
              }`}
              onClick={() => toggleLoanAccess(profile.id, profile.is_loan_authorized)}
            >
              {profile.is_loan_authorized ? 'Cabut Izin' : 'Beri Izin'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
