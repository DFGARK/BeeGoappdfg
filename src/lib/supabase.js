// src/lib/supabase.js
// Supabase client initialization

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey  = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase env vars missing. Copy .env.example to .env and fill in your keys.');
}

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder'
);

// ── AUTH HELPERS ──────────────────────────────────────────────

/** Login a student by username + password */
export async function loginStudent(usuario, password) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('usuario', usuario)
    .eq('password_hash', password)
    .eq('activo', true)
    .single();

  if (error || !data) return { user: null, error: 'Invalid username or password.' };
  return { user: data, error: null };
}

/** Login an admin by username + password */
export async function loginAdmin(usuario, password) {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('usuario', usuario)
    .eq('password_hash', password)
    .single();

  if (error || !data) return { admin: null, error: 'Invalid credentials.' };
  return { admin: data, error: null };
}

// ── PRODUCTS ──────────────────────────────────────────────────

export async function getProducts() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('categoria')
    .order('nombre');
  return { data: data || [], error };
}

export async function createProduct(product) {
  const { data, error } = await supabase
    .from('productos')
    .insert(product)
    .select()
    .single();
  return { data, error };
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('productos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);
  return { error };
}

// ── ORDERS ────────────────────────────────────────────────────

export async function createOrder(orderData, items) {
  // Insert the order
  const { data: order, error: orderErr } = await supabase
    .from('ordenes')
    .insert(orderData)
    .select()
    .single();

  if (orderErr) return { order: null, error: orderErr };

  // Insert order details
  const details = items.map(item => ({
    orden_id:       order.id,
    producto_id:    item.id,
    nombre_producto:item.nombre,
    cantidad:       item.qty,
    precio_unitario:item.precio,
    subtotal:       item.precio * item.qty,
  }));

  const { error: detailsErr } = await supabase
    .from('orden_detalles')
    .insert(details);

  if (detailsErr) return { order: null, error: detailsErr };
  return { order, error: null };
}

/** Get orders for a specific student */
export async function getStudentOrders(studentId) {
  const { data, error } = await supabase
    .from('ordenes')
    .select(`*, orden_detalles(*)`)
    .eq('estudiante_id', studentId)
    .order('creado_en', { ascending: false });
  return { data: data || [], error };
}

/** Get all orders for admin, with details */
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('ordenes')
    .select(`*, orden_detalles(*)`)
    .order('creado_en', { ascending: false });
  return { data: data || [], error };
}

export async function updateOrderStatus(id, estado) {
  const { data, error } = await supabase
    .from('ordenes')
    .update({ estado })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ── REALTIME ──────────────────────────────────────────────────

/** Subscribe to order changes (used by admin panel) */
export function subscribeToOrders(callback) {
  return supabase
    .channel('ordenes-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ordenes' }, callback)
    .subscribe();
}
