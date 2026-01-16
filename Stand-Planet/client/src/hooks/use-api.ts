import { supabase } from "@/lib/supabase";

/**
 * Hook pour faire des appels API avec authentification automatique
 *
 * MIGRATION SUPABASE:
 * - Ajoute automatiquement le JWT token dans les headers
 * - Wrapper autour de fetch pour simplifier les appels
 */

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Récupérer le token Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // Ajouter le token dans les headers si disponible
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper pour faire des requêtes GET authentifiées
 */
export async function apiGet<T>(url: string): Promise<T> {
  const res = await authenticatedFetch(url);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Helper pour faire des requêtes POST authentifiées
 */
export async function apiPost<T>(url: string, data: any): Promise<T> {
  const res = await authenticatedFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Helper pour faire des requêtes PATCH authentifiées
 */
export async function apiPatch<T>(url: string, data: any): Promise<T> {
  const res = await authenticatedFetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Helper pour faire des requêtes DELETE authentifiées
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const res = await authenticatedFetch(url, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
