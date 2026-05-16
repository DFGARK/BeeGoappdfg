// src/pages/StudentApp.js
// Main student app shell with navigation

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import BottomNav from '../components/BottomNav';
import HomePage   from './HomePage';
import MenuPage   from './MenuPage';
import CartPage   from './CartPage';
import OrdersPage from './OrdersPage';

export default function StudentApp() {
  const { student, logoutStudent } = useApp();
  const [screen, setScreen] = useState('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home':   return <HomePage   onNavigate={setScreen} />;
      case 'menu':   return <MenuPage   onNavigate={setScreen} />;
      case 'cart':   return <CartPage   onNavigate={setScreen} />;
      case 'orders': return <OrdersPage onNavigate={setScreen} />;
      default:       return <HomePage   onNavigate={setScreen} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Top bar */}
      <div style={{
        background: 'var(--white)',
        borderBottom: '1.5px solid #EBEBEB',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>🐝</span>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.5px' }}>
            Bee<span style={{ color: 'var(--honey)' }}>Go</span>
          </span>
        </div>
        <button
          onClick={logoutStudent}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--gray-400)', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </div>

      {/* Screen content */}
      <main style={{ minHeight: 'calc(100vh - 56px)' }}>
        {renderScreen()}
      </main>

      <BottomNav active={screen} onChange={setScreen} />
    </div>
  );
}
