"use server"
import { db } from "@/db";
import { leadCollectionsTable, leadsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid"
import { dalDbOperation } from "@/dal/helpers";
import { titleCase } from "@/lib/str";
import { and, eq } from "drizzle-orm";

export async function createLeadCollection (name: string, folderName: string) {
   try {
      const leadCollectionsId = uuid();
      const leadCollectionsName = titleCase(name);
      const now = Date.now().toString();
      const folders = ["all", folderName].join(",");
   
      const inserted = await dalDbOperation(async () => {
         const res = await db.insert(leadCollectionsTable)
            .values({
               leadCollectionsId,
               name: leadCollectionsName,
               folders, date: now
            });
         
         return (res.rowCount === 1);
      })
   
      return inserted.success;
   } catch (e) {
      return false;
   }
}

export async function insertLeadsWithNewLeadCollection (leads: LeadItemFormatted[], leadCollectionName: string) {
   try {
      const leadCollectionsId = uuid();
      const leadCollectionsName = titleCase(leadCollectionName);
      const now = `${Date.now()}`;

      const formattedLeads = leads.map(lead => ({
         leadCollectionsId,
         leadId: uuid(),
         name: lead.name,
         email: lead.email,
         address: lead.address,
         phoneNumber: lead.phoneNumber,
         website: lead.website, called: "Not Called",
         date: now
      }));
   
      const inserted = await dalDbOperation(async () => {
         const res = await db
            .insert(leadCollectionsTable)
            .values({
               leadCollectionsId,
               name: leadCollectionsName,
               date: now
            });

         const res2 = await db
            .insert(leadsTable)
            .values(formattedLeads);
         
         return (res.rowCount === 1 && res2.rowCount === 1);
      })
   
      return inserted.success;
   } catch (e) {
      return false;
   }
}

export async function insertLeadsWithExistingLeadCollection (leads: LeadItemFormatted[], leadCollectionsId: string) {
   try {
      const formattedLeads = leads.map(lead => ({
         leadCollectionsId,
         leadId: uuid(),
         name: lead.name,
         email: lead.email,
         address: lead.address,
         phoneNumber: lead.phoneNumber,
         website: lead.website, called: "Not Called",
         date: Date.now().toString()
      }));
   
      const inserted = await dalDbOperation(async () => {
         const res = await db.insert(leadsTable).values(formattedLeads);
         return (res.rowCount === 1);
      })
   
      return inserted.success;
   } catch (e) {
      return false;
   }
}

export async function updateLeadColdCall (leadId: string, leadCollectionsId: string, callStatus: string) {
   try {
      const updated = await dalDbOperation(async () => {
         const res = await db
            .update(leadsTable)
            .set({ called: callStatus })
            .where(and(
               eq(leadsTable.leadCollectionsId, leadCollectionsId),
               eq(leadsTable.leadId, leadId)
            ));

         return (res.rowCount === 1);
      })
   
      return updated.success;
   } catch (e) {
      return false;
   }
}

export async function updateLeadStarred (leadId: string, leadCollectionsId: string, starred: boolean) {
   try {
      const updated = await dalDbOperation(async () => {
         const res = await db
            .update(leadsTable)
            .set({ starred })
            .where(and(
               eq(leadsTable.leadCollectionsId, leadCollectionsId),
               eq(leadsTable.leadId, leadId)
            ));

         return (res.rowCount === 1);
      })
   
      return updated.success;
   } catch (e) {
      return false;
   }
}

export async function editLeadCollectionName (leadCollectionsId: string, newName: string) {
   try {
      const updated = await dalDbOperation(async () => {
         const res = await db.update(leadCollectionsTable)
            .set({ name: newName })   
            .where(eq(leadCollectionsTable.leadCollectionsId, leadCollectionsId));
         
         return (res.rowCount === 1);
      })
   
      return updated.success;
   } catch (e) {
      return false;
   }
}

export async function deleteLeadCollection (leadCollectionsId: string) {
   try {
      const deleted = await dalDbOperation(async () => {
         const res = await db.delete(leadCollectionsTable)
            .where(eq(leadCollectionsTable.leadCollectionsId, leadCollectionsId));
         
         const res2 = await db.delete(leadsTable)
            .where(eq(leadsTable.leadCollectionsId, leadCollectionsId));

         return (res.rowCount === 1 && res2.rowCount >= 1);
      })
   
      return deleted.success;
   } catch (e) {
      return false;
   }
}

export async function deleteLeadFromCollection (leadCollectionsId: string, leadId: string) {
   try {
      const deleted = await dalDbOperation(async () => {
         const res = await db.delete(leadsTable)
            .where(and(
               eq(leadsTable.leadCollectionsId, leadCollectionsId),
               eq(leadsTable.leadId, leadId)
            ));

         return (res.rowCount === 1);
      })
      return deleted.success;
   } catch (e) {
      return false;
   }
}