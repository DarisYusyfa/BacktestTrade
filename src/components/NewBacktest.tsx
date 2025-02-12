import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function NewBacktest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    strategy_name: '',
    instrument: '',
    timeframe: '',
    lot_size: 0,
    initial_capital: 0,
    profit_loss: 0,
    start_date: '',
    end_date: '',
  });

  // Menghitung Win Rate secara otomatis
  const calculateWinRate = (profitLoss: number) => {
    if (profitLoss > 0) {
      return Math.min((profitLoss / formData.initial_capital) * 100, 100).toFixed(2);
    }
    return '0.00';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Pengguna tidak ditemukan');
      const win_rate = parseFloat(calculateWinRate(formData.profit_loss));
      const { error } = await supabase.from('backtests').insert([
        {
          ...formData,
          win_rate,
          user_id: user.id,
        },
      ]);
      if (error) throw error;
      toast.success('Backtest berhasil ditambahkan!');
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">New Backtest</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategy Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Strategy Name</label>
            <input type="text" value={formData.strategy_name} onChange={(e) => setFormData({ ...formData, strategy_name: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" required />
          </div>

          {/* Instrument */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instrument</label>
            <input type="text" value={formData.instrument} onChange={(e) => setFormData({ ...formData, instrument: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" required />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Timeframe</label>
            <select value={formData.timeframe} onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" required>
              <option value="">Select Timeframe</option>
              <option value="M1">M1</option>
              <option value="M5">M5</option>
              <option value="M15">M15</option>
              <option value="M30">M30</option>
              <option value="H1">H1</option>
              <option value="H4">H4</option>
              <option value="D1">D1</option>
            </select>
          </div>

          {/* Lot Size */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Lot Size</label>
            <input
              type="number"
              step="0.01"
              value={formData.lot_size}
              onChange={(e) => setFormData({ ...formData, lot_size: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          {/* Initial Capital */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Initial Capital</label>
            <input
              type="number"
              value={formData.initial_capital}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initial_capital: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          {/* Profit/Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Profit/Loss</label>
            <input
              type="number"
              value={formData.profit_loss}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profit_loss: parseFloat(e.target.value),
                })
              }
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
            <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" required />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
            <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white" required />
          </div>
        </div>

        {/* Win Rate Display */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">Win Rate (%)</label>
          <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">{calculateWinRate(formData.profit_loss)}%</div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Save Backtest
          </button>
        </div>
      </form>

      {/* Copyright Section */}
      <div className="mt-10 text-center text-gray-500 text-sm">© {new Date().getFullYear()} RizsFx. All rights reserved.</div>
    </div>
  );
}
