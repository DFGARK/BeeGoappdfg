import React, { useState } from 'react';
import { loginStudent } from '../lib/supabase';
import { useApp } from '../lib/AppContext';

export default function LoginPage({ onShowRegister }) {
  const { loginStudent: setStudent } = useApp();
  const [form, setForm]   = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.usuario || !form.password) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    const { user, error: err } = await loginStudent(form.usuario, form.password);
    setLoading(false);
    if (err) { setError(err); return; }
    setStudent(user);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--white)' }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🐝</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 }}>
          Bee<span style={{ color: 'var(--honey)' }}>Go</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 6, fontStyle: 'italic' }}>
          Order fast. Pick up easy.
        </p>
        <p style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 4 }}>
          Beehive International School
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input" name="usuario"
            placeholder="e.g. diego.garcia"
            value={form.usuario} onChange={handleChange}
            autoComplete="username" autoCapitalize="none"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input" name="password" type="password"
            placeholder="••••••••"
            value={form.password} onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-dark btn-full" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </form>

      {/* Create account link */}
      <div style={{ maxWidth: 340, margin: '20px auto 0', width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          Don't have an account?{' '}
          <button
            onClick={onShowRegister}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--honey-dark)', fontWeight: 700, fontSize: 13, textDecoration: 'underline' }}
          >
            Create account
          </button>
        </p>
      </div>

      {/* Admin link */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a href="/admin" style={{ fontSize: 12, color: 'var(--gray-400)', textDecoration: 'none' }}>
          Admin panel →
        </a>
      </div>
    </div>
  );
}
