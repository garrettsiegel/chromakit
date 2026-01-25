import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ChromaKit Demo Site - minimal backend
  // API routes can be added here if needed

  return httpServer;
}
