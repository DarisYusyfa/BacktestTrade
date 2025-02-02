import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Registrasi berhasil! Silakan cek email Anda.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Login berhasil!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan tidak terduga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="mx-auto px-4 md:px-8 w-full max-w-md">
        <div className="bg-gray-800/50 p-4 md:p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-gray-700">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{type === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun'}</h2>
            <p className="text-gray-400 text-sm md:text-base">{type === 'login' ? 'Masukkan kredensial Anda untuk mengakses akun' : 'Daftar untuk mulai mengelola backtest Anda'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>

            <button type="submit" className="w-full py-2 md:py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 relative" disabled={loading}>
              {loading ? (
                <>
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.692V21l4.308-4.308z"></path>
                    </svg>
                  </span>
                </>
              ) : type === 'login' ? (
                'Masuk'
              ) : (
                'Buat Akun'
              )}
            </button>
          </form>

          <p className="mt-4 md:mt-6 text-center text-gray-400 text-sm md:text-base">
            {type === 'login' ? (
              <>
                Belum punya akun?{' '}
                <a href="/register" className="text-blue-400 hover:text-blue-300">
                  Daftar
                </a>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <a href="/login" className="text-blue-400 hover:text-blue-300">
                  Masuk
                </a>
              </>
            )}
          </p>
        </div>
        {/* Copyright */}
        <footer className="text-center text-gray-500 text-sm mt-12">&copy; {new Date().getFullYear()} RizsFx. All rights reserved.</footer>
      </div>
    </div>
  );
}
