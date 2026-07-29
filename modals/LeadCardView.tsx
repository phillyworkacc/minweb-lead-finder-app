'use client'
import { updateLeadColdCall, updateLeadStarred } from "@/app/actions/leads";
import { BusinessIcon } from "@/components/Icons/Icon";
import { ChevronLeft, ChevronRight, Phone, Search, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Select from "@/components/Select/Select";
import Link from "next/link";

type LeadCardViewProps = {
   index: number;
   lead: Lead;
   updateLeadStar: (starred: boolean) => void;
   previousLead: () => void;
   nextLead: () => void;
}

function StarToggler ({ starred, onToggleStarred }: { starred: boolean, onToggleStarred: (starred: boolean) => void; }) {
   const [starredState, setStarredState] = useState<boolean>(starred);
   return (
      <div 
         className="box fit dfb align-center justify-center pdx-1 cursor-pointer" 
         style={{ background: "#ececec", border: "1px solid #ccc", borderRadius: "10px" }}
         onClick={() => {
            onToggleStarred(!starredState);
            setStarredState(prev => !prev);
         }}
      >
         <Star
            size={20}
            color={starred ? '#ffa600' : '#000'}
            fill={starred ? '#ffa600' : '#ececec'}
         />
      </div>
   )
}

export default function LeadCardView ({ lead, previousLead, nextLead, updateLeadStar }: LeadCardViewProps) {
   const router = useRouter();
   const coldCallOptions = ["Missed", "Booked", "Fail", "Not Answered", "Not Called"];
   const onSelectColdCallOption = async (lead: Lead, option: string) => {
      const updated = await updateLeadColdCall(lead.leadId, lead.leadCollectionsId, option);
      if (updated) {
         toast.success("Update Lead Cold Call Status");
      } else {
         toast.error("Failed to Update Lead Cold Call Status");
      }
   }

   const onToggleStarred = async (lead: Lead, starred: boolean) => {
      const updated = await updateLeadStarred(lead.leadId, lead.leadCollectionsId, starred);
      if (updated) {
         toast.success(`Starred ${lead.name}`);
         updateLeadStar(starred);
      } else {
         toast.error("Failed to star lead");
      }
   }

   const websiteFormatting = (url: string) => {
      return (url.length > 35) ? `${url.toLowerCase().substring(0,35)}...` : `${url.toLowerCase()}`;
   }

   return (
      <div className="box dfb column gap-20">
         <div className="box full dfb mb-1">
            <div className="box full">
               <div className="text-s full bold-600">{lead?.name!}</div>
               <div className="text-xxxs full grey-5 pd-1">{lead?.address!}</div>
               {(lead.website) ? (<Link 
                  href={lead?.website!} 
                  className="text-xxxs full pd-05 grey-5 visible-link" 
                  target='_blank'
               >{websiteFormatting(lead?.website!)}</Link>) : (<></>)}
            </div>
            <div className="box fit">
               <div className="box full dfb align-center">
                  <BusinessIcon url={lead.website!} size={50} round />
               </div>
            </div>
         </div>
         <div className="box full dfb wrap gap-10">
            <Link href={`https://google.com/search?q=${encodeURIComponent(`${lead.name} ${lead.address}`)}`} target='_blank'>
               <button className="xxxxs pd-1 pdx-15 border-radius-15 whitespace-nowrap"><Search size={16} /> Google Search</button>
            </Link>
            <StarToggler starred={lead.starred} onToggleStarred={starred => onToggleStarred(lead, starred)} />
         </div>
         <div className="box full dfb wrap gap-10">
            <div className="box fit dfb align-center justify-center">
               <Select
                  options={coldCallOptions}
                  onSelect={(option) => onSelectColdCallOption(lead, option)}
                  selectedOptionStyle={{ fontSize: "0.9rem", padding: "1.5px 8px" }}
                  style={{ padding: "0" }}
                  defaultOptionIndex={coldCallOptions.indexOf(lead.called)}
               />
            </div>
         </div>
         <div className="box full dfb align-center gap-5">
            <button className="xxxs pd-13 fit pdx-15 outline-black tiny-shadow" onClick={previousLead}>
               <ChevronLeft size={17} />
            </button>
            <Link href={`tel:${lead.phoneNumber}`} target='_blank' className="box full">
               <button className="xxxs pd-13 full pdx-15 tiny-shadow">
                  <Phone size={16} /> {lead.phoneNumber}
               </button>
            </Link>
            <button className="xxxs pd-13 fit pdx-15 outline-black tiny-shadow" onClick={nextLead}>
               <ChevronRight size={17} />
            </button>
         </div>
      </div>
   )
}
