"use client"
import { useState } from "react";
import { BusinessIcon } from "@/components/Icons/Icon";
import { Calendar, ChevronLeft, ChevronRight, Globe, Mail, MapPin, Phone, Search, SquareArrowOutUpRight } from "lucide-react";
import { leadCardItemEllipsis, websiteFormatting } from "@/machine/helpers";
import { formatMilliseconds } from "@/utils/date";
import Link from "next/link";
import Spacing from "@/components/Spacing/Spacing";
import WebsiteIntelligence from "@/components/AutomatedLeadInsights/WebsiteIntelligence";
import SalesPriority from "@/components/AutomatedLeadInsights/SalesPriority";
import RecommendedOffers from "@/components/AutomatedLeadInsights/RecommendedOffers";

type AutoLeadsCardViewProps = {
   automatedLeads: AutomatedLead[];
   currentLeadIndex: number;
}

export default function AutoLeadsCardView ({ automatedLeads, currentLeadIndex }: AutoLeadsCardViewProps) {
   const [allAutoLeads, setAllAutoLeads] = useState<AutomatedLead[]>(automatedLeads);
   const [viewingIndex, setViewingIndex] = useState<number>(currentLeadIndex);

   function gotoPreviousLead () {
      if (viewingIndex === 0) return;
      setViewingIndex(i => i-1);
   }
   
   function gotoNextLead () {
      if (viewingIndex === (allAutoLeads.length-1)) return;
      setViewingIndex(i => i+1);
   }

   return (
      <div className="box full dfb column gap-10">
         <div className="box full dfb align-center gap-10 pd-1">
            <button 
               className="xs grey no-shadow pd-1 pdx-1" 
               onClick={gotoPreviousLead}
               disabled={(viewingIndex === 0)}
            ><ChevronLeft size={16} /></button>
            <button 
               className="xs grey no-shadow pd-1 pdx-1" 
               onClick={gotoNextLead}
               disabled={(viewingIndex === (allAutoLeads.length-1))}
            ><ChevronRight size={16} /></button>
         </div>
         <div className="box full">
            <BusinessIcon url={allAutoLeads[viewingIndex].website!} size={50} round />
            <div className="text-m full bold-700 pd-1 mt-1">{allAutoLeads[viewingIndex].name}</div>
            <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
               <div className="box fit dfb align-center"><MapPin size={15} /></div> {leadCardItemEllipsis(allAutoLeads[viewingIndex]?.address!.trim())}
            </div>
            {(allAutoLeads[viewingIndex].email) ? (
               <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                  <Mail size={15} /> 
                  <Link href={`mailto:${leadCardItemEllipsis(allAutoLeads[viewingIndex].email)}`} target="_blank">
                     {leadCardItemEllipsis(allAutoLeads[viewingIndex].email)}
                  </Link>
               </div>
            ) : (<></>)}
            {(allAutoLeads[viewingIndex].phoneNumber) ? (
               <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                  <Phone size={15} /> {leadCardItemEllipsis(allAutoLeads[viewingIndex].phoneNumber)}
               </div>
            ) : (<></>)}
            {(allAutoLeads[viewingIndex].website) ? (
               <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                  <Globe size={15} />
                  <Link href={websiteFormatting(allAutoLeads[viewingIndex]?.website!, true)} target="_blank" className="box dfb align-center gap-5">
                     {websiteFormatting(allAutoLeads[viewingIndex]?.website!, true)} <SquareArrowOutUpRight size={15} />
                  </Link>
               </div>
            ) : (<></>)}
            <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
               <div className="box fit dfb align-center"><Calendar size={15} /></div> {formatMilliseconds(parseInt(allAutoLeads[viewingIndex]?.date))}
            </div>
         </div>

         {(allAutoLeads[viewingIndex].phoneNumber) ? (
            <div className="box full dfb wrap gap-5" style={{ maxWidth: "350px" }}>
               <Link href={`https://google.com/search?q=${encodeURIComponent(`${allAutoLeads[viewingIndex].name} ${allAutoLeads[viewingIndex].address}`)}`} target="_blank">
                  <button className="xxxs pd-15 full pdx-15 border-radius-15 whitespace-nowrap mw-500"><Search size={16} /> Google Search</button>
               </Link>
               <Link href={`mailto:${leadCardItemEllipsis(allAutoLeads[viewingIndex].email)}`} target="_blank">
                  <button className="xxxs pd-15 full pdx-15 border-radius-15 whitespace-nowrap mw-500"><Phone size={14} /> {allAutoLeads[viewingIndex].phoneNumber}</button>
               </Link>
            </div>
         ) : <></>}
         <Spacing size={2} />
         <div className="divider-line-auto-lead-card" />

         <Spacing size={2} />
         <div className="box full">
            <WebsiteIntelligence
               websiteAudit={JSON.parse(allAutoLeads[viewingIndex].audit)}
               websiteScrapedInfo={JSON.parse(allAutoLeads[viewingIndex].websiteScrapedInfo)}
            />
         </div>
         <Spacing size={2} />
         <div className="divider-line-auto-lead-card" />

         <Spacing size={2} />
         <div className="box full">
            <SalesPriority leadScore={JSON.parse(allAutoLeads[viewingIndex].leadScore)} />
         </div>
         <Spacing size={2} />
         <div className="divider-line-auto-lead-card" />
         
         <Spacing size={2} />
         <div className="box full">
            <RecommendedOffers leadOffers={JSON.parse(allAutoLeads[viewingIndex].offersForLead)} />
         </div>

         <Spacing size={5} />
      </div>
   )
}
