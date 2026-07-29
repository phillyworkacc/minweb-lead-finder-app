import { bigint, boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const leadsTable = pgTable("leads", {
   id: serial("id").primaryKey(),
   leadCollectionsId: text("lead_collections_id"),
   leadId: text("lead_id"),
   name: text("name"),
   email: text("email"),
   address: text("address"),
   phoneNumber: text("phone_number"),
   website: text("website"),
   called: text("called"),
   starred: boolean("starred"),
   date: text("date")
});

export const leadCollectionsTable = pgTable("lead_collections", {
   id: serial("id").primaryKey(),
   leadCollectionsId: text("lead_collections_id"),
   name: text("name"),
   date: text("date"),
   folders: text("folders")
});

export const foldersTable = pgTable("folders", {
   id: serial("id").primaryKey(),
   folderId: text("folder_id"),
   name: text("name")
});

export const websiteAuditsTable = pgTable("website_audits", {
   id: serial("id").primaryKey(),
   auditId: text("audit_id"),
   leadCollectionsId: text("lead_collections_id"),
   leadId: text("lead_id"),
   auditJson: text("audit_json"),
   date: text("date"),
});