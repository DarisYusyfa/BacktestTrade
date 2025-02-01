export interface BacktestData {
  id: string;
  user_id: string;
  strategy_name: string;
  instrument: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  profit_loss: number;
  win_rate: number;
  created_at: string;
}