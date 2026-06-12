import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { leadsTable } from '@/db/schemas'
import { desc, eq } from 'drizzle-orm'
import LeadsPage from './StarredLeads'
import LoadingLeadsPage from './loading'

export default async function StarredLeads () {
   const starredLeads = await dalDbOperation(async () => {
      const res = await db
         .select()
         .from(leadsTable)
         .where(eq(leadsTable.starred, true))
         .orderBy(desc(leadsTable.date));
      
      return res;
   })

   if (starredLeads.success) {
      return <LeadsPage starredLeads={JSON.parse(JSON.stringify(starredLeads.data))} />
   } else {
      return (
         <LoadingLeadsPage />
      )
   }
}
