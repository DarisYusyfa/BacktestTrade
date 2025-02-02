import { useEffect, useState } from 'react';
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
          <Sidebar user={user} />
          <main className="flex-1 bg-gray-900 min-h-screen pt-8">
            {' '}
            {/* Tambahkan padding-top (pt-16) */}
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
