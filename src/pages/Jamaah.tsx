import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  Trash2, 
  Calendar, 
  MapPin, 
  User,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Jamaah() {
  const { isAdmin } = useAuth();
  const [jamaahList, setJamaahList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [form, setForm] = useState({
    full_name: '',
    group_name: '',
    birth_info: '',
    registration_year: new Date().getFullYear(),
    registration_location: '',
    portion_number: '',
    package_type: 'haji_reguler'
  });

  useEffect(() => {
    fetchJamaah();
  }, []);

  async function fetchJamaah() {
    setLoading(true);
    const { data, error } = await supabase
      .from('jamaah')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setJamaahList(data || []);
    setLoading(false);
  }

  async function handleAddJamaah(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from('jamaah').insert([form]);
    if (error) {
      alert(error.message);
    } else {
      setShowAddForm(false);
      setForm({
        full_name: '', group_name: '', birth_info: '',
        registration_year: new Date().getFullYear(),
        registration_location: '', portion_number: '',
        package_type: 'haji_reguler'
      });
      fetchJamaah();
    }
  }

  async function handleDelete(id: string) {
    if (window.confirm('Hapus data jamaah ini?')) {
      await supabase.from('jamaah').delete().eq('id', id);
      fetchJamaah();
    }
  }

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl text-center space-y-4">
        <Users size={64} className="text-gray-300 mx-auto" />
        <h2 className="text-xl font-black text-primary-dark">Akses Khusus Admin</h2>
        <p className="text-sm text-gray-500">Halaman ini hanya dapat diakses oleh administrator Fav Tour.</p>
      </div>
    );
  }

  const filteredList = jamaahList.filter(j => 
    j.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.portion_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <header className="px-2 flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-black text-primary-dark">Database Jamaah 👥</h2>
            <p className="text-gray-400 text-sm font-medium">Kelola data manifes jamaah.</p>
         </div>
         <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all"
         >
           {showAddForm ? <ArrowLeft size={24} /> : <UserPlus size={24} />}
         </button>
      </header>

      <AnimatePresence>
        {showAddForm && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 overflow-hidden"
          >
            <h3 className="text-xl font-black text-primary-dark">Tambah Calon Jamaah</h3>
            <form onSubmit={handleAddJamaah} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Lengkap</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Kelompok</label>
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none" value={form.group_name} onChange={e => setForm({...form, group_name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">No. Porsi</label>
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none" value={form.portion_number} onChange={e => setForm({...form, portion_number: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">TTL</label>
                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-none" value={form.birth_info} onChange={e => setForm({...form, birth_info: e.target.value})} />
              </div>
              <button type="submit" className="btn-spiritual w-full py-5 rounded-[24px]">Simpan Data Jamaah</button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau nomor porsi..." 
          className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm font-medium outline-none focus:border-primary transition-all"
          value={searchTerm}
          onChange={e => setSearchSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse">Menghubungkan ke pusat data...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-center py-20 text-gray-300 font-bold uppercase tracking-widest text-xs">Data tidak ditemukan</p>
        ) : (
          filteredList.map((j, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={j.id} 
              className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm space-y-4 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-black text-primary-dark">{j.full_name}</h4>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Porsi: {j.portion_number || 'BELUM ADA'}</p>
                </div>
                <button className="text-red-300 hover:text-red-500 p-2 rounded-xl active:bg-red-50 transition-all" onClick={() => handleDelete(j.id)}>
                   <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 bg-cream/30 p-4 rounded-2xl border border-primary/5">
                <div className="flex items-center gap-2">
                   <Users size={14} className="text-primary/40" />
                   <p className="text-[10px] font-bold text-gray-600 truncate">{j.group_name || '-'}</p>
                </div>
                <div className="flex items-center gap-2">
                   <Calendar size={14} className="text-primary/40" />
                   <p className="text-[10px] font-bold text-gray-600">{j.registration_year}</p>
                </div>
                <div className="flex items-center gap-2 col-span-2 border-t border-white/50 pt-2 mt-1">
                   <MapPin size={14} className="text-primary/40" />
                   <p className="text-[10px] font-bold text-gray-600 truncate">{j.registration_location || j.birth_info || '-'}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
