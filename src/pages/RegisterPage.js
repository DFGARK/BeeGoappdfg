import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../lib/AppContext';

const LEVELS = ['BYS', 'HS'];
const GRADES_BY_LEVEL = {
  BYS: ['7', '8', '9', '10', '11', '12'],
  HS:  ['7', '8', '9', '10', '11', '12'],
};
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function RegisterPage({ onBack }) {
  const { loginStudent: setStudent } = useApp();
  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmPassword: '',
    nivel: '', grado: '', seccion: '',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    const { nombre, email, password, confirmPassword, nivel, grado, seccion } = form;

    if (!form.nombre || !form.email || !form.password || !form.confirmPassword || !form.nivel || !form.grado) {
      setError('Please fill in all fields.'); return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true); setError('');

    // Generate username from email prefix
    const usuario = email.split('@')[0].toLowerCase().replace(/[^a-z0-9.]/g, '');

    // Check if username already exists
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('usuario', usuario)
      .maybeSingle();

    if (existing) {
      setError('An account with that email already exists.'); setLoading(false); return;
    }

    const { data, error: err } = await supabase
      .from('students')
      .insert([{ nombre, email, usuario, password_hash: password, nivel, grado, seccion, activo: true }])
      .select()
      .single();

    setLoading(false);

    if (err) { setError('Could not create account. Please try again.'); return; }
    setStudent(data);
  };

  const grades = form.nivel ? GRADES_BY_LEVEL[form.nivel] : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '32px 24px', background: 'var(--white)', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>🐝</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Bee<span style={{ color: 'var(--honey)' }}>Go</span>
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 5 }}>Create your student account</p>
        <p style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 3 }}>Beehive International School</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 340, margin: '0 auto', width: '100%' }}>

        {/* Full name */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="e.g. Diego Ayapan" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">School Email</label>
          <input className="form-input" type="email" placeholder="name@beehive.edu.gt" value={form.email} onChange={e => set('email', e.target.value)} autoCapitalize="none" />
        </div>

        {/* Level */}
        <div className="form-group">
          <label className="form-label">Level</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {LEVELS.map(lvl => (
              <button
                key={lvl} type="button"
                onClick={() => { set('nivel', lvl); set('grado', ''); }}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: `2px solid ${form.nivel === lvl ? 'var(--honey)' : 'var(--gray-300)'}`,
                  background: form.nivel === lvl ? 'rgba(245,168,0,0.08)' : 'var(--white)',
                  color: form.nivel === lvl ? 'var(--honey-dark)' : 'var(--gray-700)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 5 }}>
            xd
          </p>
        </div>

        {/* Grade */}
        {form.nivel && (
          <div className="form-group">
            <label className="form-label">Grade</label>
            <select className="form-select" value={form.grado} onChange={e => set('grado', e.target.value)}>
              <option value="">Select grade</option>
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        )}

        

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
        </div>

        {/* Confirm password */}
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} autoComplete="new-password" />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-dark btn-full" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

     
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--gray-500)', textDecoration: 'underline' }}
        >
          xd
        </button>
      </div>
    </div>
  );
}
