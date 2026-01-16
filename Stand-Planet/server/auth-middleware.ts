import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

/**
 * Middleware d'authentification Supabase pour Express
 * Vérifie le JWT dans le header Authorization
 */

// Initialiser le client Supabase côté serveur
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY ou VITE_SUPABASE_URL manquant - Auth désactivée');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Interface pour étendre Express Request avec l'utilisateur Supabase
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
}

/**
 * Middleware: Vérifier qu'un utilisateur est authentifié
 * Usage: app.get('/api/protected', requireAuth, handler)
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Extraire le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Vérifier le JWT avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...user.user_metadata
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication verification failed'
    });
  }
}

/**
 * Middleware: Optionnellement authentifier (ne bloque pas si pas auth)
 * Usage: app.get('/api/public', optionalAuth, handler)
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Pas d'auth, mais on continue quand même
      return next();
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        ...user.user_metadata
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // On continue même en cas d'erreur
    next();
  }
}

/**
 * Middleware: Vérifier un rôle spécifique
 * Usage: app.post('/api/admin', requireAuth, requireRole('admin'), handler)
 */
export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Required role: ${role}`
      });
    }

    next();
  };
}

/**
 * Middleware: Vérifier que l'utilisateur accède à ses propres ressources
 * Usage: app.get('/api/users/:userId', requireAuth, requireOwnership('userId'), handler)
 */
export function requireOwnership(paramName: string = 'userId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const resourceUserId = req.params[paramName];

    if (req.user.id !== resourceUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only access your own resources'
      });
    }

    next();
  };
}

/**
 * Helper: Créer un utilisateur dans Supabase Auth
 */
export async function createSupabaseUser(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: metadata || {}
  });

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data.user;
}

/**
 * Helper: Supprimer un utilisateur de Supabase Auth
 */
export async function deleteSupabaseUser(userId: string) {
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  return true;
}

/**
 * Helper: Mettre à jour les métadonnées d'un utilisateur
 */
export async function updateSupabaseUserMetadata(userId: string, metadata: any) {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata
  });

  if (error) {
    throw new Error(`Failed to update user metadata: ${error.message}`);
  }

  return data.user;
}

/**
 * Export du client Supabase serveur (service role)
 */
export { supabase as supabaseAdmin };
