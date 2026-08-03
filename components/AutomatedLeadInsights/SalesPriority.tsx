"use client"
import "./SalesPriority.css"
import { ChevronRight } from "lucide-react";
import Spacing from "../Spacing/Spacing";
import ScoreStamp from "../ScoreStamp/ScoreStamp";

type SalesPriorityProps = {
   leadScore: LeadScore;
}

export default function SalesPriority ({ leadScore }: SalesPriorityProps) {
   const tone: Record<LeadScore["priority"], any> = {
      "Low": "rust",
      "Medium": "amber",
      "High": "teal",
   }

   return (<>
      <div className="text-sm full bold-700 mb-05">Sales Priority</div>
      <div className="box full dfb align-center wrap gap-20">
         <div className="box fit">
            <ScoreStamp
               value={leadScore.score}
               primary={leadScore.score.toString()}
               secondary={leadScore.priority.toUpperCase()}
               tone={tone[leadScore.priority]}
            />
         </div>
         <div className="box fit h-full dfb align-center">
            <div className="priority-scale">
               <div className="text-xt bold-500 full grey-4">PRIORITY SCALE</div>
               <div className="priority-bars">
                  <div className={`priority-bar ${leadScore.priority == 'Low' ? "low" : ""}`} />
                  <div className={`priority-bar ${leadScore.priority == 'Medium' ? "medium" : ""}`} />
                  <div className={`priority-bar ${leadScore.priority == 'High' ? "high" : ""}`} />
               </div>
               <div className="priority-bar-labels">
                  <div className="label">Low</div>
                  <div className="label">Medium</div>
                  <div className="label">High</div>
               </div>
            </div>
         </div>
      </div>

      <Spacing size={2} />
      <div className="text-xs full bold-700 mb-1">Why This Score</div>
      <WhyThisScore reasons={leadScore.reasons} />
   </>)
}

function WhyThisScore ({ reasons }: { reasons: string[] }) {
   if (reasons.length > 0) {
      return (<div className="box full dfb column gap-10">
         {reasons.map((reason, index) => (
            <div key={index} className="box full dfb align-center gap-5">
               <div className="box fit h-full dfb align-center">
                  <ChevronRight size={15} /> 
               </div>
               <div className="text-xxxs full">{reason}</div>
            </div>
         ))}
      </div>)
   } else {
      return <div className="text-xxs grey-5 full error">No reasons for this score</div>
   }
}
