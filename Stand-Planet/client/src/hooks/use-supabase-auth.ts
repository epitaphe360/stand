import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

/**
 * Hook personnalisé pour gérer l'authentification Supabase
 * Remplace l'ancien useAuth qui utilisait un système mock
 */

export interface UseSupabaseAuthReturn {
  // État
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;

  // Actions
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (metadata: any) => Promise<{ error: AuthError | null }>;

  // Helpers
  isAuthenticated: boolean;
  getAccessToken: () => Promise<string | null>;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialiser la session au montage
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setError(error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_OUT') {
          setError(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Inscription d'un nouvel utilisateur
   */
  const signUp = async (
    email: string,
    password: string,
    metadata?: any
  ) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { user: data.user, error };
  };

  /**
   * Connexion d'un utilisateur existant
   */
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error);
    }

    setLoading(false);
    return { user: data.user, error };
  };

  /**
   * Déconnexion
   */
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      setError(error);
    }

    setUser(null);
    setSession(null);
    setLoading(false);
  };

  /**
   * Réinitialiser le mot de passe (envoie un email)
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) {
      setError(error);
    }

    return { error };
  };

  /**
   * Mettre à jour le mot de passe
   */
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error);
    }

    return { error };
  };

  /**
   * Mettre à jour le profil utilisateur (metadata)
   */
  const updateProfile = async (metadata: any) => {
    const { error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) {
      setError(error);
    }

    return { error };
  };

  /**
   * Obtenir le token d'accès (pour les requêtes API)
   */
  const getAccessToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  return {
    // État
    user,
    session,
    loading,
    error,

    // Actions
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,

    // Helpers
    isAuthenticated: !!user,
    getAccessToken
  };
}

/**
 * Hook pour obtenir le token d'accès actuel (pour les requêtes fetch)
 * Usage:
 *
 * const { getToken } = useAuthToken();
 * const token = await getToken();
 * fetch('/api/protected', {
 *   headers: { Authorization: `Bearer ${token}` }
 * });
 */
export function useAuthToken() {
  const getToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  return { getToken };
}

/**
 * Hook pour les routes protégées (redirect si non authentifié)
 * Usage dans un composant page:
 *
 * function ProtectedPage() {
 *   const { user, loading } = useRequireAuth('/login');
 *
 *   if (loading) return <Loading />;
 *   // user est garanti non-null ici
 * }
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, loading } = useSupabaseAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, loading, redirectTo]);

  return { user, loading };
}
