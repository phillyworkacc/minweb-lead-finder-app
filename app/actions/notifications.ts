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

export async function notifyClientAboutLeads (notificationInfo: any) {
   try {
      const { clientId } = currentUser();
      const userSubscriptions: any[] = await getSubscriptionsForClient(clientId);
   
      for (const userSubscription of userSubscriptions) {
         await webpush.sendNotification(
            userSubscription.subscription as any,
            JSON.stringify({
               title: `🎯 ${notificationInfo.title}`,
               body: `
                  ✅ ${notificationInfo.data.validatedLeads} Leads Validated \n⭐ ${notificationInfo.data.priorityLeads} Priority Leads \n🌐 ${notificationInfo.data.websitesAudited} Websites Audited \n📧 ${notificationInfo.data.emailsFound} Emails Found \n\nTap to review your best opportunities.
               `.trim(),
               url: `/automated-leads`,
            })
         );
      }
      return true;
   } catch (err) {
      return false;
   }
}