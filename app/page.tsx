import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { leadCollectionsTable, leadsTable } from '@/db/schemas'
import { desc, eq } from 'drizzle-orm'
import LeadsPage from './Leads'
import LoadingLeadsPage from './loading'

export default async function Leads () {
   const leadCollections = await dalDbOperation(async () => {
      const res = await db
         .select({
            leadCollectionsId: leadCollectionsTable.leadCollectionsId,
            name: leadCollectionsTable.name,
            folders: leadCollectionsTable.folders,     
            date: leadCollectionsTable.date,
            leadCount: db.$count(
               leadsTable,
               eq(leadsTable.leadCollectionsId, leadCollectionsTable.leadCollectionsId)
            )
         })
         .from(leadCollectionsTable)
         .orderBy(desc(leadCollectionsTable.date));
      
      return res;
   })

   if (leadCollections.success) {
      return <LeadsPage leadsCollections={JSON.parse(JSON.stringify(leadCollections.data))} />
   } else {
      return (
         <LoadingLeadsPage />
      )
   }
}
