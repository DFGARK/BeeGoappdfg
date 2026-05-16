import React from 'react';
import { useApp } from '../lib/AppContext';

export function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function LoadingState({ text = 'Loading…' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="empty-state">
      {title    && <h3>{title}</h3>}
      {subtitle && <p>{subtitle}</p>}
      {action   && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

const STATUS_LABELS = {
  pending:   'Pending',
  preparing: 'Preparing',
  ready:     'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

const STEPS = ['pending', 'preparing', 'ready', 'completed'];
const STEP_LABELS = ['Ordered', 'Preparing', 'Ready', 'Done'];

export function OrderProgress({ status }) {
  if (status === 'cancelled') {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--error)', fontWeight: 700, fontSize: 14 }}>
        Order cancelled
      </div>
    );
  }
  const currentStep = STEPS.indexOf(status);
  return (
    <div style={{ margin: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div style={{ flex: 'none' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i <= currentStep ? 'var(--honey)' : 'var(--gray-100)',
                border: `2px solid ${i <= currentStep ? 'var(--honey-dark)' : 'var(--gray-300)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: i <= currentStep ? 'var(--black)' : 'var(--gray-400)',
                transition: 'all 0.3s ease',
              }}>
                {i < currentStep ? '✓' : i + 1}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 3, background: i < currentStep ? 'var(--honey)' : 'var(--gray-200)', transition: 'background 0.4s ease' }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} style={{ fontSize: 10, fontWeight: i <= currentStep ? 700 : 500, color: i <= currentStep ? 'var(--honey-dark)' : 'var(--gray-400)', textAlign: 'center', width: 28, lineHeight: 1.2 }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-16">
      <h2 style={{ fontSize: 18 }}>{children}</h2>
      {action}
    </div>
  );
}

// Category icons — SVG, no emojis
export const CATEGORY_ICON = {
  drinks: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h10l-1.5 10a2 2 0 01-2 1.8H9.5A2 2 0 017.5 13L6 3z"/>
      <line x1="4" y1="3" x2="18" y2="3"/>
      <path d="M15 7h2a2 2 0 010 4h-2"/>
    </svg>
  ),
  snacks: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="16" height="11" rx="2"/>
      <path d="M8 7V5a1 1 0 011-1h4a1 1 0 011 1v2"/>
      <line x1="3" y1="11" x2="19" y2="11"/>
    </svg>
  ),
  meals: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11c0-3.9 3.1-7 7-7s7 3.1 7 7"/>
      <line x1="4" y1="11" x2="18" y2="11"/>
      <line x1="11" y1="11" x2="11" y2="18"/>
      <line x1="7" y1="18" x2="15" y2="18"/>
    </svg>
  ),
  desserts: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      <rect x="4" y="12" width="14" height="3" rx="1"/>
      <line x1="11" y1="6" x2="11" y2="4"/>
      <path d="M9 4c0-1.1 4-1.1 4 0"/>
    </svg>
  ),
};

export const CATEGORY_LABELS = {
  drinks:   'Drinks',
  snacks:   'Snacks',
  meals:    'Meals',
  desserts: 'Desserts',
};
