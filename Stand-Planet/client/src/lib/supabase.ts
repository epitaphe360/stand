import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback for development to prevent crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getPublicUrl(path: string) {
  if (!path) return '';
  const { data } = supabase.storage.from('public').getPublicUrl(path);
  return data.publicUrl;
}
