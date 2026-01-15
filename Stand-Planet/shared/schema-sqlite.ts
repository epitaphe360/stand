import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Users (Organizers, Exhibitors, Admins)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Hashed or Supabase ID reference
  role: text("role", { enum: ["admin", "organizer", "exhibitor"] }).notNull().default("exhibitor"),
  name: text("name"),
  companyName: text("company_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Events (Salons)
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizerId: integer("organizer_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  location: text("location").notNull(),
  floorPlanJson: text("floor_plan_json"), // JSON stored as text
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Booths (Stands)
export const booths = sqliteTable("booths", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").references(() => events.id).notNull(),
  exhibitorId: integer("exhibitor_id").references(() => users.id), // Nullable until assigned/booked
  number: text("number").notNull(), // Booth number (e.g. A12)
  dimensions: text("dimensions").notNull(), // e.g. "3x3", "6x3"
  position: text("position").notNull(), // JSON {x, y} stored as text
  status: text("status", { enum: ["available", "reserved", "booked"] }).notNull().default("available"),
  price: integer("price").notNull(), // In cents
  configurationJson: text("configuration_json"), // 3D configuration JSON stored as text
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Orders
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  exhibitorId: integer("exhibitor_id").references(() => users.id).notNull(),
  boothId: integer("booth_id").references(() => booths.id).notNull(),
  amount: integer("amount").notNull(),
  status: text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
  paymentIntentId: text("payment_intent_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
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

// === ASSETS (Logos, Images, Textures) ===

export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type", {
    enum: ["logo", "image", "texture", "video", "document"]
  }).notNull(),
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  width: integer("width"),
  height: integer("height"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  metadata: text("metadata"),
  tags: text("tags"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const moduleAssets = sqliteTable("module_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  boothId: integer("booth_id").references(() => booths.id).notNull(),
  moduleInstanceId: text("module_instance_id").notNull(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  face: text("face", {
    enum: ["front", "back", "left", "right", "top", "bottom", "all"]
  }).default("front"),
  position: text("position"),
  opacity: integer("opacity").default(100),
  repeat: text("repeat", {
    enum: ["no-repeat", "repeat", "repeat-x", "repeat-y"]
  }).default("no-repeat"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Relations pour assets
export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, {
    fields: [assets.userId],
    references: [users.id],
  }),
}));

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertModuleAssetSchema = createInsertSchema(moduleAssets).omit({
  id: true,
  createdAt: true
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type ModuleAsset = typeof moduleAssets.$inferSelect;
export type InsertModuleAsset = z.infer<typeof insertModuleAssetSchema>;

// API Types
export type LoginRequest = { email: string; password: string };
export type AuthResponse = { user: User; token?: string };
