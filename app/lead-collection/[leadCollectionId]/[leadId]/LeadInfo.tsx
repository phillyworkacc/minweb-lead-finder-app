"use client"
import { BusinessIcon } from '@/components/Icons/Icon';
import { ChartColumn, Copy, PhoneCall, Search, Star, StarOff, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { insertWebsiteAudit } from '@/app/actions/audit';
import { useRouter } from 'next/navigation';
import { copyToClipboard } from '@/lib/str';
import { useModal } from '@/components/Modal/ModalContext';
import { deleteLeadFromCollection, updateLeadColdCall, updateLeadStarred } from '@/app/actions/leads';
import AppWrapper from '@/components/AppContainer/AppContainer';
import AwaitButton from '@/components/AwaitButton/AwaitButton';
import WebsiteAudit from '@/components/WebsiteAudit/WebsiteAudit';
import Spacing from '@/components/Spacing/Spacing';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Select from '@/components/Select/Select';
import Link from 'next/link';
import MultiActionDropdown from '@/components/MultiActionDropdown/MultiActionDropdown';

type LeadInfoPageProps = {
   lead: Lead;
   leadCollectionName: string;
   websiteAuditReport: WebsiteAuditReport;
}

export default function LeadInfoPage ({ lead, leadCollectionName, websiteAuditReport }: LeadInfoPageProps) {
   const router = useRouter();
   const { showModal, close } = useModal();
   const [websiteAudit, setWebsiteAudit] = useState<WebsiteAudit | null>(websiteAuditReport ? JSON.parse(websiteAuditReport.auditJson) : null);
   const coldCallOptions = ["Missed", "Booked", "Fail", "Not Answered", "Not Called"];

   const showDeleteCollectionModal = (callback: Function) => {
      const onDeleteClicked = async (callback: Function) => {
         const deleted = await deleteLeadFromCollection(lead.leadCollectionsId, lead.leadId);
         if (deleted) {
            toast.success("Deleted Lead: " + lead.name);
            router.push(`/lead-collection/${lead.leadCollectionsId}`);
            close();
         } else {
            toast.error("Failed to delete lead from collection");
            callback();
         }
         callback();
      }

      showModal({
         content: (<>
            <div className="box full dfb column gap-5">
               <div className="text-s pd-1 bold-500 text-center">
                  Are you sure you want to delete {lead.name} ?
               </div>
               <div className="box full dfb align-center justify-center pd-1 gap-10">
                  <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
                  <AwaitButton className="xxs full pd-15 delete whitespace-nowrap" onClick={onDeleteClicked}>
                     <Trash2 size={16} /> Delete
                  </AwaitButton>
               </div>
            </div>
         </>)
      });
      callback();
   }

   const onToggleStarred = async (lead: Lead, starred: boolean) => {
      const updated = await updateLeadStarred(lead.leadId, lead.leadCollectionsId, starred);
      if (updated) {
         toast.success(`${starred ? 'Starred' : 'Un-starred'} ${lead.name}`);
      } else {
         toast.error("Failed to star lead");
      }
      router.refresh();
   }

   const onSelectColdCallOption = async (lead: Lead, option: string) => {
      const updated = await updateLeadColdCall(lead.leadId, lead.leadCollectionsId, option);
      if (updated) {
         toast.success("Update Lead Cold Call Status");
      } else {
         toast.error("Failed to Update Lead Cold Call Status");
      }
      router.refresh();
   }

   return (
      <AppWrapper>
         <div className="box full dfb align-center gap-10 pd-1 mb-1">
            <Breadcrumb
               textSize='xxxs' noDashboard
               pages={[
                  { label: "All Leads", href: "/" },
                  { label: leadCollectionName, href: `/lead-collection/${lead.leadCollectionsId}` },
                  { label: lead.name, href: "" }
               ]}
            />
         </div>
         <div className="box full mb-1">
            <BusinessIcon url={lead.website} size={50} />
         </div>
         <div className="box full dfb gap-5">
            <div className="text-sm full bold-600 pd-1">{lead.name}</div>
            <MultiActionDropdown actions={[
               { label: <><Copy size={15} /> Copy Name</>, action: () => copyToClipboard(lead.name), appearance: "normal" },
               { label: <><Copy size={15} /> Copy Address</>, action: () => copyToClipboard(lead.address), appearance: "normal" },
               { label: <><Copy size={15} /> Copy Phone Number</>, action: () => copyToClipboard(lead.phoneNumber.trim()), appearance: "normal" }
            ]} />
         </div>
         <div className="text-xxs fit pd-05">{lead.address}</div>
         <div className="text-xxs fit pd-05">{lead.phoneNumber ? lead.phoneNumber : 'No Phone Number'}</div>
         {lead.website ? (<>
            <Link href={lead.website} target='_blank' className="text-xxs fit pd-05 link-display">
               {lead.website}
            </Link>
            <div className="box full mt-05">
               {(websiteAudit !== null) ? (<>
                  <WebsiteAudit audit={websiteAudit} lead={lead} />
               </>) : (<>         
                  No Website Audit
               </>)}
            </div>
            <Spacing size={2} />
         </>) : (<>
            <div className="text-xxs full grey-5 pd-05">No Website</div>
            <Spacing />
         </>)}

         <div className="box full pd-1">
            <div className="text-xs full bold-600 pd-1">Actions</div>
            <div className="box full dfb column gap-5">
               {lead.phoneNumber && (
                  <Link href={`tel:${lead.phoneNumber.trim().replaceAll(" ","")}`}>
                     <button className='xxxs fit tiny-shadow pd-1'>
                        <PhoneCall size={15} /> Call
                     </button>
                  </Link>
               )}
               <Link href={`https://google.com/search?q=${lead.name} ${lead.address}`} target='_blank'>
                  <button className='xxxs fit tiny-shadow pd-1'>
                     <Search size={15} /> Search Lead
                  </button>
               </Link>
            </div>
         </div>
         <Spacing />
         
         <div className="box full pd-1">
            <div className="text-xs full bold-600">Starred Lead</div>
            <div className="text-xxxs full grey-5 pd-1">Star or un-star this lead - {lead.name}</div>
            {lead.starred ? (<>
               <button className="xxxs fit outline-black tiny-shadow pd-1" onClick={() => onToggleStarred(lead, false)}>
                  <StarOff size={15} /> Un-star {lead.name}
               </button>
            </>) : (<>
               <button className="xxxs fit tiny-shadow pd-1" onClick={() => onToggleStarred(lead, true)}>
                  <Star size={15} /> Star {lead.name}
               </button>
            </>)}
         </div>
         <Spacing />

         <div className="box full pd-1">
            <div className="text-xs full bold-600">Cold Call Status</div>
            <div className="box full pd-1">
               <Select
                  options={coldCallOptions}
                  onSelect={(option) => onSelectColdCallOption(lead, option)}
                  selectedOptionStyle={{ fontSize: "0.9rem" }}
                  optionStyle={{ fontSize: "0.9rem" }}
                  defaultOptionIndex={coldCallOptions.indexOf(lead.called)}
               />
            </div>
         </div>
         <Spacing />
         
         <AwaitButton className="xxxs pd-1 delete whitespace-nowrap" onClick={showDeleteCollectionModal}>
            <Trash2 size={15} /> Delete Lead
         </AwaitButton>
         
         <Spacing size={3} />
      </AppWrapper>
   )
}