import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { BacktestData } from '../types/backtest';
import { LineChart, BarChart2, TrendingUp, Plus, ArrowDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup'; // Import CountUp
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function Dashboard() {
  const navigate = useNavigate();
  const [backtests, setBacktests] = useState<BacktestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch backtests from Supabase
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

  // Pagination logic
  const paginatedBacktests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return backtests.slice(startIndex, startIndex + itemsPerPage);
  }, [backtests, currentPage]);

  const totalPages = Math.ceil(backtests.length / itemsPerPage);

  // Calculate additional stats
  const totalTrades = backtests.length;
  const maxDrawdown = Math.min(...backtests.map((bt) => bt.profit_loss)); // Example calculation

  // Average Win Rate
  const averageWinRate = useMemo(() => {
    return backtests.length > 0 ? (backtests.reduce((acc, curr) => acc + curr.win_rate, 0) / backtests.length).toFixed(2) : '0';
  }, [backtests]);

  // Total Profit/Loss
  const totalProfitLoss = useMemo(() => {
    return backtests.reduce((acc, curr) => acc + curr.profit_loss, 0);
  }, [backtests]);

  // Detect consecutive losses
  const hasConsecutiveLosses = useMemo(() => {
    let consecutiveLosses = 0;
    for (let i = 0; i < backtests.length; i++) {
      if (backtests[i].profit_loss < 0) {
        consecutiveLosses++;
        if (consecutiveLosses >= 3) return true; // 3 or more consecutive losses
      } else {
        consecutiveLosses = 0;
      }
    }
    return false;
  }, [backtests]);

  // Notification logic
  useEffect(() => {
    if (hasConsecutiveLosses) {
      toast.error('Warning: You have experienced 3 or more consecutive losses!');
    }
  }, [hasConsecutiveLosses]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Prevent Horizontal Scroll */}
      <style>{`
        body {
          overflow-x: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Backtest Dashboard</h1>
          <button onClick={() => navigate('/new-backtest')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
            <Plus className="h-5 w-5" />
            New Backtest
          </button>
        </div>

        {/* Notifications */}
        {hasConsecutiveLosses && (
          <div className="bg-red-500/20 p-3 sm:p-4 rounded-lg mb-4">
            <p className="text-red-400 text-sm sm:text-base">Warning: You have experienced 3 or more consecutive losses!</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Row 1 */}
          <SummaryCard icon={<LineChart className="text-blue-500" />} label="Total Backtests" value={totalTrades} />
          <SummaryCard icon={<BarChart2 className="text-green-500" />} label="Average Win Rate" value={`${averageWinRate}%`} />
          {/* Row 2 */}
          <SummaryCard icon={<TrendingUp className="text-purple-500" />} label="Total P&L" value={`$${totalProfitLoss.toLocaleString()}`} />
          <SummaryCard icon={<ArrowDown className="text-red-500" />} label="Max Drawdown" value={`$${maxDrawdown}`} />
        </div>

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Recent Backtests Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Backtests</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : backtests.length === 0 ? (
              <p className="text-gray-400 text-sm">No backtests found. Create your first one!</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full max-w-full text-sm sm:text-base">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-2 sm:pb-3">Strategy</th>
                        <th className="pb-2 sm:pb-3 hidden sm:table-cell">Instrument</th>
                        <th className="pb-2 sm:pb-3 hidden sm:table-cell">Timeframe</th>
                        <th className="pb-2 sm:pb-3">Win Rate</th>
                        <th className="pb-2 sm:pb-3">P&L</th>
                        <th className="pb-2 sm:pb-3 hidden sm:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBacktests.map((backtest) => (
                        <tr key={backtest.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="py-2 sm:py-4">{backtest.strategy_name}</td>
                          <td className="py-2 sm:py-4 hidden sm:table-cell">{backtest.instrument}</td>
                          <td className="py-2 sm:py-4 hidden sm:table-cell">{backtest.timeframe}</td>
                          <td className="py-2 sm:py-4">
                            <CountUp end={backtest.win_rate} duration={2} decimals={2} suffix="%" />
                          </td>
                          <td className="py-2 sm:py-4">
                            <span className={backtest.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}>
                              <CountUp end={backtest.profit_loss} duration={2} prefix="$" decimals={2} />
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 hidden sm:table-cell">{new Date(backtest.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center mt-4 sm:mt-6">
                  <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 rounded-l-lg disabled:opacity-50 text-xs sm:text-sm">
                    Previous
                  </button>
                  <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 text-xs sm:text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-700 rounded-r-lg disabled:opacity-50 text-xs sm:text-sm">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Copyright */}
        <footer className="text-center text-gray-500 text-xs sm:text-sm mt-8">&copy; {new Date().getFullYear()} RizsFx. All rights reserved.</footer>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  const suffix = typeof value === 'string' && value.includes('%') ? '%' : '';
  return (
    <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700 flex items-center gap-3 sm:gap-4">
      <div className="p-2 bg-blue-500/20 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
        <p className="text-base sm:text-lg font-bold">
          <CountUp end={numericValue} duration={2.5} decimals={typeof value === 'string' && value.includes('.') ? 2 : 0} suffix={suffix} />
        </p>
      </div>
    </div>
  );
}

// Performance Chart Component
function PerformanceChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Profit/Loss',
        data: [1000, 1500, -500, 2000, 1800],
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF50',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Over Time',
        color: '#fff',
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#444',
        },
      },
      y: {
        ticks: {
          color: '#fff',
          font: {
            size: 10,
          },
        },
        grid: {
          color: '#444',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg mb-6">
      <h3 className="text-base sm:text-lg font-bold text-white mb-3">Performance Overview</h3>
      <Line data={data} options={options} />
    </div>
  );
}
