import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { NewBacktest } from './components/NewBacktest';
import { Performance } from './components/Performance';
import { SettingsPage } from './components/SettingsPage';
import { Sidebar } from './components/Sidebar';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './components/ThemeContext';
import { Bell } from 'lucide-react';

interface User {
  email: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State untuk mengontrol popup notifikasi

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser((session?.user as User) ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as User) ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleBellClick = () => {
    setIsNotificationOpen(!isNotificationOpen); // Buka/tutup popup notifikasi
    if (!isNotificationOpen) {
      setNotificationCount(0); // Reset notifikasi setelah dibuka
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthForm type="login" />} />
            <Route path="/register" element={<AuthForm type="register" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }

  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <div className="flex">
          {/* Sidebar */}
          <Sidebar user={user} />

          {/* Main Content */}
          <main className="flex-1 bg-gray-900 min-h-screen pt-8 relative">
            {/* Ikon Notifikasi */}
            <div className="absolute top-4 right-4 z-50">
              <button className="bg-gray-800 p-2 rounded-full text-white shadow-lg hover:bg-gray-700 transition-colors focus:outline-none relative" onClick={handleBellClick}>
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5">{notificationCount}</span>}
              </button>

              {/* Popup Notifikasi */}
              {isNotificationOpen && (
                <div className="absolute top-12 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-64 p-4">
                  <p className="text-sm font-bold mb-2 text-white">Notifikasi</p>
                  <hr className="my-2 border-t border-gray-700" />
                  <p className="text-sm text-white">Selamat datang! {notificationCount} notifikasi baru.</p>
                  <button className="mt-2 text-blue-500 text-sm hover:underline focus:outline-none" onClick={() => setIsNotificationOpen(false)}>
                    Tutup
                  </button>
                </div>
              )}
            </div>

            {/* Routes */}
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/new-backtest" element={<NewBacktest />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
