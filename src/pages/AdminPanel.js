import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import AdminOrdersPage from './AdminOrdersPage';
import AdminProductsPage from './AdminProductsPage';

const TABS = [
  { key: 'orders',   label: 'Orders'  },
  { key: 'products', label: 'Menu'    },
];

export default function AdminPanel() {
  const { admin, logoutAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <header style={{ background: 'var(--black)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Bee Go Admin</p>
          <h2 style={{ color: 'var(--white)', fontSize: 18, fontWeight: 800 }}>{admin?.nombre}</h2>
        </div>
        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }} onClick={logoutAdmin}>
          Sign out
        </button>
      </header>

      <div style={{ display: 'flex', borderBottom: '1.5px solid #EBEBEB', background: 'var(--white)', position: 'sticky', top: 56, zIndex: 99 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ flex: 1, padding: '14px 8px', border: 'none', borderBottom: `3px solid ${activeTab === tab.key ? 'var(--honey)' : 'transparent'}`, background: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: activeTab === tab.key ? 800 : 600, color: activeTab === tab.key ? 'var(--black)' : 'var(--gray-500)', transition: 'all 0.15s ease' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'orders'   && <AdminOrdersPage />}
        {activeTab === 'products' && <AdminProductsPage />}
      </div>
    </div>
  );
}
