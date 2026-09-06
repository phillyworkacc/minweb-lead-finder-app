'use client'
import { useState } from "react";
import { createWebsiteAudit } from "../actions/extras";
import { ArrowUp, ArrowUpRight, Braces, RotateCcw } from "lucide-react";
import AppContainer from "@/components/AppContainer/AppContainer"
import Spacing from "@/components/Spacing/Spacing";
import WebsiteIntelligence from "@/components/AutomatedLeadInsights/WebsiteIntelligence";
import Link from "next/link";
import { copyToClipboard } from "@/lib/str";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { toast } from "sonner";

export default function page() {
   const [url, setUrl] = useState("");
   const [auditResult, setAuditResult] = useState<any>(null);

   async function handleAuditSite (callback: Function) {
      const res = await createWebsiteAudit(url, "");
      if (res === false) {
         toast.error("Failed to audit website");
      } else {
         setAuditResult(res);
      }
      callback();
   }

   function auditAnotherSite () {
      setUrl("");
      setAuditResult(null);
   }

   function copyJson () {
      copyToClipboard(JSON.stringify(auditResult));
   }

   return (
      <AppContainer>
         {auditResult == null ? (<>
            <div className="box full dfb column gap-10">
               <Spacing size={2} />
               <div className="text-l bold-800 full">AUDIT A WEBSITE</div>
               <div className="text-xxs grey-5 full">Enter the website's url including 'https://' at the start</div>
               <div className="box full dfb align-center gap-10 mw-800 mt-15">
                  <input 
                     type="text" className="xxxs pd-13 pdx-2 full border-radius-20" placeholder="Website Url"
                     value={url} onChange={e => setUrl(e.target.value)}
                  />
                  <AwaitButton className="xxs pd-13 fit pdx-15 border-radius-20" onClick={handleAuditSite}>
                     <ArrowUp size={17} />
                  </AwaitButton>
               </div>
            </div>
         </>) : (<>            
            <div className="box full dfb column gap-10">
               <Spacing size={2} />
               <div className="text-l bold-800 full">AUDIT COMPLETE</div>
               <div className="box full dfb align-center gap-10 wrap">
                  <Link className="box fit" href={auditResult.websiteScrapedInfo.url} target="_blank" referrerPolicy="no-referrer">
                     <button className="xxxs pd-12 pdx-2 fit border-radius-15">Visit Website <ArrowUpRight size={16} /></button>
                  </Link>
                  <button className="xxxs pd-12 pdx-2 fit border-radius-15" onClick={auditAnotherSite}>Another Audit <RotateCcw size={16} /></button>
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
      </AppContainer>
   )
}
