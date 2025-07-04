import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const screens = sqliteTable(
  "screen",
  {
    id: text("id").primaryKey(),
    alias: text("alias").notNull(),
    createdAt: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (screen) => [unique("unique_alias").on(screen.alias)],
);

export const slides = sqliteTable("slide", {
  id: text("id").primaryKey(),
  screenId: text("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }),
  filePath: text("file_path"),
  duration: integer("duration"),
  show: integer("show", { mode: "boolean" }).notNull().default(true),
  order: integer("order").notNull().default(0),
  type: text("type", { enum: ["image", "video", "etc"] }),
  rotate: integer("rotate").notNull().default(0),
});

export const screenRelations = relations(screens, ({ many }) => ({
  slides: many(slides),
  devices: many(devices),
}));

export const slideRelations = relations(slides, ({ one }) => ({
  screen: one(screens, {
    fields: [slides.screenId],
    references: [screens.id],
  }),
}));

export const devices = sqliteTable("devices", {
  id: text("id").primaryKey(),
  ip: text("ip").notNull(),
  deviceId: text("device_id").notNull(),
  name: text("name").notNull(),
  alias: text("alias").notNull(),
  screenId: text("screen_id").references(() => screens.id, { onDelete: "set null" }),
});

export const deviceRelations = relations(devices, ({ one }) => ({
  screen: one(screens, {
    fields: [devices.screenId],
    references: [screens.id],
  }),
}));
