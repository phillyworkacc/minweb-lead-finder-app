import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { leadCollectionsTable, leadsTable } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import LeadsPage from './Leads'
import LoadingLeadCollectionPage from './loading'

type LeadCollectionProps = {
   params: Promise<{
      leadCollectionId: string;
   }>
}

export default async function LeadCollection ({ params }: LeadCollectionProps) {
   const { leadCollectionId } = await params;
   const leadCollection = await dalDbOperation(async () => {
      const res = await db
         .select()
         .from(leadsTable)
         .where(eq(leadsTable.leadCollectionsId, leadCollectionId));
      
      const res2 = await db
         .select()
         .from(leadCollectionsTable)
         .where(eq(leadCollectionsTable.leadCollectionsId, leadCollectionId))
         .limit(1);
      
      return {
         leads: res,
         leadCollection: res2[0]
      };
   })

   if (leadCollection.success) {
      return <LeadsPage 
         leads={JSON.parse(JSON.stringify(leadCollection.data.leads))} 
         leadCollectionName={leadCollection.data.leadCollection.name!}
         leadCollection={JSON.parse(JSON.stringify(leadCollection.data.leadCollection))}
      />
   } else {
      return <LoadingLeadCollectionPage />
   }
}
