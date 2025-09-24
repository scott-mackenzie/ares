import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("client"), // admin, client
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  contactEmail: varchar("contact_email"),
  contactPhone: varchar("contact_phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  clientId: integer("client_id").references(() => clients.id),
  assessmentType: varchar("assessment_type").notNull(),
  status: varchar("status").notNull().default("draft"), // draft, in_progress, completed, delivered
  severity: varchar("severity").default("medium"), // critical, high, medium, low
  executiveSummary: text("executive_summary"),
  dueDate: timestamp("due_date"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Findings table
export const findings = pgTable("findings", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => reports.id),
  title: varchar("title").notNull(),
  description: text("description"),
  severity: varchar("severity").notNull(), // critical, high, medium, low, info
  cvssScore: varchar("cvss_score"),
  impact: text("impact"),
  recommendation: text("recommendation"),
  status: varchar("status").notNull().default("open"), // open, in_progress, fixed, accepted
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// File uploads table for evidence
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  path: varchar("path").notNull(),
  reportId: integer("report_id").references(() => reports.id),
  findingId: integer("finding_id").references(() => findings.id),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Client access permissions
export const clientAccess = pgTable("client_access", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id),
  userId: varchar("user_id").references(() => users.id),
  reportId: integer("report_id").references(() => reports.id),
  canView: boolean("can_view").default(true),
  canDownload: boolean("can_download").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  uploads: many(uploads),
  clientAccess: many(clientAccess),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  reports: many(reports),
  clientAccess: many(clientAccess),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  client: one(clients, {
    fields: [reports.clientId],
    references: [clients.id],
  }),
  createdByUser: one(users, {
    fields: [reports.createdBy],
    references: [users.id],
  }),
  findings: many(findings),
  uploads: many(uploads),
  clientAccess: many(clientAccess),
}));

export const findingsRelations = relations(findings, ({ one, many }) => ({
  report: one(reports, {
    fields: [findings.reportId],
    references: [reports.id],
  }),
  uploads: many(uploads),
}));

export const uploadsRelations = relations(uploads, ({ one }) => ({
  report: one(reports, {
    fields: [uploads.reportId],
    references: [reports.id],
  }),
  finding: one(findings, {
    fields: [uploads.findingId],
    references: [findings.id],
  }),
  uploadedByUser: one(users, {
    fields: [uploads.uploadedBy],
    references: [users.id],
  }),
}));

export const clientAccessRelations = relations(clientAccess, ({ one }) => ({
  client: one(clients, {
    fields: [clientAccess.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [clientAccess.userId],
    references: [users.id],
  }),
  report: one(reports, {
    fields: [clientAccess.reportId],
    references: [reports.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFindingSchema = createInsertSchema(findings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export const insertClientAccessSchema = createInsertSchema(clientAccess).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertFinding = z.infer<typeof insertFindingSchema>;
export type Finding = typeof findings.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;
export type InsertClientAccess = z.infer<typeof insertClientAccessSchema>;
export type ClientAccess = typeof clientAccess.$inferSelect;
