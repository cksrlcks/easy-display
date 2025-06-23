import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const screens = sqliteTable(
  "screen",
  {
    id: text("id").primaryKey(),
    alias: text("alias").notNull(),
  },
  (screen) => ({
    uniqueAlias: unique("unique_alias").on(screen.alias),
  }),
);

export const slides = sqliteTable("slide", {
  id: text("id").primaryKey(),
  screenId: text("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }),

  filePath: text("file_path").notNull(),
  type: text("type", { enum: ["image", "video"] }).notNull(),
  order: integer("order").notNull(),
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
