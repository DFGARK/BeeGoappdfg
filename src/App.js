import React, { useState } from 'react';
import { AppProvider, useApp } from './lib/AppContext';
import { ToastContainer } from './components/UI';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import StudentApp     from './pages/StudentApp';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel     from './pages/AdminPanel';
import './styles/global.css';

const isAdminRoute = () => window.location.pathname.startsWith('/admin');

function AppRouter() {
  const { student, admin } = useApp();
  const [showRegister, setShowRegister] = useState(false);

  if (isAdminRoute()) {
    return admin ? <AdminPanel /> : <AdminLoginPage />;
  }
  if (student) return <StudentApp />;
  if (showRegister) return <RegisterPage onBack={() => setShowRegister(false)} />;
  return <LoginPage onShowRegister={() => setShowRegister(true)} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <ToastContainer />
    </AppProvider>
  );
}
