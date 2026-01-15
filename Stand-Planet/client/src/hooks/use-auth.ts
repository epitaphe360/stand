import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type LoginRequest } from "@shared/routes";
import { useLocation } from "wouter";

// IMPORTANT: This hook mocks authentication for demonstration purposes
// since the Replit Auth integration might not be fully configured in all environments.
// In a production app, use proper Supabase/Session handling.

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const userQuery = useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      // Try to fetch current user
      const res = await fetch(api.auth.me.path);
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return await res.json();
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      return await res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      // Redirect based on role
      if (user.role === 'organizer') setLocation('/organizer');
      else setLocation('/exhibitor');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch(api.auth.logout.path, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      setLocation('/auth/login');
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
  };
}
