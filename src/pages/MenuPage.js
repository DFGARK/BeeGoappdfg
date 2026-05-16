import React, { useState, useEffect } from 'react';
import { getProducts } from '../lib/supabase';
import { useApp } from '../lib/AppContext';
import { LoadingState, EmptyState, CATEGORY_ICON, CATEGORY_LABELS } from '../components/UI';

const CATEGORIES = ['all', 'drinks', 'snacks', 'meals', 'desserts'];

export default function MenuPage() {
  const { addToCart, cart, toast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getProducts().then(({ data }) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = activeTab === 'all'
    ? products.filter(p => p.disponible)
    : products.filter(p => p.categoria === activeTab && p.disponible);

  const handleAdd = (product) => {
    addToCart(product);
    toast(`${product.nombre} added to cart`);
  };

  const cartQty = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.qty : 0;
  };

  if (loading) return <LoadingState text="Loading menu…" />;

  return (
    <div style={{ padding: '20px 20px 100px' }}>
      <h2 style={{ marginBottom: 16 }}>Menu</h2>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="btn"
            style={{
              flexShrink: 0, padding: '7px 14px', fontSize: 13,
              borderRadius: 30,
              background: activeTab === cat ? 'var(--black)' : 'var(--gray-100)',
              color: activeTab === cat ? 'var(--white)' : 'var(--gray-700)',
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {cat === 'all' ? 'All' : (
              <>
                <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === cat ? 1 : 0.6 }}>
                  {CATEGORY_ICON[cat]}
                </span>
                {CATEGORY_LABELS[cat]}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Products list */}
      {filtered.length === 0
        ? <EmptyState title="Nothing here" subtitle="Check other categories" />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(product => {
              const qty = cartQty(product.id);
              return (
                <div key={product.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
                  {/* Icon placeholder */}
                  <div style={{
                    width: 58, height: 58, borderRadius: 12,
                    background: 'var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gray-400)', flexShrink: 0,
                  }}>
                    {CATEGORY_ICON[product.categoria] || (
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="11" y1="7" x2="11" y2="11"/><circle cx="11" cy="14" r="0.8" fill="currentColor"/></svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: 'var(--dark)', fontSize: 15 }}>{product.nombre}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2, lineHeight: 1.3 }}>{product.descripcion}</p>
                    <p style={{ fontWeight: 800, color: 'var(--honey-dark)', fontSize: 15, marginTop: 4 }}>Q{product.precio}</p>
                  </div>

                  {/* Cart badge */}
                  {qty > 0 ? (
                    <div style={{ background: 'var(--honey)', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 800, color: 'var(--black)', flexShrink: 0 }}>
                      {qty} in cart
                    </div>
                  ) : null}

                  <button
                    className="btn btn-dark btn-sm"
                    style={{ flexShrink: 0, borderRadius: 10, padding: '8px 14px' }}
                    onClick={() => handleAdd(product)}
                  >
                    + Add
                  </button>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
