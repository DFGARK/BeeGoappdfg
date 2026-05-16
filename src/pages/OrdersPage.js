import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { getStudentOrders } from '../lib/supabase';
import { LoadingState, EmptyState, StatusBadge, OrderProgress } from '../components/UI';

export default function OrdersPage({ onNavigate }) {
  const { student } = useApp();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!student) return;
    getStudentOrders(student.id).then(({ data }) => { setOrders(data); setLoading(false); });
  }, [student]);

  if (loading) return <LoadingState text="Loading orders…" />;

  // Order detail view
  if (selected) {
    const order = orders.find(o => o.id === selected);
    if (!order) { setSelected(null); return null; }
    return (
      <div style={{ padding: '20px 20px 100px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--gray-500)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to orders
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Order</p>
            <h2 style={{ fontSize: 22 }}>#{order.orden_numero}</h2>
          </div>
          <StatusBadge status={order.estado} />
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Order status</h3>
          <OrderProgress status={order.estado} />
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, marginBottom: 12 }}>Items ordered</h3>
          {(order.orden_detalles || []).map(detail => (
            <div key={detail.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #EBEBEB' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{detail.nombre_producto}</p>
                <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>x{detail.cantidad}</p>
              </div>
              <p style={{ fontWeight: 700, color: 'var(--dark)' }}>Q{detail.subtotal.toFixed(2)}</p>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <p style={{ fontWeight: 800 }}>Total</p>
            <p style={{ fontWeight: 800, fontSize: 18, color: 'var(--honey-dark)' }}>Q{order.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="card">
          {[
            ['Student', order.nombre_estudiante],
            ['Grade', `${order.grado} – ${order.seccion}`],
            ['Pickup', order.pickup_time],
            ['Placed at', new Date(order.creado_en).toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #EBEBEB' }}>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Orders list
  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <h2 style={{ marginBottom: 20 }}>My Orders</h2>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          subtitle="Place your first order from the menu"
          action={<button className="btn btn-dark" onClick={() => onNavigate('menu')}>Browse Menu</button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelected(order.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{new Date(order.creado_en).toLocaleDateString()}</p>
                  <p style={{ fontWeight: 800, fontSize: 18 }}>#{order.orden_numero}</p>
                </div>
                <StatusBadge status={order.estado} />
              </div>
              <OrderProgress status={order.estado} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                  {(order.orden_detalles || []).length} item(s) · {order.pickup_time}
                </p>
                <p style={{ fontWeight: 800, color: 'var(--honey-dark)' }}>Q{order.total.toFixed(2)}</p>
              </div>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 8, textAlign: 'right' }}>
                Tap to view details →
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
