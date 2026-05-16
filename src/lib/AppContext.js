// src/lib/AppContext.js
// Global state: current user, cart, toasts

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth state ────────────────────────────────────────────
  const [student, setStudent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bg_student') || 'null'); }
    catch { return null; }
  });
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bg_admin') || 'null'); }
    catch { return null; }
  });

  // ── Cart state ────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bg_cart') || '[]'); }
    catch { return []; }
  });

  // ── Toast state ───────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  // Persist state
  useEffect(() => {
    if (student) localStorage.setItem('bg_student', JSON.stringify(student));
    else         localStorage.removeItem('bg_student');
  }, [student]);

  useEffect(() => {
    if (admin) localStorage.setItem('bg_admin', JSON.stringify(admin));
    else       localStorage.removeItem('bg_admin');
  }, [admin]);

  useEffect(() => {
    localStorage.setItem('bg_cart', JSON.stringify(cart));
  }, [cart]);

  // ── Auth helpers ──────────────────────────────────────────
  const loginStudent = (s)  => setStudent(s);
  const logoutStudent = ()  => { setStudent(null); setCart([]); };
  const loginAdmin  = (a)   => setAdmin(a);
  const logoutAdmin = ()    => setAdmin(null);

  // ── Cart helpers ──────────────────────────────────────────
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((id, delta) => {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, i) => sum + i.precio * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // ── Toast helpers ─────────────────────────────────────────
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <AppContext.Provider value={{
      student, loginStudent, logoutStudent,
      admin, loginAdmin, logoutAdmin,
      cart, addToCart, changeQty, removeFromCart, clearCart, cartTotal, cartCount,
      toasts, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
