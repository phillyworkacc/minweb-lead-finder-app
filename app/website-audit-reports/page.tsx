import { dalDbOperation } from '@/dal/helpers'
import { db } from '@/db'
import { and, eq } from 'drizzle-orm'
import { leadsTable, websiteAuditsTable } from '@/db/schemas'
import LoadingWebsiteAuditReportsPage from './loading'
import WebsiteAuditReportsPage from './WebsiteAuditReports'

export default async function WebsiteAuditReports () {
   const audits = await dalDbOperation(async () => {
      const res = await db
         .select({
            id: websiteAuditsTable.id,
            auditId: websiteAuditsTable.auditId,
            leadCollectionsId: websiteAuditsTable.leadCollectionsId,
            leadId: websiteAuditsTable.leadId,
            auditJson: websiteAuditsTable.auditJson,
            date: websiteAuditsTable.date,
            name: leadsTable.name
         })
         .from(websiteAuditsTable)
         .innerJoin(leadsTable, and(
            eq(leadsTable.leadCollectionsId, websiteAuditsTable.leadCollectionsId),
            eq(leadsTable.leadId, websiteAuditsTable.leadId)
         ));
      
      return res;
   })

   if (audits.success) {
      return <WebsiteAuditReportsPage websiteAuditReports={JSON.parse(JSON.stringify(audits.data))} />
   } else {
      return (
         <LoadingWebsiteAuditReportsPage />
      )
   }
}
