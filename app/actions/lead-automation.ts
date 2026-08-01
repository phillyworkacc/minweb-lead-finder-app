"use server"
import { dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { leadAutomationQueueTable } from "@/db/schemas";

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

      return inserted.success;
   } catch (e) {
      return false;
   }
}