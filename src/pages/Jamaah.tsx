import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, Search, UserPlus, Trash2, Calendar, MapPin, BadgeCheck, Hash, User } from 'lucide-react';
import './Jamaah.css';

export function Jamaah() {
  const { isAdmin } = useAuth();
  const [jamaahList, setJamaahList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State Updated for new requirements
  const [form, setForm] = useState({
    full_name: '',
    group_name: '',
    birth_info: '',
    registration_year: new Date().getFullYear(),
    registration_location: '',
    portion_number: '',
    package_type: 'haji_reguler' // internal default
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
      <div className="card text-center mt-3">
        <Users size={64} className="text-muted mb-2" />
        <h2>Akses Khusus Admin</h2>
        <p>Halaman ini hanya dapat diakses oleh administrator Fav Tour.</p>
      </div>
    );
  }

  const filteredList = jamaahList.filter(j => 
    j.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.portion_number?.includes(searchTerm)
  );

  return (
    <div className="jamaah-page">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl">Database Jamaah</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Batal' : <><UserPlus size={20} /> Tambah</>}
        </button>
      </div>

      {showAddForm && (
        <section className="card add-form-card">
          <h3>Tambah Calon Jamaah</h3>
          <form onSubmit={handleAddJamaah} className="flex flex-col gap-3 mt-2">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Kelompok</label>
              <input type="text" value={form.group_name} onChange={e => setForm({...form, group_name: e.target.value})} placeholder="Contoh: KBIH Fav Tour" />
            </div>
            <div className="form-group">
              <label>Tempat Tanggal Lahir</label>
              <input type="text" value={form.birth_info} onChange={e => setForm({...form, birth_info: e.target.value})} placeholder="Contoh: Magetan, 12-05-1970" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Tahun Daftar Haji</label>
                <input type="number" value={form.registration_year} onChange={e => setForm({...form, registration_year: parseInt(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>Nomor Porsi Haji</label>
                <input type="text" value={form.portion_number} onChange={e => setForm({...form, portion_number: e.target.value})} placeholder="10 Digit" />
              </div>
            </div>
            <div className="form-group">
              <label>Lokasi Daftar Haji</label>
              <input type="text" value={form.registration_location} onChange={e => setForm({...form, registration_location: e.target.value})} placeholder="Kemenag Kab. Magetan" />
            </div>
            <button type="submit" className="btn-primary w-full">Simpan Data Jamaah</button>
          </form>
        </section>
      )}

      <div className="search-box card">
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder="Cari Nama atau Nomor Porsi..." 
          value={searchTerm}
          onChange={e => setSearchSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center p-3">Memuat data...</div>
      ) : (
        <div className="jamaah-list">
          {filteredList.length === 0 ? (
            <p className="text-center text-muted">Data tidak ditemukan.</p>
          ) : (
            filteredList.map(j => (
              <div key={j.id} className="card jamaah-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-large" style={{color: 'var(--primary-color)'}}>{j.full_name}</h4>
                    <p className="font-bold text-sm">Kelompok: {j.group_name || '-'}</p>
                  </div>
                  <div className="status-badge waiting">
                    Porsi: {j.portion_number || 'N/A'}
                  </div>
                </div>
                
                <div className="jamaah-info-grid mt-2">
                  <div className="info-item">
                    <User size={14} className="text-muted" />
                    <span>Lahir: {j.birth_info || '-'}</span>
                  </div>
                  <div className="info-item">
                    <Calendar size={14} className="text-muted" />
                    <span>Daftar: {j.registration_year}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={14} className="text-muted" />
                    <span>Lokasi: {j.registration_location || '-'}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-2 pt-2" style={{borderTop: '1px solid var(--border-color)'}}>
                  <button className="btn-icon-danger" onClick={() => handleDelete(j.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
