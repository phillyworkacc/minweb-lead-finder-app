"use server"
import { dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { automatedLeadListTable, automatedLeadsTable, leadAutomationQueueTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";


export async function getAllAutomatedLeadLists (): Promise<AutomatedLeadList[]> {
   try {
      const automatedLeadLists = await dalDbOperation(async () => {
         const res = await db
            .select({
               leadListId: automatedLeadListTable.leadListId,
               name: automatedLeadListTable.name,
               folders: automatedLeadListTable.folders,
               date: automatedLeadListTable.date,
               leadCount: db.$count(
                  automatedLeadsTable,
                  eq(automatedLeadsTable.leadListId, automatedLeadListTable.leadListId)
               )
            })
            .from(automatedLeadListTable)
            .orderBy(desc(automatedLeadListTable.date));
         
         return res;
      })
      return automatedLeadLists.success ? automatedLeadLists.data as any[] : [];
   } catch (e) {
      return [];
   }
}

export async function addNewLeadAutomationQueue (niche: string) {
   try {
      const cities = [
         "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
         "Sheffield", "Bristol", "Nottingham", "Leicester", "Newcastle upon Tyne",
         "Coventry", "Southampton", "Portsmouth", "Hull", "Dundee",
         "Stoke-on-Trent", "Bradford", "Glasgow", "Edinburgh", "Aberdeen"
      ];
      const valuesToInsert = cities.map(city => ({
         niche, location: city.toLowerCase(),
         createdAt: Date.now().toString(), completedAt: null
      }))
      
      const inserted = await dalDbOperation(async () => {
         const res = await db.insert(leadAutomationQueueTable).values(valuesToInsert);
         return (res.rowCount > 0);
      })

      return inserted.success ? inserted.data : false;
   } catch (e) {
      return false;
   }
}

export async function updateAutomatedLeadStarred (leadId: string, leadListId: string, starred: boolean) {
   try {
      const updated = await dalDbOperation(async () => {
         const res = await db
            .update(automatedLeadsTable)
            .set({ starred })
            .where(and(
               eq(automatedLeadsTable.leadListId, leadListId),
               eq(automatedLeadsTable.leadId, leadId)
            ));

         return (res.rowCount === 1);
      })
   
      return updated.success ? updated.data : false;
   } catch (e) {
      return false;
   }
}

export async function deleteAutomatedLeadList (leadListId: string) {
   try {
      const deleted = await dalDbOperation(async () => {
         const res = await db.delete(automatedLeadListTable)
            .where(eq(automatedLeadListTable.leadListId, leadListId));
         
         const res2 = await db.delete(automatedLeadsTable)
            .where(eq(automatedLeadsTable.leadListId, leadListId));

         return (res.rowCount === 1 && res2.rowCount >= 0);
      })
   
      return deleted.success ? deleted.data : false;
   } catch (e) {
      return false;
   }
}

export async function getAllLeadAutomations (): Promise<any[] | false> {
   try {
      const queue = await dalDbOperation(async () => {
         const res = await db.select()
            .from(leadAutomationQueueTable)
            .orderBy(desc(leadAutomationQueueTable.createdAt), desc(leadAutomationQueueTable.completedAt));
         return res
      })

      return queue.success ? queue.data : false;
   } catch (e) {
      return false;
   }
}

export async function updateLeadQueueItemPriority (leadQueueItemId: number, newPriority: string): Promise<boolean> {
   try {
      const updated = await dalDbOperation(async () => {
         const res = await db.update(leadAutomationQueueTable)
            .set({ priority: newPriority })
            .where(eq(leadAutomationQueueTable.id, leadQueueItemId));
         return res.rowCount === 1;
      })

      return updated.success ? updated.data : false;
   } catch (e) {
      return false;
   }
}

