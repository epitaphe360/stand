import { pgTable, serial, text, integer, timestamp, uuid, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

// === TABLE DEFINITIONS (PostgreSQL with stand_ prefix for epitaphev1 integration) ===

// Events (Salons) - stand_events
export const events = pgTable("stand_events", {
  id: serial("id").primaryKey(),
  organizerId: uuid("organizer_id").notNull(), // References auth.users(id) from Supabase
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  floorPlanJson: jsonb("floor_plan_json"), // JSONB for better performance
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Booths (Stands) - stand_booths
export const booths = pgTable("stand_booths", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  exhibitorId: uuid("exhibitor_id"), // Nullable until assigned, references auth.users(id)
  number: varchar("number", { length: 50 }).notNull(), // Booth number (e.g. A12)
  dimensions: varchar("dimensions", { length: 50 }).notNull(), // e.g. "3x3", "6x3"
  position: jsonb("position").notNull(), // {x, y} as JSONB
  status: varchar("status", { length: 20 }).notNull().default("available"), // available, reserved, booked
  price: integer("price").notNull(), // In cents
  configurationJson: jsonb("configuration_json"), // 3D configuration as JSONB
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Orders - stand_orders
export const orders = pgTable("stand_orders", {
  id: serial("id").primaryKey(),
  exhibitorId: uuid("exhibitor_id").notNull(), // References auth.users(id)
  boothId: integer("booth_id").references(() => booths.id).notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, paid, cancelled
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Assets (Logos, Images, Textures) - stand_assets
export const assets = pgTable("stand_assets", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(), // References auth.users(id)
  type: varchar("type", { length: 50 }).notNull(), // logo, image, texture, video, document
  name: varchar("name", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  url: varchar("url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  metadata: jsonb("metadata"),
  tags: text("tags"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Module Assets (junction table) - stand_module_assets
export const moduleAssets = pgTable("stand_module_assets", {
  id: serial("id").primaryKey(),
  boothId: integer("booth_id").references(() => booths.id).notNull(),
  moduleInstanceId: varchar("module_instance_id", { length: 100 }).notNull(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  face: varchar("face", { length: 20 }).default("front"), // front, back, left, right, top, bottom, all
  position: jsonb("position"),
  opacity: integer("opacity").default(100),
  repeat: varchar("repeat", { length: 20 }).default("no-repeat"), // no-repeat, repeat, repeat-x, repeat-y
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// === RELATIONS ===

export const eventsRelations = relations(events, ({ many }) => ({
  booths: many(booths),
}));

export const boothsRelations = relations(booths, ({ one, many }) => ({
  event: one(events, {
    fields: [booths.eventId],
    references: [events.id],
  }),
  orders: many(orders),
  moduleAssets: many(moduleAssets),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  booth: one(booths, {
    fields: [orders.boothId],
    references: [booths.id],
  }),
}));

export const assetsRelations = relations(assets, ({ many }) => ({
  moduleAssets: many(moduleAssets),
}));

export const moduleAssetsRelations = relations(moduleAssets, ({ one }) => ({
  booth: one(booths, {
    fields: [moduleAssets.boothId],
    references: [booths.id],
  }),
  asset: one(assets, {
    fields: [moduleAssets.assetId],
    references: [assets.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertBoothSchema = createInsertSchema(booths).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const insertModuleAssetSchema = createInsertSchema(moduleAssets).omit({
  id: true,
  createdAt: true
});

// === TYPE EXPORTS ===

export type Event = typeof events.$inferSelect;
export type Booth = typeof booths.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type ModuleAsset = typeof moduleAssets.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertBooth = z.infer<typeof insertBoothSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type InsertModuleAsset = z.infer<typeof insertModuleAssetSchema>;

// === API TYPES ===

export type LoginRequest = { email: string; password: string };
export type AuthResponse = {
  user: {
    id: string;
    email: string;
    role?: string;
  };
  token?: string;
};
