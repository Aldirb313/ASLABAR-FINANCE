import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, Search, UserPlus, Trash2, Calendar, BadgeCheck } from 'lucide-react';
import './Jamaah.css';

export function Jamaah() {
  const { isAdmin } = useAuth();
  const [jamaahList, setJamaahList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    full_name: '',
    nik: '',
    phone: '',
    package_type: 'umroh_reguler',
    address: '',
    estimated_departure_year: new Date().getFullYear() + 1
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
        full_name: '', nik: '', phone: '',
        package_type: 'umroh_reguler', address: '',
        estimated_departure_year: new Date().getFullYear() + 1
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
    j.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.nik.includes(searchTerm)
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
              <label>NIK (16 Digit)</label>
              <input type="text" value={form.nik} onChange={e => setForm({...form, nik: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Paket Ibadah</label>
              <select value={form.package_type} onChange={e => setForm({...form, package_type: e.target.value})}>
                <option value="haji_reguler">Haji Reguler</option>
                <option value="haji_plus">Haji Plus</option>
                <option value="umroh_reguler">Umroh Reguler</option>
                <option value="umroh_eksekutif">Umroh Eksekutif</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estimasi Keberangkatan (Tahun)</label>
              <input type="number" value={form.estimated_departure_year} onChange={e => setForm({...form, estimated_departure_year: parseInt(e.target.value)})} />
            </div>
            <button type="submit" className="btn-primary w-full">Simpan Data Jamaah</button>
          </form>
        </section>
      )}

      <div className="search-box card">
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder="Cari Nama atau NIK..." 
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
                    <h4 className="text-large">{j.full_name}</h4>
                    <p className="text-muted text-sm">NIK: {j.nik}</p>
                  </div>
                  <div className={`status-badge ${j.status}`}>
                    {j.status === 'waiting' ? 'Menunggu' : j.status}
                  </div>
                </div>
                
                <div className="jamaah-details mt-2">
                  <div className="detail-item">
                    <BadgeCheck size={16} />
                    <span>{j.package_type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>Est. {j.estimated_departure_year}</span>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
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
