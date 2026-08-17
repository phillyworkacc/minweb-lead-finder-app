"use client"
import { useMinwebAiApi } from "@/app/actions/extras";
import { updateAutomatedLeadOutreachMsg } from "@/app/actions/lead-automation";
import { buildOutreachPrompt, validateOutreach } from "@/utils/outreachPromptGenerator";
import { useState } from "react";
import { toast } from "sonner";
import { CustomSelect } from "../Select/CustomSelect";
import { Mail, MessageCircleMore, Sparkles } from "lucide-react";
import { copyToClipboard } from "@/lib/str";
import AwaitButton from "../AwaitButton/AwaitButton";

type UpdateLeadOutreachMessageProps = {
   lead: AutomatedLead;
   onSuccess: (aiResponse: any) => void;
}
type OutreachMsgChannel = "sms" | "email";

export default function UpdateLeadOutreachMessage ({ lead, onSuccess }: UpdateLeadOutreachMessageProps) {
   const [businessOwnerName, setBusinessOwnerName] = useState("");
   const [outreachMsgChannel, setOutreachMsgChannel] = useState<OutreachMsgChannel>("sms");
   
   async function submitCreateMessageToSend (callback: Function) {
      const outreachPrompt = buildOutreachPrompt({
         sender: { firstName: "Philip", agencyName: "Minweb Agency" },
         business: {
            name: JSON.parse(lead.websiteScrapedInfo).title,
            industry: "", city: "", ownerFirstName: businessOwnerName
         },
         websiteAudit: JSON.parse(lead.audit) as any,
         leadScore: JSON.parse(lead.leadScore) as any,
         leadOffers: JSON.parse(lead.offersForLead) as any,
         channel: outreachMsgChannel, recentOpeners: [], includeOptOutLine: false,
         hasFreeWebsitePreview: (lead.website !== "")
      });

      const response: any = await useMinwebAiApi(outreachPrompt);

      if (response || response !== "") {
         const aiResponse: any = JSON.parse(response); 
         const validateResponse = validateOutreach(aiResponse.data, outreachMsgChannel);
         if (validateResponse.valid) {
            const updated = await updateAutomatedLeadOutreachMsg(lead.leadId, lead.leadListId, aiResponse.data.message);
            if (updated) {
               onSuccess(aiResponse);
               toast.success("Generated outreach message");
            } else {
               toast.error("Failed to save outreach message to db");
            }
         } else {
            await submitCreateMessageToSend(callback);
         }
      } else {
         console.log(response);
      }
      callback();
   }

   return (
      <div className="box full dfb column gap-20">
         <div className="text-sm full bold-700 mb-05">Generate AI Outreach Message</div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs full">Enter Business Owner Name (optional)</div>
            <input 
               type="text" className="xxxs pd-12 pdx-15 full"
               placeholder="Owner Name" style={{ maxWidth: "400px" }}
               value={businessOwnerName} onChange={e => setBusinessOwnerName(e.target.value)}
            />
         </div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs full">Choose Message Channel</div>
            <CustomSelect
               options={[
                  { option: <div className="box fit dfb align-center gap-5"><MessageCircleMore size={14} /> Sms</div>, optionName: "sms" },
                  { option: <div className="box fit dfb align-center gap-5"><Mail size={15} /> Email</div>, optionName: "email" },
               ]}
               onSelect={(option) => setOutreachMsgChannel(option.toLowerCase() as OutreachMsgChannel)}
               style={{ padding: "5px 8px" }}
               optionStyle={{ fontSize: "0.9rem" }}
               selectedOptionStyle={{ fontSize: "0.9rem" }}
            />
         </div>
         <div className="box pd-1">
            <AwaitButton 
               className="xxxs pd-15 fit pdx-2 border-radius-15 whitespace-nowrap mw-500"
               onClick={submitCreateMessageToSend}
            ><Sparkles size={16} /> Generate Outreach</AwaitButton>
         </div>
      </div>
   )
}
