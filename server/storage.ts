// Storage interface for the ChromaKit demo site
// Currently minimal as this is primarily a static demo site

export interface IStorage {
  // Add storage methods as needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage
  }
}

export const storage = new MemStorage();
