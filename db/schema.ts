import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    content: text("content").notNull(),
    date: text("date").notNull(),
    tags: text("tags").notNull().default("[]"),
    cover: text("cover"),
    series: text("series"),
    seriesOrder: integer("series_order").notNull().default(0),
    featured: integer("featured").notNull().default(0),
    draft: integer("draft").notNull().default(0),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    slugUq: uniqueIndex("uk_posts_slug").on(table.slug),
    dateIdx: index("idx_posts_date").on(table.date),
    draftFeaturedIdx: index("idx_posts_draft_featured").on(table.draft, table.featured),
    seriesIdx: index("idx_posts_series").on(table.series, table.seriesOrder),
  }),
);

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;
