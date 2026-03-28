-- =============================================
-- SUPABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor
-- =============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('HS-ADMIN', 'RSM', 'ASM')),
  password TEXT NOT NULL,
  branches TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RETAILERS TABLE
CREATE TABLE IF NOT EXISTS retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  branch TEXT NOT NULL,
  zone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RETAILER PERFORMANCE TABLE
CREATE TABLE IF NOT EXISTS retailer_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id TEXT NOT NULL REFERENCES retailers(retailer_id),
  year INT NOT NULL,
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  ga_activations INT DEFAULT 0,
  new_activations INT DEFAULT 0,
  port_in INT DEFAULT 0,
  port_out INT DEFAULT 0,
  plan_pin_699_below INT DEFAULT 0,
  plan_pin_699_above INT DEFAULT 0,
  plan_new_699_below INT DEFAULT 0,
  plan_new_699_above INT DEFAULT 0,
  incentive_amount DECIMAL(10,2) DEFAULT 0,
  port_in_incentive DECIMAL(10,2) DEFAULT 0,
  gara_bonus DECIMAL(10,2) DEFAULT 0,
  deductions_clawback DECIMAL(10,2) DEFAULT 0,
  deductions_po DECIMAL(10,2) DEFAULT 0,
  deductions_renewal DECIMAL(10,2) DEFAULT 0,
  renewal_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(retailer_id, year, month)
);

-- Insert default admin user (change password after first login!)
INSERT INTO users (username, name, email, role, password, branches)
VALUES (
  'admin',
  'HS Administrator',
  'admin@hssimply.it',
  'HS-ADMIN',
  'admin123',
  ARRAY['LMIT-HS-MILAN','LMIT-HS-BOLOGNA','LMIT-HS-NAPLES','LMIT-HS-PALERMO','LMIT-HS-ROME','LMIT-HS-BARI','LMIT-HS-TORINO','LMIT-HS-PADOVA']
) ON CONFLICT (username) DO NOTHING;

-- RLS Policies (disable for now, enable after setup)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE retailers DISABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_performance DISABLE ROW LEVEL SECURITY;
