'use client'
import { formatMilliseconds } from "@/utils/date";
import { Circle, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { calculateAuditScore } from "@/utils/websiteAudit";
import AppWrapper from "@/components/AppContainer/AppContainer";
import Card from "@/components/Card/Card";

type WebsiteAuditReportsPageProps = {
   websiteAuditReports: WebsiteAuditReportExtra[];
}

export default function WebsiteAuditReportsPage ({ websiteAuditReports }: WebsiteAuditReportsPageProps) {
   const router = useRouter();
   const cardStyles: CSSProperties = {
      width: "100%", boxShadow: "0 2px 5px rgba(0,0,0,0.098)",
      borderRadius: "15px", padding: "15px 20px"
   }
   const audit = (websiteAuditReport: WebsiteAuditReportExtra) => JSON.parse(websiteAuditReport.auditJson);

   return (
      <AppWrapper>
         <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
            <LayoutDashboard size={20} /> Website Audit Reports
         </div>
         <div className="text-xxxs grey-5 full pd-05 mb-1">
            Below are all your leads' website audit reports
         </div>
         <div className="box full dfb column gap-10">
            {websiteAuditReports.map((websiteAuditReport, index) => (
               <Card key={index} styles={cardStyles} cursor onClick={() => router.push(`/lead-collection/${websiteAuditReport.leadCollectionsId}/${websiteAuditReport.leadId}`)}>
                  <div className="box full dfb column gap-5">
                     <div className="text-xt grey-4 full">Website Audit</div>
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs fit bold-600 whitespace-nowrap">{websiteAuditReport.name}</div>
                        <LayoutDashboard size={16} />
                        <div className="box full dfb align-center justify-end">
                            <div className="text-xs fit bold-700 dfb align-center gap-5">
                              <Circle 
                                 size={17} 
                                 fill={calculateAuditScore(audit(websiteAuditReport)).verdictColor} 
                                 color={calculateAuditScore(audit(websiteAuditReport)).verdictColor}
                              />
                              {(calculateAuditScore(audit(websiteAuditReport)).totalScore*(100/12)).toFixed(1)}%
                           </div>
                        </div>
                     </div>
                     <div className="text-xxxs grey-5 full">{calculateAuditScore(audit(websiteAuditReport)).verdict}</div>
                     <div className="text-t full grey-4 pd-05">{formatMilliseconds(parseInt(websiteAuditReport.date))}</div>
                  </div>
               </Card>
            ))}
         </div>
      </AppWrapper>
   )
}
