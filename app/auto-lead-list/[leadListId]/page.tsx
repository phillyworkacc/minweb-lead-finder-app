import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { automatedLeadListTable, automatedLeadsTable } from '@/db/schemas'
import { eq } from 'drizzle-orm'
import { sanitise } from '@/utils/extras'
import AutoLeadListPage from './AutoLeadList'
import LoadingAutoLeadListPage from './loading'

type AutoLeadListProps = {
   params: Promise<{
      leadListId: string;
   }>
}

export default async function AutoLeadList ({ params }: AutoLeadListProps) {
   const { leadListId } = await params;
   const automatedLeadListInfo = await dalDbOperation(async () => {
      const res = await db
         .select()
         .from(automatedLeadsTable)
         .where(eq(automatedLeadsTable.leadListId, leadListId));
      
      const res2 = await db
         .select()
         .from(automatedLeadListTable)
         .where(eq(automatedLeadListTable.leadListId, leadListId))
         .limit(1);
      
      return {
         automatedLeads: res,
         automatedLeadList: res2[0]
      };
   })

   if (automatedLeadListInfo.success) {
      return <AutoLeadListPage 
         automatedLeads={sanitise(automatedLeadListInfo.data.automatedLeads)} 
         automatedLeadList={sanitise(automatedLeadListInfo.data.automatedLeadList)}
      />
   } else {
      return <LoadingAutoLeadListPage />
   }
}