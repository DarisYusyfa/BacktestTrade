import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BacktestData } from '../types/backtest';
import { toast } from 'react-hot-toast';

export function Performance() {
  const [dailyStats, setDailyStats] = useState<any>({});
  const [weeklyStats, setWeeklyStats] = useState<any>({});
  const [monthlyStats, setMonthlyStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('backtests')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Calculate daily stats
      const today = new Date().toISOString().split('T')[0];
      const dailyData = data.filter((test) => test.end_date === today);
      setDailyStats({
        total: dailyData.length,
        profit: dailyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: dailyData.length
          ? dailyData.reduce((sum, test) => sum + test.win_rate, 0) /
            dailyData.length
          : 0,
      });

      // Calculate weekly stats
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weeklyData = data.filter(
        (test) => new Date(test.end_date) >= weekStart
      );
      setWeeklyStats({
        total: weeklyData.length,
        profit: weeklyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: weeklyData.length
          ? weeklyData.reduce((sum, test) => sum + test.win_rate, 0) /
            weeklyData.length
          : 0,
      });

      // Calculate monthly stats
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthlyData = data.filter(
        (test) => new Date(test.end_date) >= monthStart
      );
      setMonthlyStats({
        total: monthlyData.length,
        profit: monthlyData.reduce((sum, test) => sum + test.profit_loss, 0),
        avgWinRate: monthlyData.length
          ? monthlyData.reduce((sum, test) => sum + test.win_rate, 0) /
            monthlyData.length
          : 0,
      });

      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Performance Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Daily Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">
                {dailyStats.total}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Profit/Loss</p>
              <p className={`text-2xl font-bold ${
                dailyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${dailyStats.profit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Average Win Rate</p>
              <p className="text-2xl font-bold text-white">
                {dailyStats.avgWinRate.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">
                {weeklyStats.total}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Profit/Loss</p>
              <p className={`text-2xl font-bold ${
                weeklyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${weeklyStats.profit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Average Win Rate</p>
              <p className="text-2xl font-bold text-white">
                {weeklyStats.avgWinRate.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Monthly Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Backtests</p>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.total}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Profit/Loss</p>
              <p className={`text-2xl font-bold ${
                monthlyStats.profit >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${monthlyStats.profit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Average Win Rate</p>
              <p className="text-2xl font-bold text-white">
                {monthlyStats.avgWinRate.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}