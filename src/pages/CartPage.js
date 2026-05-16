import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { createOrder } from '../lib/supabase';
import { EmptyState, CATEGORY_ICON } from '../components/UI';

const PICKUP_TIMES = ['10:20 AM', '1:40 PM'];

export default function CartPage({ onNavigate }) {
  const { student, cart, changeQty, removeFromCart, clearCart, cartTotal, toast } = useApp();
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handlePlaceOrder = async () => {
    if (!pickupTime) { setError('Please select a pickup time.'); return; }
    if (cart.length === 0) return;
    setLoading(true); setError('');
    const orderData = {
      estudiante_id:     student.id,
      nombre_estudiante: student.nombre,
      grado:             student.grado,
      seccion:           student.seccion,
      total:             cartTotal,
      pickup_time:       pickupTime,
      estado:            'pending',
    };
    const { error: err } = await createOrder(orderData, cart);
    setLoading(false);
    if (err) { setError('Could not place order. Please try again.'); return; }
    clearCart(); setPickupTime('');
    toast('Your order was placed successfully!');
    onNavigate('orders');
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '20px 20px 100px' }}>
        <h2 style={{ marginBottom: 20 }}>Cart</h2>
        <EmptyState
          title="Your cart is empty"
          subtitle="Add items from the menu to get started"
          action={<button className="btn btn-dark" onClick={() => onNavigate('menu')}>Browse Menu</button>}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <h2 style={{ marginBottom: 20 }}>Cart</h2>

      {/* Cart items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {cart.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', flexShrink: 0 }}>
              {CATEGORY_ICON[item.categoria] || (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="10" cy="10" r="7"/></svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--dark)' }}>{item.nombre}</p>
              <p style={{ fontSize: 13, color: 'var(--honey-dark)', fontWeight: 700 }}>Q{(item.precio * item.qty).toFixed(2)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button onClick={() => changeQty(item.id, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--gray-300)', background: 'var(--white)', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-700)' }}>−</button>
              <span style={{ fontWeight: 800, fontSize: 15, minWidth: 18, textAlign: 'center' }}>{item.qty}</span>
              <button onClick={() => changeQty(item.id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'var(--honey)', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--black)' }}>+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--gray-400)', padding: 4 }}>✕</button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div style={{ background: 'var(--black)', borderRadius: 'var(--radius)', padding: '16px 18px', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Total</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--honey)' }}>Q{cartTotal.toFixed(2)}</p>
      </div>

      <div className="divider" />

      {/* Pickup time */}
      <div className="form-group">
        <label className="form-label">Pickup Time</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PICKUP_TIMES.map(time => (
            <button key={time} onClick={() => { setPickupTime(time); setError(''); }} className="btn"
              style={{ padding: '14px', borderRadius: 'var(--radius)', border: `2px solid ${pickupTime === time ? 'var(--honey)' : 'var(--gray-200)'}`, background: pickupTime === time ? 'rgba(245,168,0,0.1)' : 'var(--white)', color: 'var(--dark)', fontWeight: 700, fontSize: 15 }}>
              {time}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

      <button className="btn btn-primary btn-full" style={{ fontSize: 16, padding: 16, marginTop: 8 }} onClick={handlePlaceOrder} disabled={loading}>
        {loading ? 'Placing order…' : 'Place Order'}
      </button>

      <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 12 }}>
        Order for {student?.nombre} · Grade {student?.grado}-{student?.seccion}
      </p>
    </div>
  );
}
