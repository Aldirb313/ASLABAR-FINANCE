import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-height-screen flex flex-col md:flex-row">
      {/* LEFT PANEL - BRANDING */}
      <div className="md:w-5/12 bg-primary-dark relative overflow-hidden flex flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative z-10 text-center">
          <img src="/logo.png" alt="Fav Umroh" className="h-32 w-auto mb-8 mx-auto drop-shadow-2xl" />
          <h1 className="text-4xl font-bold mb-4 font-sans">Bismillah,</h1>
          <p className="text-xl text-cream/80 italic font-serif">"Umroh adalah tamu Allah, dan Allah memuliakan hamba-Nya yang datang bertamu."</p>
        </div>
        
        <div className="mt-12 relative z-10">
          <div className="px-6 py-2 bg-secondary/20 rounded-full border border-secondary/30 text-secondary text-sm font-bold">
            Teman Setia Perjalanan Umrohmu
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="md:w-7/12 bg-cream flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-primary-dark">Selamat Datang</h2>
            <p className="text-gray-500 mt-2">Masuk untuk melanjutkan persiapan ibadahmu.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? 'Memproses...' : (
                <>Mulai Persiapan Sekarang <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500">
              Belum punya akun? {' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Daftar Baru di Sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.');
      navigate('/login');
    }
  };

  return (
    <div className="min-height-screen flex flex-col md:flex-row">
      {/* LEFT PANEL */}
      <div className="md:w-5/12 bg-primary-dark relative overflow-hidden flex flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <img src="/logo.png" alt="Fav Umroh" className="h-32 w-auto mb-8 mx-auto drop-shadow-2xl" />
          <h1 className="text-4xl font-bold mb-4">Daftar Akun</h1>
          <p className="text-xl text-cream/80 italic">Lengkapi data untuk mulai merencanakan perjalanan suci Anda.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="md:w-7/12 bg-cream flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-primary-dark">Buat Akun Baru</h2>
            <p className="text-gray-500 mt-2">Satu akun untuk semua fitur persiapan umroh.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="Nama Lengkap Sesuai KTP"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-[24px] font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? 'Mendaftarkan...' : (
                <>Daftar & Mulai Persiapan <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Sudah punya akun? {' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Masuk Sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
