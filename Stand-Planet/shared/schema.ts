import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Users (Organizers, Exhibitors, Admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed or Supabase ID reference
  role: text("role", { enum: ["admin", "organizer", "exhibitor"] }).notNull().default("exhibitor"),
  name: text("name"),
  companyName: text("company_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events (Salons)
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  organizerId: integer("organizer_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  floorPlanJson: jsonb("floor_plan_json"), // 2D layout of the hall
  createdAt: timestamp("created_at").defaultNow(),
});

// Booths (Stands)
export const booths = pgTable("booths", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  exhibitorId: integer("exhibitor_id").references(() => users.id), // Nullable until assigned/booked
  number: text("number").notNull(), // Booth number (e.g. A12)
  dimensions: text("dimensions").notNull(), // e.g. "3x3", "6x3"
  position: jsonb("position").notNull(), // {x, y} on floor plan
  status: text("status", { enum: ["available", "reserved", "booked"] }).notNull().default("available"),
  price: integer("price").notNull(), // In cents
  configurationJson: jsonb("configuration_json"), // 3D configuration (walls, furniture, textures)
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  exhibitorId: integer("exhibitor_id").references(() => users.id).notNull(),
  boothId: integer("booth_id").references(() => booths.id).notNull(),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  organizedEvents: many(events, { relationName: "organizer" }),
  boothBookings: many(booths, { relationName: "exhibitor" }),
  orders: many(orders),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
    relationName: "organizer"
  }),
  booths: many(booths),
}));

export const boothsRelations = relations(booths, ({ one, many }) => ({
  event: one(events, {
    fields: [booths.eventId],
    references: [events.id],
  }),
  exhibitor: one(users, {
    fields: [booths.exhibitorId],
    references: [users.id],
    relationName: "exhibitor"
  }),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  exhibitor: one(users, {
    fields: [orders.exhibitorId],
    references: [users.id],
  }),
  booth: one(booths, {
    fields: [orders.boothId],
    references: [booths.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertBoothSchema = createInsertSchema(booths).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Booth = typeof booths.$inferSelect;
export type Order = typeof orders.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertBooth = z.infer<typeof insertBoothSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// API Types
export type LoginRequest = { email: string; password: string };
export type AuthResponse = { user: User; token?: string };
