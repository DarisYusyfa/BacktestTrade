/*
  # Create Backtests Management Schema

  1. New Tables
    - `backtests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `strategy_name` (text)
      - `instrument` (text)
      - `timeframe` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `initial_capital` (numeric)
      - `profit_loss` (numeric)
      - `win_rate` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `backtests` table
    - Add policies for authenticated users to:
      - Read their own backtests
      - Create new backtests
      - Update their own backtests
      - Delete their own backtests
*/

CREATE TABLE IF NOT EXISTS backtests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  strategy_name text NOT NULL,
  instrument text NOT NULL,
  timeframe text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  initial_capital numeric NOT NULL DEFAULT 0,
  profit_loss numeric NOT NULL DEFAULT 0,
  win_rate numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_win_rate CHECK (win_rate >= 0 AND win_rate <= 100)
);

ALTER TABLE backtests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own backtests
CREATE POLICY "Users can read own backtests"
  ON backtests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create backtests
CREATE POLICY "Users can create backtests"
  ON backtests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own backtests
CREATE POLICY "Users can update own backtests"
  ON backtests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own backtests
CREATE POLICY "Users can delete own backtests"
  ON backtests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);