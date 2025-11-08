import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Learning sessions tracked from local file watcher
export const learningSessions = pgTable("learning_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  filepath: text("filepath").notNull(),
  content: text("content").notNull(),
  topics: text("topics").array(),
  summary: text("summary"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertLearningSessionSchema = createInsertSchema(learningSessions).omit({
  id: true,
  timestamp: true,
});

export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;
export type LearningSession = typeof learningSessions.$inferSelect;

// AI-generated recommendations
export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  resourceUrl: text("resource_url"),
  resourceType: text("resource_type"), // 'tutorial', 'documentation', 'video', 'article'
  difficulty: text("difficulty"), // 'beginner', 'intermediate', 'advanced'
  estimatedTime: text("estimated_time"),
  topics: text("topics").array(),
  reason: text("reason"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  timestamp: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Progress summaries
export const progressSummaries = pgTable("progress_summaries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly'
  summary: text("summary").notNull(),
  topicsLearned: text("topics_learned").array(),
  strugglingTopics: text("struggling_topics").array(),
  totalSessions: text("total_sessions"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertProgressSummarySchema = createInsertSchema(progressSummaries).omit({
  id: true,
  timestamp: true,
});

export type InsertProgressSummary = z.infer<typeof insertProgressSummarySchema>;
export type ProgressSummary = typeof progressSummaries.$inferSelect;
