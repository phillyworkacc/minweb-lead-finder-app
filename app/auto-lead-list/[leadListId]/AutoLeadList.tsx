"use client"
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/Modal/ModalContext';
import { pluralSuffixer } from '@/lib/str';
import { toast } from 'sonner';
import { calculateOpportunityScore } from '@/machine/opportunityScorer';
import { deleteAutomatedLeadList } from '@/app/actions/lead-automation';
import AppWrapper from '@/components/AppContainer/AppContainer';
import AwaitButton from '@/components/AwaitButton/AwaitButton';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import MultiActionDropdown from '@/components/MultiActionDropdown/MultiActionDropdown';
import OppScoreProgress from '@/components/OppScoreProgress/OppScoreProgress';
import AutomatedLeadCards from '@/components/Table/AutomatedLeadCards';

type AutoLeadListPageProps = {
   automatedLeads: AutomatedLead[];
   automatedLeadList: AutomatedLeadList;
}

export default function AutoLeadListPage ({ automatedLeadList, automatedLeads }: AutoLeadListPageProps) {
   const router = useRouter();
   const { showModal, close } = useModal();

   const showDeleteAutoLeadListModal = () => {
      const onDeleteClicked = async (callback: Function) => {
         const deleted = await deleteAutomatedLeadList(automatedLeads[0].leadListId);
         if (deleted) {
            toast.success("Deleted Automated Lead List: " + automatedLeadList.name);
            router.push("/auto-lead-lists");
            close();
         } else {
            toast.error("Failed to delete automated lead list");
            callback();
         }
      }

      showModal({
         content: (<>
            <div className="box full dfb column gap-5">
               <div className="text-s pd-1 bold-500 text-center">
                  Are you sure you want to delete this Automated Lead List ({automatedLeadList.name}) ?
               </div>
               <div className="text-xxs grey-4 text-center">{automatedLeadList.name} has {automatedLeads.length} {pluralSuffixer('lead', automatedLeads.length, 's')}</div>
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

   return (
      <AppWrapper>
         <div className="box full pd-1">
            <Breadcrumb
               textSize='xxxs' noDashboard
               pages={[
                  { label: "All Automated Leads", href: "/auto-lead-lists" },
                  { label: automatedLeadList.name, href: "" }
               ]}
            />
         </div>
         <div className="box full dfb align-center gap-10">
            <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
               {automatedLeadList.name} 
            </div>
            <MultiActionDropdown actions={[
               { label: <><Trash2 size={15} /> Delete Auto Lead List</>, action: showDeleteAutoLeadListModal, appearance: "delete" }
            ]} />
         </div>
         <div className="text-xxxs grey-5 full pd-05">Below are all your leads in {automatedLeadList.name}</div>
         <div className="text-xxxs grey-5 full pd-05 mb-1">
            Contains {automatedLeads.length} {pluralSuffixer('lead', automatedLeads.length, 's')}
         </div>
         <div className="box full dfb wrap gap-10 pd-1 mb-1">
            <OppScoreProgress opportunityScore={calculateOpportunityScore(automatedLeads)} />
         </div>
         <div className="box full dfb column gap-5">
            <AutomatedLeadCards automatedLeads={automatedLeads} />
         </div>
      </AppWrapper>
   )
}
