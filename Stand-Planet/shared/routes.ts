import { z } from 'zod';
import { insertUserSchema, insertEventSchema, insertBoothSchema, insertOrderSchema, users, events, booths, orders } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ username: z.string(), password: z.string() }), // Using username/password for Replit Auth simplicity, but schema has email
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.void(),
      },
    }
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events',
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:id',
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events',
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  booths: {
    list: {
      method: 'GET' as const,
      path: '/api/events/:eventId/booths',
      responses: {
        200: z.array(z.custom<typeof booths.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/booths/:id',
      responses: {
        200: z.custom<typeof booths.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateConfig: {
      method: 'PATCH' as const,
      path: '/api/booths/:id/config',
      input: z.object({ configurationJson: z.any() }), // JSONB
      responses: {
        200: z.custom<typeof booths.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders',
      input: insertOrderSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
