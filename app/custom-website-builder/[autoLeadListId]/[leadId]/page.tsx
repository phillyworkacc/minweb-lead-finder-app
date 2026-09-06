import { dalDbOperation } from '@/dal/helpers';
import { db } from '@/db';
import { automatedLeadsTable } from '@/db/schemas';
import { sanitise } from '@/utils/extras';
import { and, eq } from 'drizzle-orm';
import LoadingLeadsPage from '@/app/loading';
import CustomWebsiteBuilderTool from './CustomWebsiteBuilderTool';

type CustomWebsiteBuilderPageProps = {
   params: Promise<{
      autoLeadListId: string;
      leadId: string;
   }>
}

export default async function CustomWebsiteBuilderPage ({ params }: CustomWebsiteBuilderPageProps) {
   const { autoLeadListId, leadId } = await params;

   const lead = await dalDbOperation(async () => {
      const result = await db.select().from(automatedLeadsTable)
         .where(and(
            eq(automatedLeadsTable.leadListId, autoLeadListId),
            eq(automatedLeadsTable.leadId, leadId),
         )).limit(1);
      return result[0];
   });

   if (lead.success) {
      return <CustomWebsiteBuilderTool lead={sanitise(lead.data)} />
   } else {
      return <LoadingLeadsPage />
   }
}
