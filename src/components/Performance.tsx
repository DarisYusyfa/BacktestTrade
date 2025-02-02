import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

// Mendefinisikan interface Stats
interface Stats {
  total: number;
  profit: number;
  avgWinRate: number;
}

export function Performance() {
  // State dengan tipe spesifik
  const [dailyStats, setDailyStats] = useState<Stats>({ total: 0, profit: 0, avgWinRate: 0 });
  const [weeklyStats, setWeeklyStats] = useState<Stats>({ total: 0, profit: 0, avgWinRate: 0 });
  const [monthlyStats, setMonthlyStats] = useState<Stats>({ total: 0, profit: 0, avgWinRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mendapatkan pengguna saat ini
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Pengguna tidak ditemukan');

      // Mengambil data backtests untuk pengguna
      const { data, error } = await supabase.from('backtests').select('*').eq('user_id', user.id);

      if (error) throw error;

      // Menghitung statistik harian
      const today = new Date().toISOString().split('T')[0];
      const dailyData = data.filter((test) => test.end_date === today);
      setDailyStats({
        total: dailyData.length,
        profit: dailyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: dailyData.length ? dailyData.reduce((sum, test) => sum + test.win_rate, 0) / dailyData.length : 0,
      });

      // Menghitung statistik mingguan
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weeklyData = data.filter((test) => new Date(test.end_date) >= weekStart);
      setWeeklyStats({
        total: weeklyData.length,
        profit: weeklyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: weeklyData.length ? weeklyData.reduce((sum, test) => sum + test.win_rate, 0) / weeklyData.length : 0,
      });

      // Menghitung statistik bulanan
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthlyData = data.filter((test) => new Date(test.end_date) >= monthStart);
      setMonthlyStats({
        total: monthlyData.length,
        profit: monthlyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: monthlyData.length ? monthlyData.reduce((sum, test) => sum + test.win_rate, 0) / monthlyData.length : 0,
      });

      setLoading(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak terduga');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Memuat...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Ringkasan Performa</h1>

      {/* Grid Layout Responsif */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Kartu Statistik Harian */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Statistik Harian</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">{dailyStats.total}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Keuntungan/Kerugian</p>
              <p className={`text-2xl font-bold ${dailyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${dailyStats.profit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Rata-rata Win Rate</p>
              <p className="text-2xl font-bold text-white">{dailyStats.avgWinRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Kartu Statistik Mingguan */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Statistik Mingguan</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">{weeklyStats.total}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Keuntungan/Kerugian</p>
              <p className={`text-2xl font-bold ${weeklyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${weeklyStats.profit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Rata-rata Win Rate</p>
              <p className="text-2xl font-bold text-white">{weeklyStats.avgWinRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Kartu Statistik Bulanan */}
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Statistik Bulanan</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">{monthlyStats.total}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Keuntungan/Kerugian</p>
              <p className={`text-2xl font-bold ${monthlyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${monthlyStats.profit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Rata-rata Win Rate</p>
              <p className="text-2xl font-bold text-white">{monthlyStats.avgWinRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="mt-10 text-center text-gray-500 text-sm">© {new Date().getFullYear()} RizsFx. All rights reserved.</div>
    </div>
  );
}
