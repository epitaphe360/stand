import type { Express } from "express";
import express from "express";
import type { Server } from "http";
import path from "path";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Auth (Mock/Simple) ===
  // In a real scenario, use Replit Auth or Supabase Auth. 
  // Here we provide endpoints that match the client's expectation for a custom auth flow or mock.
  
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = api.auth.login.input.parse(req.body);
      // Simple mock check or DB check
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
         return res.status(401).json({ message: "Invalid credentials" });
      }
      // In a real app, set session/cookie here
      res.json(user);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.get(api.auth.me.path, async (req, res) => {
    // Mock: return 401 as we don't have session persistence in this simple scaffolding
    // The client should handle this by showing login
    res.status(401).json({ message: "Not authenticated" });
  });

  app.post(api.auth.logout.path, (req, res) => {
    res.json({});
  });

  // === Events ===
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Booths ===
  app.get(api.booths.list.path, async (req, res) => {
    const booths = await storage.getBoothsByEvent(Number(req.params.eventId));
    res.json(booths);
  });

  app.get(api.booths.get.path, async (req, res) => {
    const booth = await storage.getBooth(Number(req.params.id));
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json(booth);
  });

  app.patch(api.booths.updateConfig.path, async (req, res) => {
    try {
      const { configurationJson } = api.booths.updateConfig.input.parse(req.body);
      const booth = await storage.updateBoothConfig(Number(req.params.id), configurationJson);
      res.json(booth);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Orders ===
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  // === Assets / Uploads ===
  const { upload, handleAssetUpload, getUserAssets, deleteAsset } = await import("./uploads");

  app.post("/api/assets/upload", upload.single("file"), handleAssetUpload);

  app.get("/api/assets", getUserAssets);

  app.delete("/api/assets/:id", deleteAsset);

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
    floorPlanJson: { width: 50, height: 30 } // Simple mock dimensions
  });

  // Create Booths
  await storage.createBooth({
    eventId: event.id,
    number: "A1",
    dimensions: "3x3",
    position: { x: 10, y: 10 },
    status: "available",
    price: 150000, // $1500.00
    configurationJson: { walls: [], furniture: [] }
  });

  await storage.createBooth({
    eventId: event.id,
    number: "A2",
    dimensions: "6x3",
    position: { x: 20, y: 10 },
    status: "reserved",
    exhibitorId: exhibitor.id,
    price: 250000,
    configurationJson: { walls: [], furniture: [{ type: "desk", x: 1, y: 1 }] }
  });

  console.log("Seeding complete.");
}
