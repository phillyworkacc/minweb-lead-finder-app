import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { leadCollectionsTable, leadsTable, websiteAuditsTable } from '@/db/schemas'
import { and, eq } from 'drizzle-orm'
import LoadingLeadCollectionLeadPage from './loading'
import LeadInfoPage from './LeadInfo'

type LeadCollectionProps = {
   params: Promise<{
      leadCollectionId: string;
      leadId: string;
   }>
}

export default async function LeadCollectionLead ({ params }: LeadCollectionProps) {
   const { leadCollectionId, leadId } = await params;
   const leadCollection = await dalDbOperation(async () => {
      const res = await db
         .select()
         .from(leadsTable)
         .leftJoin(websiteAuditsTable, and(
            eq(websiteAuditsTable.leadCollectionsId, leadsTable.leadCollectionsId),
            eq(websiteAuditsTable.leadId, leadsTable.leadId)
         ))
         .where(and(
            eq(leadsTable.leadCollectionsId, leadCollectionId),
            eq(leadsTable.leadId, leadId)
         ))
         .limit(1);

      const res2 = await db.select()
         .from(leadCollectionsTable)
         .where(eq(leadCollectionsTable.leadCollectionsId, leadCollectionId))
         .limit(1);
      
      return {
         leads: res[0],
         leadCollectionInfo: res2[0]
      };
   })

   if (leadCollection.success) {
      return <LeadInfoPage 
         lead={JSON.parse(JSON.stringify(leadCollection.data.leads.leads))}
         leadCollectionName={leadCollection.data.leadCollectionInfo.name || ''}
         websiteAuditReport={JSON.parse(JSON.stringify(leadCollection.data.leads.website_audits))}
      />
   } else {
      return <LoadingLeadCollectionLeadPage />
   }
}
