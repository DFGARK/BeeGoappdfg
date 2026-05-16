import React, { useState, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus, subscribeToOrders } from '../lib/supabase';
import { useApp } from '../lib/AppContext';
import { LoadingState, EmptyState, StatusBadge } from '../components/UI';

const STATUS_FLOW = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
const STATUS_LABELS = { pending:'Pending', preparing:'Preparing', ready:'Ready', completed:'Completed', cancelled:'Cancelled' };

function Receipt({ order }) {
  return (
    <div id="receipt-print" style={{ fontFamily: 'monospace', padding: 20, maxWidth: 300, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 20, fontWeight: 900 }}>Bee Go</p>
        <p style={{ fontSize: 12 }}>Beehive International School</p>
        <p style={{ fontSize: 11, color: '#666' }}>Cafeteria</p>
        <div style={{ border: '1px dashed #999', margin: '10px 0' }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <p><strong>Order #</strong> {order.orden_numero}</p>
        <p><strong>Student:</strong> {order.nombre_estudiante}</p>
        <p><strong>Grade:</strong> {order.grado} – {order.seccion}</p>
        <p><strong>Date:</strong> {new Date(order.creado_en).toLocaleString()}</p>
        <p><strong>Pickup:</strong> {order.pickup_time}</p>
      </div>
      <div style={{ border: '1px dashed #999', margin: '10px 0' }} />
      <div style={{ marginBottom: 12 }}>
        {(order.orden_detalles || []).map(d => (
          <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
            <span>{d.nombre_producto} x{d.cantidad}</span>
            <span>Q{d.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div style={{ border: '1px dashed #999', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 16 }}>
        <span>TOTAL</span><span>Q{order.total.toFixed(2)}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>
        <p>Status: {STATUS_LABELS[order.estado]}</p>
        <p>Payment: Pending payment</p>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#666' }}>
        <div style={{ border: '1px dashed #999', marginBottom: 10 }} />
        <p>Thank you for using Bee Go</p>
        <p>Order fast. Pick up easy.</p>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusChange }) {
  const [showReceipt, setShowReceipt] = useState(false);

  const handlePrint = () => {
    const receiptEl = document.getElementById('receipt-modal-content');
    const win = window.open('', '_blank', 'width=400,height=600');
    win.document.write(`<html><head><title>Receipt #${order.orden_numero}</title><style>body{font-family:monospace;padding:20px}*{box-sizing:border-box}</style></head><body>${receiptEl?.innerHTML || ''}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>{new Date(order.creado_en).toLocaleString()}</p>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>#{order.orden_numero}</h3>
            <p style={{ fontSize: 14, fontWeight: 600 }}>{order.nombre_estudiante}</p>
            <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Grade {order.grado} – {order.seccion}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusBadge status={order.estado} />
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6 }}>{order.pickup_time}</p>
          </div>
        </div>

        <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 12 }}>
          {(order.orden_detalles || []).map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: 'var(--dark)' }}>{d.nombre_producto} × {d.cantidad}</span>
              <span style={{ fontWeight: 700 }}>Q{d.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #DCDCDC', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>Total</span>
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--honey-dark)' }}>Q{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Change status</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {STATUS_FLOW.map(s => (
              <button key={s} onClick={() => onStatusChange(order.id, s)} className="btn btn-sm"
                style={{ background: order.estado === s ? 'var(--black)' : 'var(--gray-100)', color: order.estado === s ? 'var(--white)' : 'var(--gray-700)', fontWeight: order.estado === s ? 800 : 600 }}
                disabled={order.estado === s}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => setShowReceipt(true)}>
          Print Receipt
        </button>
      </div>

      {showReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setShowReceipt(false)}>
          <div style={{ background: 'white', borderRadius: 'var(--radius)', maxWidth: 380, width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #EBEBEB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16 }}>Receipt Preview</h3>
              <button onClick={() => setShowReceipt(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div id="receipt-modal-content"><Receipt order={order} /></div>
            <div style={{ padding: '14px 18px', borderTop: '1px solid #EBEBEB' }}>
              <button className="btn btn-dark btn-full" onClick={handlePrint}>Print Receipt</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const { toast } = useApp();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filterStatus, setFilter] = useState('all');

  const fetchOrders = useCallback(async () => {
    const { data } = await getAllOrders();
    setOrders(data); setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const channel = subscribeToOrders(() => fetchOrders());
    return () => channel.unsubscribe?.();
  }, [fetchOrders]);

  const handleStatusChange = async (id, estado) => {
    await updateOrderStatus(id, estado);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, estado } : o));
    toast(`Order updated to ${STATUS_LABELS[estado]}`);
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.estado === filterStatus);

  if (loading) return <LoadingState text="Loading orders…" />;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '16px 20px 0', scrollbarWidth: 'none' }}>
        {['all', ...STATUS_FLOW].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn btn-sm"
            style={{ flexShrink: 0, background: filterStatus === s ? 'var(--black)' : 'var(--gray-100)', color: filterStatus === s ? 'var(--white)' : 'var(--gray-700)', borderRadius: 20 }}>
            {s === 'all' ? `All (${orders.length})` : `${STATUS_LABELS[s]} (${orders.filter(o => o.estado === s).length})`}
          </button>
        ))}
      </div>
      <div style={{ padding: '16px 20px' }}>
        {filtered.length === 0 ? (
          <EmptyState title="No orders" subtitle="Orders will appear here when students place them" />
        ) : (
          filtered.map(order => <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />)
        )}
      </div>
    </div>
  );
}
