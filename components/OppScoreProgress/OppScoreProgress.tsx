"use client"
import "./OppScoreProgress.css"

type ProgressBarProps = {
   opportunityScore: Record<any, any>
};

type ProgressInfo = {
   background: string;
   fill: string;
   name: string;
}

const progressBarInfo: Record<any, ProgressInfo> = {
   opportunityScore: {
      background: "#D1FAE5",
      fill: "#10B981",
      name: "Opportunity Score"
   },
   averageLeadScore: {
      background: "#DBEAFE",
      fill: "#3B82F6",
      name: "Average Lead Score"
   },
   totalEmails: {
      background: "#EDE9FE",
      fill: "#8B5CF6",
      name: "Total Leads with Emails"
   },
   totalWebsiteBuilds: {
      background: "#FCE7F3",
      fill: "#EC4899",
      name: "Total that need Website Build"
   },
   totalNoWebsite: {
      background: "#E2E8F0",
      fill: "#64748B",
      name: "Total Leads with No Website"
   }
};

export default function OppScoreProgress ({ opportunityScore }: ProgressBarProps) {
   const percentageCalc = (value: number) => Math.min(100, Math.max(0, value));

   return (<>
      {Object.keys(opportunityScore).map((key: any) => (
         <div key={key} className="metric-wrapper">
            <div className="box full dfb align-center gap-10">
               <div className="text-xt full bold-500">{progressBarInfo[key].name}</div>
               <div className="text-xxxs fit bold-700">{percentageCalc(opportunityScore[key])}%</div>
            </div>
            <div className="metric-progress" style={{ background: progressBarInfo[key].background }}>
               <div
                  className="metric-progress-fill"
                  style={{
                     width: `${percentageCalc(opportunityScore[key])}%`,
                     background: progressBarInfo[key].fill
                  }}
               />
            </div>
         </div>
      ))}
   </>);
}