"use client"
import { useState } from "react";
import { BusinessIcon } from "@/components/Icons/Icon";
import { Braces, ChevronLeft, ChevronRight, Globe, LayersPlus, Mail, MapPin, Phone, Search, SquareArrowOutUpRight, Star } from "lucide-react";
import { leadCardItemEllipsis, websiteFormatting } from "@/machine/helpers";
import { toast } from "sonner";
import { updateLeadStarred } from "@/app/actions/leads";
import { copyToClipboard } from "@/lib/str";
import { createWebsiteAudit } from "@/app/actions/extras";
import Link from "next/link";
import WebsiteIntelligence from "@/components/AutomatedLeadInsights/WebsiteIntelligence";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Spacing from "@/components/Spacing/Spacing";

type LeadsCardViewProps = {
   leads: Lead[];
   currentLeadIndex: number;
}

export default function LeadsCardView ({ leads, currentLeadIndex }: LeadsCardViewProps) {
   const [allAutoLeads, setAllAutoLeads] = useState<Lead[]>(leads);
   const [viewingIndex, setViewingIndex] = useState<number>(currentLeadIndex);
   const [auditResult, setAuditResult] = useState<any>(null);

   function gotoPreviousLead () {
      if (viewingIndex === 0) return;
      setViewingIndex(i => i-1);
      setAuditResult(null);
   }
   
   function gotoNextLead () {
      if (viewingIndex === (allAutoLeads.length-1)) return;
      setViewingIndex(i => i+1);
      setAuditResult(null);
   }

   async function toggleStarredLead (callback: Function) {
      const autoLead = allAutoLeads[viewingIndex];
      const newStarredValue = autoLead.starred ? false : true;
      const starredAutoLead = await updateLeadStarred(autoLead.leadId, autoLead.leadCollectionsId, newStarredValue);
      if (starredAutoLead) {
         setAllAutoLeads(p => {
            const copiedP = [ ...p ];
            copiedP[viewingIndex].starred = newStarredValue;
            return ([ ...copiedP ]);
         });
         toast.success(`${newStarredValue ? "Starred" : "Un-starred"} ${autoLead.name}`)
      } else {
         toast.error("Failed to star this lead");
      }
      callback();
   }
   
   async function handleAuditSite (callback: Function) {
      if (allAutoLeads[viewingIndex].website) {
         const res = await createWebsiteAudit(allAutoLeads[viewingIndex].website, "");
         if (res === false) {
            toast.error("Failed to audit website");
         } else {
            setAuditResult(res);
         }
      } else {
         toast.error("This lead doesn't have a website");
      }
      callback();
   }

   function copyJson () {
      copyToClipboard(JSON.stringify(auditResult));
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
         </div>

         {(allAutoLeads[viewingIndex].starred) ? (<>
            <div className="starred-tag-auto-lead-card">
               <div className="text-xxxs fit dfb align-center gap-5 bold-600">
                  <Star size={18} fill="#c27400" /> Starred Lead
               </div>
            </div>
         </>) : (<></>)}

         <div className="box full dfb wrap gap-5" style={{ maxWidth: "650px" }}>
            <Link 
               href={`https://google.com/search?q=${encodeURIComponent(`${allAutoLeads[viewingIndex].name} ${allAutoLeads[viewingIndex].address}`)}`}
               target="_blank"
               referrerPolicy="no-referrer"
            >
               <button className="xxxs pd-15 full pdx-15 border-radius-15 whitespace-nowrap mw-500"><Search size={16} /> Google Search</button>
            </Link>
            {(allAutoLeads[viewingIndex].phoneNumber) ? (
               <Link href={`tel:${leadCardItemEllipsis(allAutoLeads[viewingIndex].phoneNumber).replaceAll(" ", "")}`} target="_blank">
                  <button className="xxxs pd-15 full pdx-15 border-radius-15 whitespace-nowrap mw-500"><Phone size={16} /> {allAutoLeads[viewingIndex].phoneNumber}</button>
               </Link>
            ) : <></>}
            <AwaitButton 
               className="xxxs pd-15 outline-black tiny-shadow fit pdx-15 border-radius-15 whitespace-nowrap mw-500"
               onClick={toggleStarredLead} blackSpinner
            ><Star size={16} color="#ffa010" fill="#ffa010" /> {allAutoLeads[viewingIndex].starred ? 'Un-star' : 'Star'} Lead</AwaitButton>
         </div>

         <Spacing />
         {allAutoLeads[viewingIndex].website && (<>
            {auditResult == null ? (<>
               <div className="box full dfb column gap-10">
                  <Spacing size={2} />
                  <div className="text-m bold-800 full">AUDIT THIS LEAD'S WEBSITE</div>
                  <div className="text-xxs grey-5 full">Click below to generate a website audit of this lead's website so you can give them the best offer</div>
                  <div className="box full dfb align-center gap-10 mw-800">
                     <AwaitButton className="xxxs pd-13 fit pdx-2 border-radius-20" onClick={handleAuditSite}>
                        <LayersPlus size={17} /> Audit {allAutoLeads[viewingIndex].name}
                     </AwaitButton>
                  </div>
               </div>
            </>) : (<>            
               <div className="box full dfb column gap-10">
                  <Spacing size={2} />
                  <div className="text-l bold-800 full">AUDIT COMPLETE</div>
                  <div className="box full dfb align-center gap-10 wrap">
                     <button className="xxxs pd-12 pdx-2 fit border-radius-15 outline-black" onClick={copyJson}>Copy JSON <Braces size={16} /></button>
                  </div>
                  <Spacing />
                  <WebsiteIntelligence 
                     websiteScrapedInfo={auditResult.websiteScrapedInfo}
                     websiteAudit={auditResult.audit}
                  />
                  <Spacing size={5} />
               </div>
            </>)}
         </>)}
      </div>
   )
}
