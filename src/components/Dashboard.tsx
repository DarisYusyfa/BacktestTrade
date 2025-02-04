import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { BacktestData } from '../types/backtest';
import { LineChart, BarChart2, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup'; // Import CountUp

export function Dashboard() {
  const navigate = useNavigate();
  const [backtests, setBacktests] = useState<BacktestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Ubah dari 10 menjadi 4

  useEffect(() => {
    fetchBacktests();
  }, []);

  const fetchBacktests = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error('No user found');
      const { data, error } = await supabase.from('backtests').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setBacktests(data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const averageWinRate = useMemo(() => {
    return backtests.length > 0 ? (backtests.reduce((acc, curr) => acc + curr.win_rate, 0) / backtests.length).toFixed(2) : '0';
  }, [backtests]);

  const totalProfitLoss = useMemo(() => {
    return backtests.reduce((acc, curr) => acc + curr.profit_loss, 0);
  }, [backtests]);

  const paginatedBacktests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return backtests.slice(startIndex, startIndex + itemsPerPage);
  }, [backtests, currentPage]);

  const totalPages = Math.ceil(backtests.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Backtest Dashboard</h1>
          <button onClick={() => navigate('/new-backtest')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
            <Plus className="h-5 w-5" />
            New Backtest
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard icon={<LineChart className="h-6 w-6 text-blue-500" />} label="Total Backtests" value={backtests.length} />
          <SummaryCard icon={<BarChart2 className="h-6 w-6 text-green-500" />} label="Average Win Rate" value={`${averageWinRate}%`} />
          <SummaryCard icon={<TrendingUp className="h-6 w-6 text-purple-500" />} label="Total P&L" value={`$${totalProfitLoss.toLocaleString()}`} />
        </div>

        {/* Recent Backtests Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Recent Backtests</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : backtests.length === 0 ? (
              <p className="text-gray-400">No backtests found. Create your first one!</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3">Strategy</th>
                        <th className="pb-3 hidden sm:table-cell">Instrument</th>
                        <th className="pb-3 hidden sm:table-cell">Timeframe</th>
                        <th className="pb-3">Win Rate</th>
                        <th className="pb-3">P&L</th>
                        <th className="pb-3 hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBacktests.map((backtest) => (
                        <tr key={backtest.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-4">{backtest.strategy_name}</td>
                          <td className="py-4 hidden sm:table-cell">{backtest.instrument}</td>
                          <td className="py-4 hidden sm:table-cell">{backtest.timeframe}</td>
                          <td className="py-4">
                            <CountUp end={backtest.win_rate} duration={2} decimals={2} suffix="%" />
                          </td>
                          <td className="py-4">
                            <span className={backtest.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                              <CountUp end={backtest.profit_loss} duration={2} prefix="$" decimals={2} />
                            </span>
                          </td>
                          <td className="py-4 hidden sm:table-cell">{new Date(backtest.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-1 bg-gray-700 rounded-l-lg disabled:opacity-50 text-xs">
                    Previous
                  </button>
                  <span className="px-4 py-1 bg-gray-700 text-xs">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-1 bg-gray-700 rounded-r-lg disabled:opacity-50 text-xs">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Copyright */}
        <footer className="text-center text-gray-500 text-sm mt-12">&copy; {new Date().getFullYear()} RizsFx. All rights reserved.</footer>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';
  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-700 flex items-center gap-4">
      <div className="p-3 bg-blue-500/20 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-2xl font-bold">
          <CountUp end={numericValue} duration={2.5} decimals={typeof value === 'string' && value.includes('.') ? 2 : 0} suffix={suffix} />
        </p>
      </div>
    </div>
  );
}
