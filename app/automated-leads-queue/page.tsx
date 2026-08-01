'use client'
import AppContainer from "@/components/AppContainer/AppContainer";
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { useState } from "react";
import { toast } from "sonner";
import { addNewLeadAutomationQueue } from "../actions/lead-automation";

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
            <div className="box full pd-1">
               <input 
                  type="text" className="xxs pd-12 pdx-2"
                  placeholder="Niche"
                  value={niche} onChange={e => setNiche(e.target.value)}
               />
            </div>
            <div className="box full mt-1">
               <AwaitButton className="xxxs pd-1 pdx-2" onClick={addLeadAutomationNiche}>Add</AwaitButton>
            </div>
         </div>
      </AppContainer>
   )
}
