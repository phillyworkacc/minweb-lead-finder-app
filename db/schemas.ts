import { boolean, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";

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

export const automatedLeadListTable = pgTable("automated_lead_list", {
   id: serial("id").primaryKey(),
   leadListId: text("lead_list_id"),
   name: text("name"),
   date: text("date"),
   folders: text("folders")
});

export const automatedLeadsTable = pgTable("automated_leads", {
   id: serial("id").primaryKey(),
   leadListId: text("lead_list_id"),
   leadId: text("lead_id"),
   name: text("name"),
   email: text("email"),
   address: text("address"),
   phoneNumber: text("phone_number"),
   website: text("website"),
   called: text("called"),
   starred: boolean("starred"),
   date: text("date"),
   websiteScrapedInfo: text("website_scraped_info"),
   audit: text("audit"),
   leadScore: text("lead_score"),
   offersForLead: text("offers_for_lead"),
   outreachPrompt: text("outreach_prompt"),
});

export const leadAutomationQueueTable = pgTable("lead_automation_queue", {
   id: serial("id").primaryKey(),
   niche: text("niche"),
   location: text("location"),
   createdAt: text("created_at"),
   completedAt: text("completed_at")
});

export const pushNotificationsTable = pgTable("push_notifications", {
   id: serial("id").primaryKey(),
   clientId: text("client_id"),
   subscription: jsonb("subscription"),
   createdAt: text("created_at"),
   updatedAt: text("updated_at")
});
