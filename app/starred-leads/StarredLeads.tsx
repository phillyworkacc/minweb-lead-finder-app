"use client"
import { ChevronLeft, Star } from 'lucide-react';
import { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { pluralSuffixer } from '@/lib/str';
import AppWrapper from '@/components/AppContainer/AppContainer';
import LeadsTable from '@/components/Table/LeadsTable';

type StarredLeadsPageProps = {
   starredLeads: Lead[];
}

export default function StaredLeadsPage ({ starredLeads }: StarredLeadsPageProps) {
   const router = useRouter();
   const cardStyles: CSSProperties = {
      width: "100%", boxShadow: "0 2px 5px rgba(0,0,0,0.098)",
      borderRadius: "15px", padding: "15px 20px"
   }

   return (
      <AppWrapper>
         <div className="box full pd-1 mb-05">
            <div className="text-xxxs fit cursor-pointer dfb align-center gap-5" onClick={() => router.push('/')}>
               <ChevronLeft size={14} /> Back to All Leads
            </div>
         </div>
         <div className="box full dfb align-center">
            <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
               <Star size={20} /> Starred Leads
            </div>
         </div>
         <div className="text-xxxs grey-5 full pd-05">
            Below are all your the leads you have starred
         </div>
         <div className="text-xxxs grey-5 full pd-05 mb-1">
            Contains {starredLeads.length} {pluralSuffixer('lead', starredLeads.length, 's')}
         </div>
         <div className="box full dfb column gap-5">
            <LeadsTable 
               leads={starredLeads} 
               onClickLead={(lead) => router.push(`/lead-collection/${lead.leadCollectionsId}/${lead.leadId}`)}
               showSearch showCalled showStarred
            />
         </div>
      </AppWrapper>
   )
}
