import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const screens = sqliteTable(
  "screen",
  {
    id: text("id").primaryKey(),
    alias: text("alias").notNull(),
    direction: text("direction", { enum: ["horizontal", "vertical"] })
      .notNull()
      .default("horizontal"),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
  },
  (screen) => [unique("unique_alias").on(screen.alias)],
);

export const slides = sqliteTable("slide", {
  id: text("id").primaryKey(),
  screenId: text("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }),
  filePath: text("file_path").notNull(),
  duration: integer("duration").notNull(),
  show: integer("show", { mode: "boolean" }).notNull().default(true),
  order: integer("order").notNull().default(0),
});

export const screenRelations = relations(screens, ({ many }) => ({
  slides: many(slides),
}));

export const slideRelations = relations(slides, ({ one }) => ({
  screen: one(screens, {
    fields: [slides.screenId],
    references: [screens.id],
  }),
}));
