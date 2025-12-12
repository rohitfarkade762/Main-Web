import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nivdtlzrjhhpedknnivv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmR0bHpyamhocGVka25uaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMTA2OTYsImV4cCI6MjA4MDg4NjY5Nn0.MupoBR-Ugc0go2e0GB80kTiquJ80hMPOH9GrZk-bQVk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TestResult {
  id: string;
  mcb_type: string;
  fault_current: number;
  power_factor: number;
  trip_time: number;
  result: 'pass' | 'fail';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  created_at: string;
}

export interface TestConfiguration {
  id: string;
  mcb_rating: number;
  fault_current: number;
  power_factor: number;
  created_at: string;
  voltage : number;
}