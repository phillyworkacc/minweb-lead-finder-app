"use client"
import { FolderPen, Trash2, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/Modal/ModalContext';
import { pluralSuffixer } from '@/lib/str';
import { toast } from 'sonner';
import { deleteLeadCollection } from '@/app/actions/leads';
import AppWrapper from '@/components/AppContainer/AppContainer';
import LeadsTable from '@/components/Table/LeadsTable';
import AwaitButton from '@/components/AwaitButton/AwaitButton';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import EditLeadCollectionName from '@/components/Forms/EditLeadCollectionName';
import MultiActionDropdown from '@/components/MultiActionDropdown/MultiActionDropdown';

type LeadCollectionPageProps = {
   leadCollectionName: string;
   leads: Lead[];
   leadCollection: LeadCollection;
}

export default function LeadCollectionPage ({ leads, leadCollectionName, leadCollection }: LeadCollectionPageProps) {
   const router = useRouter();
   const { showModal, close } = useModal();

   const showDeleteCollectionModal = () => {
      const onDeleteClicked = async (callback: Function) => {
         const deleted = await deleteLeadCollection(leads[0].leadCollectionsId);
         if (deleted) {
            toast.success("Deleted Lead Collection: " + leadCollectionName);
            router.push("/leads");
            close();
         } else {
            toast.error("Failed to delete lead collection");
            callback();
         }
      }

      showModal({
         content: (<>
            <div className="box full dfb column gap-5">
               <div className="text-s pd-1 bold-500 text-center">
                  Are you sure you want to delete this Lead Collection ({leadCollectionName}) ?
               </div>
               <div className="text-xxs grey-4 text-center">{leadCollectionName} has {leads.length} {pluralSuffixer('lead', leads.length, 's')}</div>
               <div className="box full dfb align-center justify-center pd-1 gap-10">
                  <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
                  <AwaitButton className="xxs full pd-15 delete whitespace-nowrap" onClick={onDeleteClicked}>
                     <Trash2 size={16} /> Delete
                  </AwaitButton>
               </div>
            </div>
         </>)
      });
   }

   const showEditCollectionNameModal = () => {
      showModal({ content: (<><EditLeadCollectionName leadCollection={leadCollection} /></>) });
   }

   return (
      <AppWrapper>
         <div className="box full pd-1">
            <Breadcrumb
               textSize='xxxs' noDashboard
               pages={[
                  { label: "All Leads", href: "/" },
                  { label: leadCollectionName, href: "" }
               ]}
            />
         </div>
         <div className="box full dfb align-center gap-10">
            <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
               {leadCollectionName} 
            </div>
            <MultiActionDropdown actions={[
               { label: <><FolderPen size={15} /> Edit Name</>, action: showEditCollectionNameModal, appearance: "normal" },
               { label: <><Trash2 size={15} /> Delete Lead Collection</>, action: showDeleteCollectionModal, appearance: "delete" }
            ]} />
         </div>
         <div className="text-xxxs grey-5 full pd-05">
            Below are all your leads in {leadCollectionName}
         </div>
         <div className="text-xxxs grey-5 full pd-05 mb-1">
            Contains {leads.length} {pluralSuffixer('lead', leads.length, 's')}
         </div>
         <div className="box full dfb column gap-5">
            <LeadsTable 
               leads={leads} 
               onClickLead={(lead) => router.push(`/lead-collection/${lead.leadCollectionsId}/${lead.leadId}`)}
               showSearch showCalled showStarred
            />
         </div>
      </AppWrapper>
   )
}
