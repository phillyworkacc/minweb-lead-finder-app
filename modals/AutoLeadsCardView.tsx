"use client"
import { useState } from "react";
import { BusinessIcon } from "@/components/Icons/Icon";
import { Calendar, ChevronLeft, ChevronRight, Globe, Mail, MapPin, Phone, Search, SquareArrowOutUpRight, Star, Copy, Brain, MessageCircle, UserRoundPen, ReceiptPoundSterling, HandCoins, Handshake, LayersPlus } from "lucide-react";
import { leadCardItemEllipsis, websiteFormatting } from "@/machine/helpers";
import { formatMilliseconds } from "@/utils/date";
import { updateAutomatedLeadStarred } from "@/app/actions/lead-automation";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/str";
import { offerPrices } from "@/utils/offerPrices";
import UpdateLeadOutreachMessage from "@/components/ExtraModalComponents/UpdateLeadOutreachMessage";
import Link from "next/link";
import Spacing from "@/components/Spacing/Spacing";
import WebsiteIntelligence from "@/components/AutomatedLeadInsights/WebsiteIntelligence";
import SalesPriority from "@/components/AutomatedLeadInsights/SalesPriority";
import RecommendedOffers from "@/components/AutomatedLeadInsights/RecommendedOffers";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import MinwebReceiptGen from "@/components/MinwebReceiptGen/MinwebReceiptGen";
import UpdateLeadItems from "@/components/ExtraModalComponents/UpdateLeadItems";
import SelectionTab from "@/components/SelectionTab/SelectionTab";
import CreateWebsiteConfig from "@/components/ExtraModalComponents/CreateWebsiteConfig";

type AutoLeadsCardViewProps = {
   automatedLeads: AutomatedLead[];
   currentLeadIndex: number;
}

export default function AutoLeadsCardView ({ automatedLeads, currentLeadIndex }: AutoLeadsCardViewProps) {
   const [allAutoLeads, setAllAutoLeads] = useState<AutomatedLead[]>(automatedLeads);
   const [viewingIndex, setViewingIndex] = useState<number>(currentLeadIndex);
   const [toolView, setToolView] = useState("website-intelligence");

   function gotoPreviousLead () {
      if (viewingIndex === 0) return;
      setViewingIndex(i => i-1);
   }
   
   function gotoNextLead () {
      if (viewingIndex === (allAutoLeads.length-1)) return;
      setViewingIndex(i => i+1);
   }

   async function toggleStarredLead (callback: Function) {
      const autoLead = allAutoLeads[viewingIndex];
      const newStarredValue = autoLead.starred ? false : true;
      const starredAutoLead = await updateAutomatedLeadStarred(autoLead.leadId, autoLead.leadListId, newStarredValue);
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

         {(allAutoLeads[viewingIndex].starred) ? (<>
            <div className="starred-tag-auto-lead-card">
               <div className="text-xxxs fit dfb align-center gap-5 bold-600">
                  <Star size={18} fill="#c27400" /> Starred Lead
               </div>
            </div>
         </>) : (<></>)}

         <div className="box full dfb wrap gap-5" style={{ maxWidth: "650px" }}>
            <Link href={`https://google.com/search?q=${encodeURIComponent(`${allAutoLeads[viewingIndex].name} ${allAutoLeads[viewingIndex].address}`)}`} target="_blank">
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

         <Spacing size={2} />
         <SelectionTab 
            items={[
               {
                  label: <><Brain size={18} /> Website Intelligence</>,
                  action: () => setToolView("website-intelligence"),
                  color: "#63c8ff", foreground: "#005c8d"
               },
               {
                  label: <><Handshake size={18} /> Sales Priority</>,
                  action: () => setToolView("sales-priority"),
                  color: "#a3ff84", foreground: "#1c7000"
               },
               {
                  label: <><HandCoins size={18} /> Recommended Offers</>,
                  action: () => setToolView("recommended-offers"),
                  color: "#ffa2a2", foreground: "#8b0000"
               },
               {
                  label: <><ReceiptPoundSterling size={18} /> Minweb Receipt</>,
                  action: () => setToolView("minweb-receipt"),
                  color: "#ffe395", foreground: "#866300"
               },
               {
                  label: <><MessageCircle size={18} /> Lead Outreach</>,
                  action: () => setToolView("lead-outreach"),
                  color: "#b4ffe6", foreground: "#00573a"
               },
               {
                  label: <><UserRoundPen size={18} /> Update Lead</>,
                  action: () => setToolView("update-lead"),
                  color: "#d8b4ff", foreground: "#3a0077"
               },
               {
                  label: <><LayersPlus size={18} /> Create Preview Website</>,
                  action: () => setToolView("create-website"),
                  color: "#a3bcca", foreground: "#193f55"
               },
            ]}
         />
         <Spacing size={2} />

         {(toolView == "website-intelligence") && (<>
            <div className="box full">
               <WebsiteIntelligence
                  websiteAudit={JSON.parse(allAutoLeads[viewingIndex].audit)}
                  websiteScrapedInfo={JSON.parse(allAutoLeads[viewingIndex].websiteScrapedInfo)}
               />
            </div>
         </>)}

         {(toolView == "sales-priority") && (<>
            <div className="box full">
               <SalesPriority leadScore={JSON.parse(allAutoLeads[viewingIndex].leadScore)} />
            </div>
            <Spacing size={2} />
         </>)}

         {(toolView == "recommended-offers") && (<>
            <div className="box full">
               <RecommendedOffers leadOffers={JSON.parse(allAutoLeads[viewingIndex].offersForLead)} />
            </div>
         </>)}

         {(toolView == "minweb-receipt") && (<>
            <MinwebReceiptGen 
               businessName={allAutoLeads[viewingIndex].name}
               items={[ ...JSON.parse(allAutoLeads[viewingIndex].offersForLead).map((o: Offer) => ({
                  itemName: o.offer, price: offerPrices[o.offer]
               })) ]}
               currencySymbol="£"
               
               logoSrc="https://minwebagency.com/logo.png"
            />
         </>)}

         {(toolView == "lead-outreach") && (<>
            {(!allAutoLeads[viewingIndex].messageToSend) ? (<>
               <UpdateLeadOutreachMessage
                  lead={allAutoLeads[viewingIndex]}
                  onSuccess={(aiResponse) => setAllAutoLeads(p => {
                     const copiedP = [ ...p ];
                     copiedP[viewingIndex].messageToSend = aiResponse.data.message;
                     return ([ ...copiedP ]);
                  }) }
               />
            </>) : (<>
               <div className="box full dfb column gap-10">
                  <div className="text-m full bold-600">Outreach Message</div>
                  <div className="text-xxs full">{allAutoLeads[viewingIndex].messageToSend}</div>
                  <button 
                     className="xxxs pd-15 fit pdx-2 border-radius-15 outline-black tiny-shadow whitespace-nowrap mw-500"
                     onClick={() => copyToClipboard(allAutoLeads[viewingIndex].messageToSend)}
                  ><Copy size={16} /> Copy Message</button>
               </div>
            </>)}
         </>)}

         {(toolView == "update-lead") && (<>
            <UpdateLeadItems
               lead={allAutoLeads[viewingIndex]}
               onSuccess={({ email, phoneNumber }) => setAllAutoLeads(p => {
                  const copiedP = [ ...p ];
                  copiedP[viewingIndex].email = email;
                  copiedP[viewingIndex].phoneNumber = phoneNumber;
                  return ([ ...copiedP ]);
               }) }
            />
         </>)}

         {(toolView == "create-website") && (<>
            <CreateWebsiteConfig
               lead={allAutoLeads[viewingIndex]}
            />
         </>)}

         <Spacing size={7} />
      </div>
   )
}
