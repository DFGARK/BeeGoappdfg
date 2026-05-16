import React from 'react';
import { useApp } from '../lib/AppContext';

// SVG icons — no emojis
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L11 3l8 7.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-8.5z"/>
    <path d="M8 20v-7h6v7"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="12" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="12" width="7" height="7" rx="1.5"/>
    <rect x="12" y="12" width="7" height="7" rx="1.5"/>
  </svg>
);
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h2.5l3 11h9l3-8H6"/>
    <circle cx="9.5" cy="18.5" r="1.5"/>
    <circle cx="16.5" cy="18.5" r="1.5"/>
  </svg>
);
const OrdersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="14" height="18" rx="2"/>
    <line x1="8" y1="8" x2="14" y2="8"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
    <line x1="8" y1="14" x2="12" y2="14"/>
  </svg>
);

const NAV_ITEMS = [
  { key: 'home',   Icon: HomeIcon,   label: 'Home'   },
  { key: 'menu',   Icon: MenuIcon,   label: 'Menu'   },
  { key: 'cart',   Icon: CartIcon,   label: 'Cart'   },
  { key: 'orders', Icon: OrdersIcon, label: 'Orders' },
];

export default function BottomNav({ active, onChange }) {
  const { cartCount } = useApp();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: 'var(--white)', borderTop: '1.5px solid #EBEBEB',
      display: 'flex', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {NAV_ITEMS.map(({ key, Icon, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              flex: 1, border: 'none', background: 'none', cursor: 'pointer',
              padding: '10px 0 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              position: 'relative', transition: 'all 0.15s ease',
              color: isActive ? 'var(--honey-dark)' : 'var(--gray-400)',
            }}
          >
            {key === 'cart' && cartCount > 0 && (
              <div style={{
                position: 'absolute', top: 6, left: '50%', marginLeft: 4,
                background: 'var(--honey)', color: 'var(--black)',
                fontSize: 9, fontWeight: 900, width: 16, height: 16,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </div>
            )}
            <span style={{ transition: 'transform 0.15s ease', transform: isActive ? 'translateY(-2px)' : 'none' }}>
              <Icon />
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: 20, height: 3, background: 'var(--honey)', borderRadius: '0 0 4px 4px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
