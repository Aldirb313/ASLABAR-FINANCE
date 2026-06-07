import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Users, ShieldCheck, ShieldAlert, Search } from 'lucide-react';

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
    <div className="admin-clients card mt-3">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={28} color="var(--primary-color)" />
        <h2>Izin Akses Client</h2>
      </div>

      <div className="search-box mb-2" style={{border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px', display: 'flex', gap: '8px'}}>
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder="Cari nama atau email..." 
          style={{border: 'none', outline: 'none', flex: 1}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="client-list flex flex-col gap-2">
        {loading ? <p>Memuat data...</p> : filtered.map(profile => (
          <div key={profile.id} className="flex justify-between items-center p-2" style={{borderBottom: '1px solid var(--border-color)'}}>
            <div>
              <p className="font-bold">{profile.full_name || 'Tanpa Nama'}</p>
              <p className="text-sm text-muted">{profile.email}</p>
            </div>
            <button 
              className={profile.is_loan_authorized ? 'btn-secondary' : 'btn-primary'}
              style={{padding: '8px 12px', fontSize: '0.85rem'}}
              onClick={() => toggleLoanAccess(profile.id, profile.is_loan_authorized)}
            >
              {profile.is_loan_authorized ? 'Cabut Izin' : 'Beri Izin Pinjam'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
