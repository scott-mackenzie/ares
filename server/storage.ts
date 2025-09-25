import {
  users,
  clients,
  reports,
  findings,
  uploads,
  clientAccess,
  type User,
  type UpsertUser,
  type Client,
  type InsertClient,
  type Report,
  type InsertReport,
  type Finding,
  type InsertFinding,
  type Upload,
  type InsertUpload,
  type ClientAccess,
  type InsertClientAccess,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  
  // Report operations
  getReports(): Promise<(Report & { client: Client | null; createdByUser: User | null })[]>;
  getReport(id: number): Promise<(Report & { client: Client | null; createdByUser: User | null }) | undefined>;
  getReportsByClient(clientId: number): Promise<(Report & { client: Client | null; createdByUser: User | null })[]>;
  getReportsForUser(userId: string): Promise<(Report & { client: Client | null; createdByUser: User | null })[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<InsertReport>): Promise<Report>;
  deleteReport(id: number): Promise<void>;
  
  // Finding operations
  getFindings(): Promise<Finding[]>;
  getFindingsByReport(reportId: number): Promise<Finding[]>;
  createFinding(finding: InsertFinding): Promise<Finding>;
  updateFinding(id: number, finding: Partial<InsertFinding>): Promise<Finding>;
  deleteFinding(id: number): Promise<void>;
  
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUploadsByReport(reportId: number): Promise<Upload[]>;
  getUploadsByFinding(findingId: number): Promise<Upload[]>;
  deleteUpload(id: number): Promise<void>;
  
  // Client access operations
  grantClientAccess(access: InsertClientAccess): Promise<ClientAccess>;
  getUserReportAccess(userId: string, reportId: number): Promise<ClientAccess | undefined>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    critical: number;
    high: number;
    reports: number;
    remediated: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async deleteClient(id: number): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Report operations
  async getReports(): Promise<(Report & { client: Client | null; createdByUser: User | null })[]> {
    const results = await db
      .select()
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .leftJoin(users, eq(reports.createdBy, users.id))
      .orderBy(desc(reports.createdAt));
    
    return results.map(row => ({
      ...row.reports,
      client: row.clients,
      createdByUser: row.users,
    }));
  }

  async getReport(id: number): Promise<(Report & { client: Client | null; createdByUser: User | null }) | undefined> {
    const [result] = await db
      .select()
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .leftJoin(users, eq(reports.createdBy, users.id))
      .where(eq(reports.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.reports,
      client: result.clients,
      createdByUser: result.users,
    };
  }

  async getReportsByClient(clientId: number): Promise<(Report & { client: Client | null; createdByUser: User | null })[]> {
    const results = await db
      .select()
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .leftJoin(users, eq(reports.createdBy, users.id))
      .where(eq(reports.clientId, clientId))
      .orderBy(desc(reports.createdAt));
    
    return results.map(row => ({
      ...row.reports,
      client: row.clients,
      createdByUser: row.users,
    }));
  }

  async getReportsForUser(userId: string): Promise<(Report & { client: Client | null; createdByUser: User | null })[]> {
    const results = await db
      .select()
      .from(reports)
      .leftJoin(clients, eq(reports.clientId, clients.id))
      .leftJoin(users, eq(reports.createdBy, users.id))
      .innerJoin(clientAccess, and(
        eq(clientAccess.reportId, reports.id),
        eq(clientAccess.userId, userId),
        eq(clientAccess.canView, true)
      ))
      .orderBy(desc(reports.createdAt));
    
    return results.map(row => ({
      ...row.reports,
      client: row.clients,
      createdByUser: row.users,
    }));
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async updateReport(id: number, report: Partial<InsertReport>): Promise<Report> {
    const [updatedReport] = await db
      .update(reports)
      .set({ ...report, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteReport(id: number): Promise<void> {
    await db.delete(reports).where(eq(reports.id, id));
  }

  // Finding operations
  async getFindings(): Promise<Finding[]> {
    return await db.select().from(findings).orderBy(desc(findings.createdAt));
  }

  async getFindingsByReport(reportId: number): Promise<Finding[]> {
    return await db
      .select()
      .from(findings)
      .where(eq(findings.reportId, reportId))
      .orderBy(desc(findings.createdAt));
  }

  async createFinding(finding: InsertFinding): Promise<Finding> {
    const [newFinding] = await db.insert(findings).values(finding).returning();
    return newFinding;
  }

  async updateFinding(id: number, finding: Partial<InsertFinding>): Promise<Finding> {
    const [updatedFinding] = await db
      .update(findings)
      .set({ ...finding, updatedAt: new Date() })
      .where(eq(findings.id, id))
      .returning();
    return updatedFinding;
  }

  async deleteFinding(id: number): Promise<void> {
    await db.delete(findings).where(eq(findings.id, id));
  }

  // Upload operations
  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  async getUploadsByReport(reportId: number): Promise<Upload[]> {
    return await db
      .select()
      .from(uploads)
      .where(eq(uploads.reportId, reportId))
      .orderBy(desc(uploads.createdAt));
  }

  async getUploadsByFinding(findingId: number): Promise<Upload[]> {
    return await db
      .select()
      .from(uploads)
      .where(eq(uploads.findingId, findingId))
      .orderBy(desc(uploads.createdAt));
  }

  async deleteUpload(id: number): Promise<void> {
    await db.delete(uploads).where(eq(uploads.id, id));
  }

  // Client access operations
  async grantClientAccess(access: InsertClientAccess): Promise<ClientAccess> {
    const [newAccess] = await db.insert(clientAccess).values(access).returning();
    return newAccess;
  }

  async getUserReportAccess(userId: string, reportId: number): Promise<ClientAccess | undefined> {
    const [access] = await db
      .select()
      .from(clientAccess)
      .where(and(
        eq(clientAccess.userId, userId),
        eq(clientAccess.reportId, reportId)
      ));
    return access;
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    critical: number;
    high: number;
    reports: number;
    remediated: number;
  }> {
    const [criticalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(findings)
      .where(eq(findings.severity, "critical"));

    const [highCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(findings)
      .where(eq(findings.severity, "high"));

    const [reportsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reports)
      .where(eq(reports.status, "in_progress"));

    const [remediatedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(findings)
      .where(eq(findings.status, "fixed"));

    return {
      critical: criticalCount.count,
      high: highCount.count,
      reports: reportsCount.count,
      remediated: remediatedCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
