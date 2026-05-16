import React from 'react';
import { useApp } from '../lib/AppContext';

const CAFE_OPEN = true;

export default function HomePage({ onNavigate }) {
  const { student } = useApp();
  const firstName = student?.nombre?.split(' ')[0] || 'Student';

  return (
    <div style={{ padding: '24px 20px 100px' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 2 }}>Good morning,</p>
        <h1 style={{ fontSize: 28, letterSpacing: '-0.5px' }}>
          Hi, {firstName} 👋
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span className={`badge badge-${CAFE_OPEN ? 'open' : 'closed'}`}>
            <span style={{ width: 6, height: 6, background: CAFE_OPEN ? 'var(--success)' : 'var(--error)', borderRadius: '50%', display: 'inline-block' }} />
            {CAFE_OPEN ? 'Open now' : 'Closed'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Cafeteria</span>
        </div>
      </div>

      {/* Order Now button */}
      <button
        className="btn btn-primary btn-full"
        style={{ fontSize: 17, padding: '16px', marginBottom: 20, borderRadius: 'var(--radius)' }}
        onClick={() => onNavigate('menu')}
      >
        Order Now
      </button>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ marginBottom: 8, color: 'var(--gray-400)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <polyline points="11,7 11,11 14,13"/>
            </svg>
          </div>
          <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pickup Times</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', marginTop: 4 }}>10:20 AM</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>1:40 PM</p>
        </div>

        <div className="card" style={{ padding: 16, background: 'var(--black)', border: 'none' }}>
          <div style={{ marginBottom: 8, color: 'var(--honey)' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11,2 13.5,8.5 20,9 15,14 16.8,20 11,17 5.2,20 7,14 2,9 8.5,8.5"/>
            </svg>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Today's Pick</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', marginTop: 4 }}>Iced Coffee</p>
          <p style={{ fontSize: 13, color: 'var(--honey)' }}>Q18</p>
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, marginBottom: 14, color: 'var(--gray-700)' }}>How it works</h3>
        {[
          { num: '1', text: 'Choose your food from the menu' },
          { num: '2', text: 'Place your order from the cart' },
          { num: '3', text: 'Pick it up at the cafeteria' },
        ].map(step => (
          <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--honey)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
              {step.num}
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>{step.text}</p>
          </div>
        ))}
      </div>

      {/* Student info */}
      <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
        <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Logged in as</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>{student?.nombre}</p>
        <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Grade {student?.grado} – Section {student?.seccion}</p>
      </div>
    </div>
  );
}
