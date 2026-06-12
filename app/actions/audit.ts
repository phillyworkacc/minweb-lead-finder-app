"use server"
import { db } from "@/db";
import { websiteAuditsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid"
import { dalDbOperation } from "@/dal/helpers";

export async function insertWebsiteAudit (lead: Lead, audit: WebsiteAudit) {
   try {
      const auditId = uuid();
      const now = `${Date.now()}`;
      const inserted = await dalDbOperation(async () => {
         const res = await db
            .insert(websiteAuditsTable)
            .values({
               auditId,
               leadCollectionsId: lead.leadCollectionsId,
               leadId: lead.leadId,
               auditJson: JSON.stringify(audit),
               date: now
            });
         
         return (res.rowCount === 1);
      })
   
      return inserted.success;
   } catch (e) {
      return false;
   }
}