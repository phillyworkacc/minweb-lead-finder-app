'use client'
import './Table.css'
import React, { useState } from 'react';
import { BusinessIcon } from '../Icons/Icon';
import { toast } from 'sonner';
import { Funnel, Globe, Mail, MapPin, Phone, Star } from 'lucide-react';
import { updateLeadColdCall, updateLeadStarred } from '@/app/actions/leads';
import { useModal } from '../Modal/ModalContext';
import { leadOffersResolver, leadScoreResolver, websiteScrapedInfoResolver } from '@/machine/typeResolver';
import { AutomatedLeadsFilterActionDropdown } from '../MultiActionDropdown/MultiActionDropdown';
import { filterDropdownActions, leadCardItemEllipsis, websiteFormatting } from '@/machine/helpers';
import Select from '../Select/Select';
import Card from '../Card/Card';
import Spacing from '../Spacing/Spacing';
import AutoLeadsCardView from '@/modals/AutoLeadsCardView';

type AutomatedLeadCardsProps = {
   automatedLeads: AutomatedLead[];
}

interface Filters extends Record<string, null | boolean> {
   hasEmail: null | boolean;
   hasWebsite: null | boolean;
   hasNoWebsite: null | boolean;
   hasPhoneNumber: null | boolean;
   hasSocialMedia: null | boolean;
   hasHighPriority: null | boolean;
   hasMediumPriority: null | boolean;
   hasLowPriority: null | boolean;
   isStarred: null | boolean;
   needsSeo: null | boolean;
   needsSMMA: null | boolean;
   needsMissedCallTB: null | boolean;
   needsWebRedesignMaintenance: null | boolean;
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

export default function AutomatedLeadCards ({ automatedLeads }: AutomatedLeadCardsProps) {
   const { showMassiveModal } = useModal();
   const [allLeads, setAllLeads] = useState<AutomatedLead[]>(automatedLeads);
   const [callState, setCallState] = useState<undefined | "Missed" | "Booked" | "Fail" | "Not Answered" | "Not Called">(undefined);
   const [searchLeads, setSearchLeads] = useState('');
   const [filters, setFilters] = useState<Filters>({
      hasEmail: null,
      hasWebsite: null,
      hasNoWebsite: null,
      hasPhoneNumber: null,
      hasSocialMedia: null,
      hasHighPriority: null,
      hasMediumPriority: null,
      hasLowPriority: null,
      isStarred: null,
      needsSeo: null,
      needsSMMA: null,
      needsMissedCallTB: null,
      needsWebRedesignMaintenance: null
   });

   const coldCallOptions = ["Missed", "Booked", "Fail", "Not Answered", "Not Called"];

   const onSelectColdCallOption = async (lead: AutomatedLead, option: string) => {
      const updated = await updateLeadColdCall(lead.leadId, lead.leadListId, option);
      if (updated) {
         toast.success("Update Lead Cold Call Status");
         const newLeads = Array.from(allLeads);
         const index = newLeads.indexOf(lead);
         newLeads[index].called = option;
         setAllLeads(prevLeads => ([ ...newLeads ]))
      } else {
         toast.error("Failed to Update Lead Cold Call Status");
      }
   }

   const onToggleStarred = async (lead: AutomatedLead, starred: boolean) => {
      const updated = await updateLeadStarred(lead.leadId, lead.leadListId, starred);
      if (updated) {
         toast.success(starred ? `Starred ${lead.name}` : `Un-starred ${lead.name}`);
         const newLeads = Array.from(allLeads);
         const index = newLeads.indexOf(lead);
         newLeads[index].starred = starred;
         setAllLeads(prevLeads => ([ ...newLeads ]))
      } else {
         toast.error("Failed to star lead");
      }
   }

   const applyFilters = (leads: AutomatedLead[]): AutomatedLead[] => {
      return leads
         .filter(lead => (
            lead.name.toLowerCase().includes(searchLeads.toLowerCase()) ||
            lead.address.toLowerCase().includes(searchLeads.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchLeads.toLowerCase())
         )) // search filter
         .filter(lead => {
            if (!filters.hasEmail) return true;
            return (lead.email !== "");
         }) // filter for has email
         .filter(lead => {
            if (!filters.hasWebsite) return true;
            return (lead.website !== null && lead.website !== undefined && lead.website !== '')
         }) // filter for websites
         .filter(lead => {
            if (!filters.hasNoWebsite) return true;
            return (lead.website == null || lead.website == undefined || lead.website == '')
         }) // filter for no websites
         .filter(lead => {
            if (!filters.hasPhoneNumber) return true;
            return (lead.phoneNumber !== null && lead.phoneNumber !== undefined && lead.phoneNumber !== '')
         }) // filter for phone numbers
         .filter(lead => {
            if (!filters.hasSocialMedia) return true;
            if (lead.websiteScrapedInfo == "") return false;
            const socialLinks: any = websiteScrapedInfoResolver(lead.websiteScrapedInfo).socialLinks;
            return Object.keys(socialLinks).reduce((prev, curr) => {
               if (prev == true) return true;
               return (socialLinks[curr] !== "")
            }, false);
         }) // filter for has social media
         .filter(lead => {
            if (!filters.hasHighPriority && !filters.hasMediumPriority && !filters.hasLowPriority) return true;
            if (lead.leadScore == "") return false;

            const priorities = [];
            if (filters.hasHighPriority) priorities.push("High");
            if (filters.hasMediumPriority) priorities.push("Medium");
            if (filters.hasLowPriority) priorities.push("Low");

            return priorities.includes(leadScoreResolver(lead.leadScore).priority);
         }) // filter for has high, medium and low priority
         .filter(lead => {
            if (!filters.isStarred == null) return true;
            if (!filters.isStarred) return true;
            return (lead.starred)
         }) // filter for starred leads
         .filter(lead => {
            if (!callState) return true;
            if (lead.called == callState) return true;
         }) // filter for lead call state
         .filter(lead => {
            if (!filters.needsSMMA) return true;
            if (lead.offersForLead == "") return false;

            const offersNeeded: string[] = [];
            if (filters.needsSMMA) offersNeeded.push("Social media management");
            if (filters.needsSeo) offersNeeded.push("SEO");
            if (filters.needsMissedCallTB) offersNeeded.push("Missed Call Text Back");
            if (filters.needsWebRedesignMaintenance) offersNeeded.push("Website redesign", "Website maintenance");

            const containsAnyOffers = leadOffersResolver(lead.offersForLead).filter(offer => offersNeeded.includes(offer.offer));
            return containsAnyOffers.length > 0;
         }) // filter for needs smma, seo, missed call tb, web redesign or web maintenance
         .sort((a, b) => a.name.localeCompare(b.name)) // order in ascending order
   }

   const leadCardStyle: React.CSSProperties = {
      padding: "25px", width: "100%",
      maxWidth: "550px"
   }

   function openFilteredAutoLeadsView (lead: AutomatedLead) {
      showMassiveModal({
         content: <AutoLeadsCardView 
            automatedLeads={applyFilters(allLeads)} 
            currentLeadIndex={applyFilters(allLeads).indexOf(lead)}
         />
      })
   }

   return (
      <>
         <div className="box full mb-1 mt-1">
            <div className='box full dfb column'>
               <div className="box full dfb align-center gap-5 pd-05">
                  <input
                     type="text"
                     className="xxxs full pd-12 pdx-2 tiny-shadow"
                     placeholder='Search Leads...'
                     value={searchLeads}
                     onChange={e => setSearchLeads(e.target.value)}
                  />
                  <AutomatedLeadsFilterActionDropdown
                     actions={[ ...filterDropdownActions(filters, setFilters) ]}
                     className='xs pd-12 fit pdx-15 outline-black tiny-shadow'
                  >
                     <Funnel size={16} />
                  </AutomatedLeadsFilterActionDropdown>
               </div>
               <div className="box full dfb wrap align-center gap-15 pd-05 mb-15">
                  <Select
                     options={["Any", ...coldCallOptions]}
                     onSelect={(option) => setCallState(option == "Any" ? undefined : option)}
                     selectedOptionStyle={{ fontSize: "0.8rem" }}
                     optionStyle={{ fontSize: "0.8rem" }}
                     defaultOptionIndex={0}
                  />
               </div>
            </div>
            {(
               searchLeads !== '' ||
               Object.keys(filters).map((k) => filters[k]).includes(true)
            ) && (<div className="box full mb-05">
               <div className="text-xxxs full grey-4 mb-05">
                  After filters, {applyFilters(allLeads).length} lead(s) found
               </div>
            </div>)}
         </div>
         <div className="box full dfb wrap gap-10">
            {applyFilters(allLeads).map((lead, index) => (
               <Card key={index} cursor styles={leadCardStyle} onClick={() => openFilteredAutoLeadsView(lead)}>
                  <div className="box full dfb mb-1">
                     <div className="box full">
                        <div className="text-xs full bold-600 mb-05">{lead?.name!}</div>
                        <div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                           <div className="box fit"><MapPin size={15} /></div> {leadCardItemEllipsis(lead?.address!)}
                        </div>
                        {(lead.email) ? (<div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                           <Mail size={15} /> {leadCardItemEllipsis(lead.email)}
                        </div>) : (<></>)}
                        {(lead.phoneNumber) ? (<div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                           <Phone size={15} /> {leadCardItemEllipsis(lead.phoneNumber)}
                        </div>) : (<></>)}
                        {(lead.website) ? (<div className="text-xxxs full grey-5 pd-05 dfb align-center gap-10">
                           <Globe size={15} /> {websiteFormatting(lead?.website!)}
                        </div>) : (<></>)}
                     </div>
                     <div className="box fit">
                        <div className="box full dfb align-center">
                           <BusinessIcon url={lead.website!} size={50} round />
                        </div>
                     </div>
                  </div>
               </Card>
            ))}
         </div>
         <Spacing size={3} />
      </>
   )
}
