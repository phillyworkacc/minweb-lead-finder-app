import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { leadCollectionsTable } from '@/db/schemas'
import { desc } from 'drizzle-orm'
import LeadsPage from './Leads'
import LoadingLeadsPage from './loading'

export default async function Leads () {
   const leadCollections = await dalDbOperation(async () => {
      const res = await db
         .select()
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
