import { users, events, booths, orders, type User, type InsertUser, type Event, type InsertEvent, type Booth, type InsertBooth, type Order, type InsertOrder } from "@shared/schema-sqlite";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // Using username for simple auth match
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Booths
  getBoothsByEvent(eventId: number): Promise<Booth[]>;
  getBooth(id: number): Promise<Booth | undefined>;
  createBooth(booth: InsertBooth): Promise<Booth>;
  updateBoothConfig(id: number, config: any): Promise<Booth>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // In this mock auth, we might treat email as username or vice versa. 
    // Schema has email. Let's assume username param might be email.
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Booths
  async getBoothsByEvent(eventId: number): Promise<Booth[]> {
    return await db.select().from(booths).where(eq(booths.eventId, eventId));
  }

  async getBooth(id: number): Promise<Booth | undefined> {
    const [booth] = await db.select().from(booths).where(eq(booths.id, id));
    return booth;
  }

  async createBooth(booth: InsertBooth): Promise<Booth> {
    const [newBooth] = await db.insert(booths).values(booth).returning();
    return newBooth;
  }

  async updateBoothConfig(id: number, config: any): Promise<Booth> {
    const [updated] = await db.update(booths)
      .set({ configurationJson: config })
      .where(eq(booths.id, id))
      .returning();
    return updated;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
}

export const storage = new DatabaseStorage();
