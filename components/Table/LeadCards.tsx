'use client'
import './Table.css'
import { BusinessIcon } from '../Icons/Icon';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Phone, Search, Star } from 'lucide-react';
import { updateLeadColdCall, updateLeadStarred } from '@/app/actions/leads';
import { copyToClipboard } from '@/lib/str';
import Select from '../Select/Select';
import Checkbox from '../Checkbox/Checkbox';
import Link from 'next/link';
import Card from '../Card/Card';

type ClientsTableProps = {
   title?: string;
   leads: any[];
   onClickLead?: (lead: any) => void;
   showFound?: boolean;
   showSearch?: boolean;
   showCalled?: boolean;
   showStarred?: boolean;
}

interface Filters extends Record<string, null | boolean> {
   hasWebsite: null | boolean;
   hasNoWebsite: null | boolean;
   hasPhoneNumber: null | boolean;
   isStarred: null | boolean;
}

function StarToggler ({ starred, onToggleStarred }: { starred: boolean, onToggleStarred: (starred: boolean) => void; }) {
   const [starredState, setStarredState] = useState(starred);
   return (
      <div className="box full dfb align-center justify-center" onClick={() => {
         onToggleStarred(!starredState);
         setStarredState(prev => !prev);
      }}>
         <Star
            size={17}
            color={starredState ? '#ffa600' : '#000'}
            fill={starredState ? '#ffa600' : '#fff'}
         />
      </div>
   )
}

export default function LeadCards ({ title, showFound, showSearch, leads, onClickLead, showCalled, showStarred }: ClientsTableProps) {
   const [callState, setCallState] = useState<undefined | "Missed" | "Booked" | "Fail" | "Not Answered" | "Not Called">(undefined);
   const [searchLeads, setSearchLeads] = useState('');
   const [filters, setFilters] = useState<Filters>({
      hasWebsite: null,
      hasNoWebsite: null,
      hasPhoneNumber: null,
      isStarred: null
   });

   const websiteFormatting = (url: string) => {
      return (url.length > 35) ? `${url.toLowerCase().substring(0,35)}...` : `${url.toLowerCase()}`;
   }

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
      } else {
         toast.error("Failed to star lead");
      }
   }

   const applyFilters = (leads: Lead[]): Lead[] => {
      if (!showSearch) return leads;
      return leads
         .filter(lead => lead.name.toLowerCase().includes(searchLeads.toLowerCase())) // search filter
         .filter(lead => {
            if (!filters.hasWebsite) return true;
            return (lead.website !== null && lead.website !== undefined && lead.website !== '')
         }) // filter for websites
         .filter(lead => {
            if (!filters.hasNoWebsite) return true;
            return (lead.website == null || lead.website == undefined || lead.website == '')
         }) // filter for websites
         .filter(lead => {
            if (!filters.hasPhoneNumber) return true;
            return (lead.phoneNumber !== null && lead.phoneNumber !== undefined && lead.phoneNumber !== '')
         }) // filter for phone numbers
         .filter(lead => {
            if (!filters.isStarred == null) return true;
            if (!filters.isStarred) return true;
            return (lead.starred)
         }) // filter for starred leads
         .filter(lead => {
            if (!callState) return true;
            if (lead.called == callState) return true;
         }) // filter for lead call state
   }

   const leadCardStyle: React.CSSProperties = {
      padding: "20px", width: "100%",
      maxWidth: "380px"
   }

   return (
      <>
         <div className="box full mb-1 pdx-05">
            {(title) && (<div className="text-xs full bold-600 pdx-1 pd-1">{title}</div>)}
            {(showFound) && (<div className="text-xt full grey-4 pdx-1 mb-05">{leads.length} found(s)</div>)}
            {(showSearch) && (<div className='box full dfb column'>
               <div className="box full pd-05">
                  <input
                     type="text"
                     className="xxxxs full pd-1 pdx-15 tiny-shadow"
                     placeholder='Search leads...'
                     value={searchLeads}
                     onChange={e => setSearchLeads(e.target.value)}
                  />
               </div>
               <div className="box full dfb wrap align-center gap-15 pd-05 mb-15">
                  <Checkbox 
                     label='Has Website'
                     onChange={t => setFilters(p => ({ ...p, hasWebsite: t || null }))}
                  />
                  <Checkbox 
                     label='Has No Website'
                     onChange={t => setFilters(p => ({ ...p, hasNoWebsite: t || null }))}
                  />
                  <Checkbox 
                     label='Has Phone Number'
                     onChange={t => setFilters(p => ({ ...p, hasPhoneNumber: t }))}
                  />
                  <Checkbox 
                     label='Starred'
                     onChange={t => setFilters(p => ({ ...p, isStarred: t }))}
                  />
                  <Select
                     options={["Any", ...coldCallOptions]}
                     onSelect={(option) => setCallState(option == "Any" ? undefined : option)}
                     selectedOptionStyle={{ fontSize: "0.8rem" }}
                     optionStyle={{ fontSize: "0.8rem" }}
                     defaultOptionIndex={0}
                  />
               </div>
            </div>)}
            {(
               searchLeads !== '' ||
               Object.keys(filters).map((k) => filters[k]).includes(true)
            ) && (<div className="box full mb-05">
               <div className="text-xxxs full grey-4 mb-05">
                  After filters, {applyFilters(leads).filter(lead => lead.name.toLowerCase().includes(searchLeads.toLowerCase())).length} lead(s) found
               </div>
            </div>)}
         </div>
         <div className="box full dfb wrap gap-10">
            {applyFilters(leads).map((lead, index) => (
               <Card key={index} styles={leadCardStyle}>
                  <div className="box full dfb align-center mb-1">
                     <BusinessIcon url={lead.website!} size={50} round />
                  </div>
                  <div className="text-xs full bold-600">{lead?.name!}</div>
                  <div className="text-xxxs full pd-05">{lead?.phoneNumber!}</div>
                  <div className="text-xxxs full mb-1">{lead?.website!}</div>
                  <div className="box full dfb wrap gap-10">
                     <Link href={`https://google.com/search?q=${lead.name} ${lead.address}`} target='_blank'>
                        <button className="xxxxs pd-1 pdx-15 border-radius-15 whitespace-nowrap"><Search size={14} /> Search</button>
                     </Link>
                     <Link href={`tel:${lead.phoneNumber}`} target='_blank'>
                        <button className="xxxxs pd-1 pdx-15 border-radius-15 whitespace-nowrap"><Phone size={14} /> Call</button>
                     </Link>
                  </div>
               </Card>
            ))}
         </div>
      </>
   )
}
