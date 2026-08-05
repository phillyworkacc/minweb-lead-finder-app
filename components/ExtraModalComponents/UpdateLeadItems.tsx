"use client"
import { updateAutomatedLeadItems } from "@/app/actions/lead-automation";
import { useState } from "react";
import { toast } from "sonner";
import { UserRoundCheck } from "lucide-react";
import AwaitButton from "../AwaitButton/AwaitButton";

type UpdateLeadOutreachMessageProps = {
   lead: AutomatedLead;
   onSuccess: (val: { email: string, phoneNumber: string }) => void;
}

export default function UpdateLeadItems ({ lead, onSuccess }: UpdateLeadOutreachMessageProps) {
   const [email, setEmail] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   
   async function submitUpdateLeadInfo (callback: Function) {
      const updated = await updateAutomatedLeadItems(lead.leadId, lead.leadListId, {
         email: email || lead.email,
         phoneNumber: phoneNumber || lead.phoneNumber
      });
      if (updated) {
         onSuccess({
            email: email || lead.email,
            phoneNumber: phoneNumber || lead.phoneNumber
         });
         toast.success("Updated lead items");
      } else {
         toast.error("Failed to update lead info");
      }
      callback();
   }

   return (
      <div className="box full dfb column gap-20">
         <div className="text-sm full bold-700 mb-05">Update Lead Items</div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs full">Enter Email</div>
            <input 
               type="email" className="xxxs pd-12 pdx-15 full"
               placeholder="Email" style={{ maxWidth: "400px" }}
               value={email} onChange={e => setEmail(e.target.value)}
            />
         </div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs full">Enter Phone Number</div>
            <input 
               type="email" className="xxxs pd-12 pdx-15 full"
               placeholder="Phone Number" style={{ maxWidth: "400px" }}
               value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
            />
         </div>
         <div className="box pd-1">
            <AwaitButton 
               className="xxxs pd-15 fit pdx-2 border-radius-15 whitespace-nowrap mw-500"
               onClick={submitUpdateLeadInfo}
            ><UserRoundCheck size={16} /> Update</AwaitButton>
         </div>
      </div>
   )
}
