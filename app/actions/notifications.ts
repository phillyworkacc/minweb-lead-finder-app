"use server"
import { db } from "@/db";
import { pushNotificationsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import currentUser from "@/utils/user";
import webpush from "@/utils/webpush";

export async function getSubscriptionsForClient (clientId: string) {
   try {
      const userPushNotificationsSubscriptions = await db.select()
         .from(pushNotificationsTable)
         .where(eq(pushNotificationsTable.clientId, clientId));
      
      return userPushNotificationsSubscriptions;
   } catch (err) {
      return [];
   }
}

export async function notifyClientAboutLeads () {
   try {
      const { clientId } = currentUser();
      const userSubscriptions: any[] = await getSubscriptionsForClient(clientId);
   
      for (const userSubscription of userSubscriptions) {
         await webpush.sendNotification(
            userSubscription.subscription as any,
            JSON.stringify({
               title: "90 New Validated Leads",
               body: "Hello",
               url: `/automated-leads`,
            })
         );
      }
      return true;
   } catch (err) {
      return false;
   }
}