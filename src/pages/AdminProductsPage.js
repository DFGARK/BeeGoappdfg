import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../lib/supabase';
import { useApp } from '../lib/AppContext';
import { LoadingState, EmptyState, CATEGORY_ICON, CATEGORY_LABELS } from '../components/UI';

const CATEGORIES = ['drinks', 'snacks', 'meals', 'desserts'];
const EMPTY_FORM = { nombre: '', descripcion: '', precio: '', categoria: 'drinks', disponible: true };

export default function AdminProductsPage() {
  const { toast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    getProducts().then(({ data }) => { setProducts(data); setLoading(false); });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (product) => {
    setEditing(product.id);
    setForm({ nombre: product.nombre, descripcion: product.descripcion || '', precio: product.precio, categoria: product.categoria, disponible: product.disponible });
    setShowForm(true);
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precio) { toast('Please fill name and price', 'error'); return; }
    setSaving(true);
    const payload = { ...form, precio: parseFloat(form.precio) };
    if (editing) {
      const { data, error } = await updateProduct(editing, payload);
      if (error) { toast('Could not update product', 'error'); setSaving(false); return; }
      setProducts(prev => prev.map(p => p.id === editing ? data : p));
      toast('Product updated!');
    } else {
      const { data, error } = await createProduct(payload);
      if (error) { toast('Could not create product', 'error'); setSaving(false); return; }
      setProducts(prev => [...prev, data]);
      toast('Product added!');
    }
    setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY_FORM);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the menu?`)) return;
    const { error } = await deleteProduct(id);
    if (error) { toast('Could not delete product', 'error'); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
    toast('Product removed');
  };

  const handleToggleAvailable = async (product) => {
    const { data, error } = await updateProduct(product.id, { disponible: !product.disponible });
    if (error) { toast('Could not update', 'error'); return; }
    setProducts(prev => prev.map(p => p.id === product.id ? data : p));
  };

  if (loading) return <LoadingState text="Loading products…" />;

  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2>Products ({products.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>+ Add</button>
      </div>

      {CATEGORIES.map(cat => {
        const catProducts = products.filter(p => p.categoria === cat);
        if (!catProducts.length) return null;
        return (
          <div key={cat} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: 'var(--gray-400)' }}>{CATEGORY_ICON[cat]}</span>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {CATEGORY_LABELS[cat]}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {catProducts.map(product => (
                <div key={product.id} className="card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, opacity: product.disponible ? 1 : 0.55 }}>
                  <div style={{ color: 'var(--gray-400)', flexShrink: 0 }}>{CATEGORY_ICON[product.categoria]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{product.nombre}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.descripcion}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--honey-dark)', marginTop: 2 }}>Q{product.precio}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => handleToggleAvailable(product)} className="btn btn-sm"
                      style={{ background: product.disponible ? '#E8F5E9' : '#FFEBEE', color: product.disponible ? '#2E7D32' : '#C62828', padding: '4px 10px', fontSize: 11 }}>
                      {product.disponible ? '✓ On' : '✕ Off'}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => openEdit(product)}>Edit</button>
                    <button className="btn btn-sm" style={{ background: '#FFEBEE', color: '#C62828', padding: '4px 10px', fontSize: 11 }} onClick={() => handleDelete(product.id, product.nombre)}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {products.length === 0 && <EmptyState title="No products" subtitle="Add your first menu item" />}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 400, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 430, padding: '24px 22px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3>{editing ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20 }}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" name="nombre" placeholder="e.g. Iced Coffee" value={form.nombre} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Description</label><input className="form-input" name="descripcion" placeholder="Short description" value={form.descripcion} onChange={handleChange} /></div>
              <div className="form-group"><label className="form-label">Price (Q)</label><input className="form-input" name="precio" type="number" step="0.01" min="0" placeholder="18" value={form.precio} onChange={handleChange} required /></div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" name="categoria" value={form.categoria} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" name="disponible" id="disponible" checked={form.disponible} onChange={handleChange} style={{ width: 18, height: 18 }} />
                <label htmlFor="disponible" style={{ fontWeight: 600, color: 'var(--dark)', cursor: 'pointer', userSelect: 'none' }}>Available on menu</label>
              </div>
              <button type="submit" className="btn btn-dark btn-full" style={{ marginTop: 8 }} disabled={saving}>
                {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
