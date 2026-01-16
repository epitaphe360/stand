import type { Express } from "express";
import express from "express";
import type { Server } from "http";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema-sqlite";
import { requireAuth, optionalAuth } from "./auth-middleware";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Health Check (for Railway) ===
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // === Auth ===
  // MIGRATION SUPABASE: L'authentification est maintenant gérée côté client avec Supabase Auth
  // Les routes auth ci-dessous ne sont plus utilisées. L'auth se fait directement via Supabase.
  // Les routes API utilisent le middleware requireAuth pour vérifier le JWT Supabase.

  // Ces endpoints sont conservés pour compatibilité mais ne sont plus utilisés
  app.post(api.auth.login.path, async (req, res) => {
    res.status(410).json({
      message: "This endpoint is deprecated. Please use Supabase Auth directly from the client.",
      migration: "Use supabase.auth.signInWithPassword() instead"
    });
  });

  app.post(api.auth.register.path, async (req, res) => {
    res.status(410).json({
      message: "This endpoint is deprecated. Please use Supabase Auth directly from the client.",
      migration: "Use supabase.auth.signUp() instead"
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    res.status(410).json({
      message: "This endpoint is deprecated. Please use Supabase Auth directly from the client.",
      migration: "Use supabase.auth.getUser() instead"
    });
  });

  app.post(api.auth.logout.path, (req, res) => {
    res.status(410).json({
      message: "This endpoint is deprecated. Please use Supabase Auth directly from the client.",
      migration: "Use supabase.auth.signOut() instead"
    });
  });

  // === Events ===
  // GET public (optionalAuth = peut être authentifié ou non)
  app.get(api.events.list.path, optionalAuth, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, optionalAuth, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  // POST requires authentication
  app.post(api.events.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Booths ===
  // GET public
  app.get(api.booths.list.path, optionalAuth, async (req, res) => {
    const booths = await storage.getBoothsByEvent(Number(req.params.eventId));
    res.json(booths);
  });

  app.get(api.booths.get.path, optionalAuth, async (req, res) => {
    const booth = await storage.getBooth(Number(req.params.id));
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json(booth);
  });

  // PATCH requires authentication
  app.patch(api.booths.updateConfig.path, requireAuth, async (req, res) => {
    try {
      const { configurationJson } = api.booths.updateConfig.input.parse(req.body);
      const booth = await storage.updateBoothConfig(Number(req.params.id), configurationJson);
      res.json(booth);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Orders ===
  // POST requires authentication
  app.post(api.orders.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Assets / Uploads ===
  // MIGRATION SUPABASE: Utilise Supabase Storage au lieu du stockage local
  const { upload, handleAssetUpload, getUserAssets, deleteAsset } = await import("./supabase-storage");

  // POST/DELETE require authentication
  app.post("/api/assets/upload", requireAuth, upload.single("file"), handleAssetUpload);

  app.get("/api/assets", requireAuth, getUserAssets);

  app.delete("/api/assets/:id", requireAuth, deleteAsset);

  // === Module Assets (Branding) ===
  // Récupérer les assets appliqués à un module
  app.get("/api/booths/:boothId/modules/:moduleInstanceId/assets", optionalAuth, async (req, res) => {
    try {
      const { boothId, moduleInstanceId } = req.params;
      const { db } = await import("./db");
      const { moduleAssets, assets } = await import("@shared/schema-sqlite");
      const { eq, and } = await import("drizzle-orm");

      const result = await db
        .select()
        .from(moduleAssets)
        .leftJoin(assets, eq(moduleAssets.assetId, assets.id))
        .where(and(
          eq(moduleAssets.boothId, parseInt(boothId)),
          eq(moduleAssets.moduleInstanceId, moduleInstanceId)
        ));

      res.json({ assets: result });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Appliquer un asset à un module (requires authentication)
  app.post("/api/booths/:boothId/modules/:moduleInstanceId/assets", requireAuth, async (req, res) => {
    try {
      const { boothId, moduleInstanceId } = req.params;
      const { assetId, face, position, opacity, repeat } = req.body;
      const { db } = await import("./db");
      const { moduleAssets } = await import("@shared/schema-sqlite");

      const result = await db.insert(moduleAssets).values({
        boothId: parseInt(boothId),
        moduleInstanceId,
        assetId: parseInt(assetId),
        face: face || 'front',
        position: position ? JSON.stringify(position) : null,
        opacity: opacity || 100,
        repeat: repeat || 'no-repeat',
      }).returning();

      res.status(201).json({ moduleAsset: result[0] });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Supprimer un asset d'un module (requires authentication)
  app.delete("/api/booths/:boothId/modules/:moduleInstanceId/assets/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { db } = await import("./db");
      const { moduleAssets } = await import("@shared/schema-sqlite");
      const { eq } = await import("drizzle-orm");

      await db.delete(moduleAssets).where(eq(moduleAssets.id, parseInt(id)));

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Servir les fichiers uploadés statiquement
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Seed Data
  await seed();

  return httpServer;
}

async function seed() {
  const existingEvents = await storage.getEvents();
  if (existingEvents.length > 0) return;

  console.log("Seeding database...");

  // Create Organizer
  const organizer = await storage.createUser({
    email: "organizer@standplanet.com",
    password: "password123",
    role: "organizer",
    name: "Global Tech Events",
    companyName: "Tech Events Inc."
  });

  // Create Exhibitor
  const exhibitor = await storage.createUser({
    email: "exhibitor@startup.com",
    password: "password123",
    role: "exhibitor",
    name: "Startup CEO",
    companyName: "NextGen AI"
  });

  // Create Event
  const event = await storage.createEvent({
    organizerId: organizer.id,
    name: "Tech Expo 2024",
    description: "The biggest tech conference of the year.",
    location: "Paris Convention Center",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-18"),
    floorPlanJson: JSON.stringify({ width: 50, height: 30 }) // Simple mock dimensions
  });

  // Create Booths
  await storage.createBooth({
    eventId: event.id,
    number: "A1",
    dimensions: "3x3",
    position: JSON.stringify({ x: 10, y: 10 }),
    status: "available",
    price: 150000, // $1500.00
    configurationJson: JSON.stringify({ walls: [], furniture: [] })
  });

  await storage.createBooth({
    eventId: event.id,
    number: "A2",
    dimensions: "6x3",
    position: JSON.stringify({ x: 20, y: 10 }),
    status: "reserved",
    exhibitorId: exhibitor.id,
    price: 250000,
    configurationJson: JSON.stringify({ walls: [], furniture: [{ type: "desk", x: 1, y: 1 }] })
  });

  console.log("Seeding complete.");
}
