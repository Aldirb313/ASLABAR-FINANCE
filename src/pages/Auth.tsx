import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Phone, Lock, User } from 'lucide-react';
import './Auth.css';

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login Error:', error.message);
      setError(error.message);
      setLoading(false);
    } else {
      console.log('Login Success:', data);
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={48} color="var(--primary-color)" />
          <h1>Selamat Datang</h1>
          <p className="text-muted">Masuk ke akun Aslabar Finance Anda</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <User size={20} />
              <input 
                id="email"
                type="email" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input 
                id="password"
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun?</p>
          <Link to="/register" className="btn-text">Daftar Baru di Sini</Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
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
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Pendaftaran berhasil! Silakan cek email Anda atau langsung masuk.');
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <UserPlus size={48} color="var(--primary-color)" />
          <h1>Daftar Akun</h1>
          <p className="text-muted">Lengkapi data untuk mulai menabung Haji</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName">Nama Lengkap (Sesuai KTP)</label>
            <div className="input-with-icon">
              <User size={20} />
              <input 
                id="fullName"
                type="text" 
                placeholder="Contoh: Haji Ahmad" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Nomor WhatsApp</label>
            <div className="input-with-icon">
              <Phone size={20} />
              <input 
                id="phone"
                type="tel" 
                placeholder="0812xxxx" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email</label>
            <div className="input-with-icon">
              <User size={20} />
              <input 
                id="reg-email"
                type="email" 
                placeholder="nama@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Buat Kata Sandi</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input 
                id="reg-password"
                type="password" 
                placeholder="Minimal 6 karakter" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun?</p>
          <Link to="/login" className="btn-text">Masuk ke Akun</Link>
        </div>
      </div>
    </div>
  );
}
