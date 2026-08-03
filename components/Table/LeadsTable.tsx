'use client'
import './Table.css'
import { BusinessIcon } from '../Icons/Icon';
import { useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Phone, Search, Star } from 'lucide-react';
import { updateLeadColdCall, updateLeadStarred } from '@/app/actions/leads';
import { copyToClipboard } from '@/lib/str';
import Select from '../Select/Select';
import Checkbox from '../Checkbox/Checkbox';
import Link from 'next/link';
import MultiActionDropdown from '../MultiActionDropdown/MultiActionDropdown';
import { useModal } from '../Modal/ModalContext';
import LeadCardView from '@/modals/AutoLeadsCardView';

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

export default function LeadsTable ({ title, showFound, showSearch, leads: leadsFromList, onClickLead, showCalled, showStarred }: ClientsTableProps) {
   const { showModal } = useModal();
   const [leads, setLeads] = useState(leadsFromList);
   const [leadViewCurrentIndex, setLeadViewCurrentIndex] = useState(-1);
   const [callState, setCallState] = useState<undefined | "Missed" | "Booked" | "Fail" | "Not Answered" | "Not Called">(undefined);
   const [searchLeads, setSearchLeads] = useState('');
   const [filters, setFilters] = useState<Filters>({
      hasWebsite: null,
      hasNoWebsite: null,
      hasPhoneNumber: null,
      isStarred: null
   });

   const coldCallOptions = ["Missed", "Booked", "Fail", "Not Answered", "Not Called"];

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
         <div className="table-container">
            <table className="leads-table">
               <thead>
                  <tr id='head-row'>
                     <th style={{ width: "80%" }}>Name</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {applyFilters(leads).map((lead, index) => (
                     <tr key={index}>
                        <td 
                           className='name' 
                           onClick={() => {
                              setLeadViewCurrentIndex(index);
                           }}
                        >
                           <div className="box full dfb align-center gap-10">
                              <div className="box fit dfb align-center justify-center">
                                 <BusinessIcon url={lead.website!} size={30} round />
                              </div>
                              <div className="box full dfb column">
                                 <div className="text-xxs bold-600 full" style={{ whiteSpace: "break-spaces" }}>{lead?.name!}</div>
                              </div>
                           </div>
                        </td>
                        <td>
                           <div className="box fit dfb column">
                              <MultiActionDropdown
                                 className='xxxs pd-1 pdx-15 outline-black tiny-shadow'
                                 actions={[
                                    { 
                                       appearance: "normal", 
                                       label: <><Search size={14} /> Search</>, 
                                       action: () => window.open(`https://google.com/search?q=${encodeURIComponent(`${lead.name} ${lead.address}`)}`, "_blank")
                                    },
                                    { 
                                       appearance: "normal", 
                                       label: <><Phone size={14} /> Call</>, 
                                       action: () => window.open(`tel:${lead.phoneNumber}`, "_blank")
                                    }
                                 ]}
                              >
                                 Actions <ChevronDown size={17} />
                              </MultiActionDropdown>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}
