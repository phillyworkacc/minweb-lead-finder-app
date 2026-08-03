'use client'
import AppContainer from "@/components/AppContainer/AppContainer";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { useState } from "react";
import { toast } from "sonner";
import { addNewLeadAutomationQueue } from "../actions/lead-automation";
import LeadAutomationQueueTable from "@/components/Table/LeadAutomationQueueTable";

export default function page() {
   const [niche, setNiche] = useState("");

   async function addLeadAutomationNiche (callback: Function) {
      if (niche.trim() == "") {
         toast.error("Please enter a niche");
         callback();
         return;
      }
      const added = await addNewLeadAutomationQueue(niche);
      if (added) {
         toast.success(`Added ${niche} to lead automation queue`);
         setNiche("");
      } else {
         toast.error("Failed to add niche");
      }
      callback();
   }

   return (
      <AppContainer>
         <Spacing size={2} />
         <div className="text-l full pd-1 bold-500 dfb align-center gap-10">
            Automated Leads Queue
         </div>
         <div className="box full dfb column pd-05">
            <div className="text-xxxxs full grey-5">Add a niche for the automated system to look through.</div>
            <div className="box full pd-15 dfb align-center gap-5" style={{ maxWidth: "600px" }}>
               <div className="box full">
                  <input 
                     type="text" className="xxs pd-15 pdx-2 full"
                     placeholder="Niche" style={{ maxWidth: "600px" }}
                     value={niche} onChange={e => setNiche(e.target.value)}
                  />
               </div>
               <div className="box fit">
                  <AwaitButton className="xxxs pd-15 fit pdx-2 whitespace-nowrap" onClick={addLeadAutomationNiche}>Add</AwaitButton>
               </div>
            </div>
         </div>
         <Spacing size={2} />
         <LeadAutomationQueueTable />
      </AppContainer>
   )
}
