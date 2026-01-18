import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback for development to prevent crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// SSO Configuration for epitaphev1 integration
// Uses shared authentication token to enable Single Sign-On between epitaphev1 and Stand-Planet
const authStorageKey = import.meta.env.VITE_AUTH_STORAGE_KEY || 'epitaphev1-auth-token';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: authStorageKey, // Shared with epitaphev1 for SSO
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});

export function getPublicUrl(path: string) {
  if (!path) return '';
  const { data } = supabase.storage.from('public').getPublicUrl(path);
  return data.publicUrl;
}
