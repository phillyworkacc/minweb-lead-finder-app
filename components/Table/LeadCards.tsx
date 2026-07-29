'use client'
import './Table.css'
import { BusinessIcon } from '../Icons/Icon';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Phone, Search, Star, Trash2 } from 'lucide-react';
import { updateLeadColdCall, updateLeadStarred } from '@/app/actions/leads';
import { copyToClipboard } from '@/lib/str';
import Select from '../Select/Select';
import Checkbox from '../Checkbox/Checkbox';
import Link from 'next/link';
import Card from '../Card/Card';
import Spacing from '../Spacing/Spacing';
import { useRouter } from 'next/navigation';
import { useModal } from '../Modal/ModalContext';
import MultiActionDropdown from '../MultiActionDropdown/MultiActionDropdown';
import DeleteLead from '@/modals/DeleteLead';

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

export default function LeadCards ({ title, showFound, showSearch, leads: rawLeads, onClickLead, showCalled, showStarred }: ClientsTableProps) {
   const router = useRouter();
   const { showModal } = useModal();
   const [allLeads, setAllLeads] = useState(rawLeads);
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
         const newLeads = Array.from(allLeads);
         const index = newLeads.indexOf(lead);
         newLeads[index].called = option;
         setAllLeads(prevLeads => ([ ...newLeads ]))
      } else {
         toast.error("Failed to Update Lead Cold Call Status");
      }
   }

   const onToggleStarred = async (lead: Lead, starred: boolean) => {
      const updated = await updateLeadStarred(lead.leadId, lead.leadCollectionsId, starred);
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

   const onDeleteLead = async (lead: Lead) => {
      showModal({ content: <>
         <DeleteLead 
            lead={lead} 
            afterDeleteSuccess={(leadId) => 
               setAllLeads(p => ([ ...p.filter(l => l.leadId !== leadId) ]))
            } 
         /></>
      })
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
         .sort((a, b) => a.name.localeCompare(b.name))
   }

   const leadCardStyle: React.CSSProperties = {
      padding: "25px", width: "100%",
      maxWidth: "550px"
   }

   return (
      <>
         <div className="box full mb-1 pdx-05">
            {(title) && (<div className="text-xs full bold-600 pdx-1 pd-1">{title}</div>)}
            {(showFound) && (<div className="text-xt full grey-4 pdx-1 mb-05">{allLeads.length} found(s)</div>)}
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
                  After filters, {applyFilters(allLeads).filter(lead => lead.name.toLowerCase().includes(searchLeads.toLowerCase())).length} lead(s) found
               </div>
            </div>)}
         </div>
         <div className="box full dfb wrap gap-10">
            {applyFilters(allLeads).map((lead, index) => (
               <Card key={index} styles={leadCardStyle}>
                  <div className="box full dfb mb-1">
                     <div className="box full">
                        <div className="text-xs full bold-600">{lead?.name!}</div>
                        <div className="text-xxxs full grey-5 pd-1">{lead?.address!}</div>
                        {(lead.website) ? (<Link 
                           href={lead?.website!} 
                           className="text-xxxs fit pd-05 grey-5 visible-link" 
                           target='_blank'
                        >{websiteFormatting(lead?.website!)}</Link>) : (<></>)}
                     </div>
                     <div className="box fit">
                        <div className="box full dfb align-center">
                           <BusinessIcon url={lead.website!} size={50} round />
                        </div>
                     </div>
                  </div>
                  <div className="box full dfb wrap gap-10 mt-15">
                     {(lead.phoneNumber) && (<Link href={`tel:${lead.phoneNumber}`} target='_blank'>
                        <button className="xxxxs pd-1 pdx-15 border-radius-15 whitespace-nowrap"><Phone size={14} /> {lead.phoneNumber}</button>
                     </Link>)}
                     <Link href={`https://google.com/search?q=${encodeURIComponent(`${lead.name} ${lead.address}`)}`} target='_blank'>
                        <button className="xxxxs pd-1 pdx-15 border-radius-15 whitespace-nowrap"><Search size={16} /></button>
                     </Link>
                     <StarToggler starred={lead.starred} onToggleStarred={starred => onToggleStarred(lead, starred)} />
                     {showCalled && (
                        <div className="box fit dfb align-center justify-center">
                           <Select
                              options={coldCallOptions}
                              onSelect={(option) => onSelectColdCallOption(lead, option)}
                              selectedOptionStyle={{ fontSize: "0.9rem" }}
                              defaultOptionIndex={coldCallOptions.indexOf(lead.called)}
                           />
                        </div>
                     )}
                  </div>
                  <div className="box full dfb align-center justify-end gap-10 mt-15">
                     <div className="text-xxxs grey-5 full">More Actions</div>
                     <MultiActionDropdown
                        className='outline-black tiny-shadow'
                        actions={[
                           { label: <><Trash2 size={15}/> Delete Lead</>, action: () => onDeleteLead(lead), appearance: "delete" }
                        ]}
                     />
                  </div>
               </Card>
            ))}
         </div>
         <Spacing size={3} />
      </>
   )
}
