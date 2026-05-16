import React, { useState } from 'react';
import { loginAdmin } from '../lib/supabase';
import { useApp } from '../lib/AppContext';

export default function AdminLoginPage() {
  const { loginAdmin: setAdmin } = useApp();
  const [form, setForm]   = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const { admin, error: err } = await loginAdmin(form.usuario, form.password);
    setLoading(false);
    if (err) { setError(err); return; }
    setAdmin(admin);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 28px', background: 'var(--white)', maxWidth: 430, margin: '0 auto' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🐝</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>
          Bee<span style={{ color: 'var(--honey)' }}>Go</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-400)', marginLeft: 8 }}>Admin</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Cafeteria staff access only</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" name="usuario" placeholder="admin" value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} autoCapitalize="none" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-dark btn-full" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a href="/" style={{ fontSize: 12, color: 'var(--gray-400)', textDecoration: 'none' }}>← Student app</a>
      </div>
    </div>
  );
}
