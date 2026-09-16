"use client"
import { useState } from "react";
import { formatMilliseconds } from "@/utils/date";
import { ArrowUpRightFromSquare, Bot, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/str";
import { createMPSAiMessage } from "@/app/actions/extras";
import { toast } from "sonner";
import Link from "next/link";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Spacing from "@/components/Spacing/Spacing";

type MPSListingsCardViewProps = {
   listings: MPSListing[];
   currentListingIndex: number;
}

export default function MPSListingsCardView ({ listings, currentListingIndex }: MPSListingsCardViewProps) {
   const [allMPSListings, setAllMPSListings] = useState<MPSListing[]>(listings);
   const [viewingIndex, setViewingIndex] = useState<number>(currentListingIndex);
   const [aiResult, setAiResult] = useState<any>(null);

   function gotoPreviousLead () {
      if (viewingIndex === 0) return;
      setViewingIndex(i => i-1);
      setAiResult(null);
   }
   
   function gotoNextLead () {
      if (viewingIndex === (allMPSListings.length-1)) return;
      setViewingIndex(i => i+1);
      setAiResult(null);
   }
   
   async function handleCreateAiMessage (callback: Function) {
      const { name, description } = allMPSListings[viewingIndex];
      const res = await createMPSAiMessage(name, description);
      if (res) {
         setAiResult(res);
      } else {
         toast.error("Failed to create Ai message")
      }
      callback();
   }

   function handleCopyMessage () {
      if (aiResult !== null) copyToClipboard(aiResult);
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
               disabled={(viewingIndex === (allMPSListings.length-1))}
            ><ChevronRight size={16} /></button>
         </div>
         <div className="box full">
            <div className="text-m full bold-700 pd-1 mt-1">{allMPSListings[viewingIndex].name}</div>
            <div className="text-xxxs full grey-5 pd-05 line-height-17">{allMPSListings[viewingIndex].description}</div>
            <div className="text-xxxs full grey-5 pd-05">{formatMilliseconds(new Date(allMPSListings[viewingIndex].createdAt).getTime(), false, true)}</div>
         </div>

         <div className="box full dfb wrap gap-5" style={{ maxWidth: "650px" }}>
            <Link 
               href={`https://www.mypocketskill.com/listings/${allMPSListings[viewingIndex].listingId}`}
               target="_blank"
               referrerPolicy="no-referrer"
            >
               <button className="xxxs pd-15 full pdx-2 border-radius-15 whitespace-nowrap mw-500"><ArrowUpRightFromSquare size={16} /> View Listing</button>
            </Link>
         </div>

         <Spacing size={2} />
         {aiResult == null ? (<>
            <div className="box full dfb column gap-10">
               <div className="text-m bold-800 full">Create AI Message</div>
               <div className="text-xxs grey-5 full">Click below to generate a message to send to {allMPSListings[viewingIndex].name} about their listing</div>
               <div className="box full dfb align-center gap-10 mw-800 pd-05">
                  <AwaitButton className="xxxs pd-13 fit pdx-2 border-radius-20" onClick={handleCreateAiMessage}>
                     <Bot size={17} /> Create Message
                  </AwaitButton>
               </div>
            </div>
            <Spacing size={5} />
         </>) : (<>            
            <div className="box full dfb column gap-10">
               <div className="text-l bold-800 full">AI Message</div>
               <div className="text-xs grey-5 full pd-05">{aiResult}</div>
               <div className="box full dfb align-center gap-10 wrap">
                  <button className="xxxs pd-12 pdx-2 fit border-radius-15 outline-black" onClick={handleCopyMessage}>Copy Message <Copy size={16} /></button>
               </div>
               <Spacing size={5} />
            </div>
         </>)}
      </div>
   )
}
