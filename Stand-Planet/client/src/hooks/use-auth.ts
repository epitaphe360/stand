import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/**
 * Hook d'authentification utilisant Supabase Auth
 *
 * MIGRATION SUPABASE:
 * - Authentification directe via Supabase Auth (pas d'appels API au serveur)
 * - Gestion des sessions avec JWT automatique
 * - Support sign up, sign in, sign out
 * - Token JWT automatiquement inclus dans les headers pour les appels API
 */

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  role?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Query pour récupérer l'utilisateur actuel
  const userQuery = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Convertir le User Supabase en AuthUser
      return {
        id: user.id,
        email: user.email || '',
        username: user.user_metadata?.username,
        fullName: user.user_metadata?.full_name,
        role: user.user_metadata?.role || 'user',
      } as AuthUser;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation pour le login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      // username peut être email ou username
      const email = credentials.username;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message || "Invalid credentials");
      }

      if (!data.user) {
        throw new Error("Login failed");
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata?.username,
        fullName: data.user.user_metadata?.full_name,
        role: data.user.user_metadata?.role || 'user',
      } as AuthUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth-user'], user);
      // Redirect based on role
      if (user.role === 'organizer') {
        setLocation('/organizer');
      } else {
        setLocation('/exhibitor');
      }
    },
  });

  // Mutation pour le register
  const registerMutation = useMutation({
    mutationFn: async (input: {
      email: string;
      password: string;
      username?: string;
      fullName?: string;
      role?: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            username: input.username,
            full_name: input.fullName,
            role: input.role || 'user',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Registration failed");
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata?.username,
        fullName: data.user.user_metadata?.full_name,
        role: data.user.user_metadata?.role || 'user',
      } as AuthUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth-user'], user);
      // Redirect based on role
      if (user.role === 'organizer') {
        setLocation('/organizer');
      } else {
        setLocation('/exhibitor');
      }
    },
  });

  // Mutation pour le logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      setLocation('/auth/login');
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
}

/**
 * Hook pour récupérer le token JWT Supabase
 * Utilisé pour les appels API au serveur
 */
export function useAuthToken() {
  return useQuery({
    queryKey: ['auth-token'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    },
    staleTime: 1000 * 60 * 4, // 4 minutes (token expire à 5 min)
    refetchInterval: 1000 * 60 * 4, // Refresh toutes les 4 minutes
  });
}
