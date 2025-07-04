import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import os from "os";
import path from "path";

import * as schema from "./schema";

function ensureDatabaseFilePath(): string {
  const documentsPath = path.join(os.homedir(), "Documents");
  const dbDir = path.join(documentsPath, "easy-display", "db");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  return path.join(dbDir, "data.sqlite");
}

function initDatabase(dbFilePath: string) {
  const db = new Database(dbFilePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS screen (
      id TEXT PRIMARY KEY,
      alias TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
      updated_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS slide (
      id TEXT PRIMARY KEY,
      screen_id TEXT NOT NULL,
      file_path TEXT,
      duration INTEGER,
      show BOOLEAN NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL,
      type TEXT CHECK(type IN ('image', 'video', 'etc')),
      rotate INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (screen_id) REFERENCES screen(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      ip TEXT NOT NULL,
      name TEXT NOT NULL,
      alias TEXT NOT NULL,
      screen_id TEXT,
      FOREIGN KEY (screen_id) REFERENCES screen(id) ON DELETE SET NULL
    );
  `);

  return db;
}

const dbFilePath = ensureDatabaseFilePath();
const sqlite = initDatabase(dbFilePath);

export const db = drizzle({ client: sqlite, schema });
