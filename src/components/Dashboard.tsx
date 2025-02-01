import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BacktestData } from '../types/backtest';
import { LineChart, BarChart2, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [backtests, setBacktests] = useState<BacktestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBacktests();
  }, []);

  const fetchBacktests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('backtests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBacktests(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Backtest Dashboard</h1>
          <button
            onClick={() => navigate('/new-backtest')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Backtest
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <LineChart className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400">Total Backtests</p>
                <p className="text-2xl font-bold">{backtests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BarChart2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400">Average Win Rate</p>
                <p className="text-2xl font-bold">
                  {backtests.length > 0
                    ? `${(backtests.reduce((acc, curr) => acc + curr.win_rate, 0) / backtests.length).toFixed(2)}%`
                    : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400">Total P&L</p>
                <p className="text-2xl font-bold">
                  ${backtests.reduce((acc, curr) => acc + curr.profit_loss, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Backtests</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : backtests.length === 0 ? (
              <p className="text-gray-400">No backtests found. Create your first one!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3">Strategy</th>
                      <th className="pb-3">Instrument</th>
                      <th className="pb-3">Timeframe</th>
                      <th className="pb-3">Win Rate</th>
                      <th className="pb-3">P&L</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtests.map((backtest) => (
                      <tr key={backtest.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-4">{backtest.strategy_name}</td>
                        <td className="py-4">{backtest.instrument}</td>
                        <td className="py-4">{backtest.timeframe}</td>
                        <td className="py-4">{backtest.win_rate}%</td>
                        <td className="py-4">
                          <span className={backtest.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                            ${backtest.profit_loss.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4">
                          {new Date(backtest.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}