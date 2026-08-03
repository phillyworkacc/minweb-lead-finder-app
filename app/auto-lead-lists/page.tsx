"use client"
import { ChevronDown, ScrollText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllAutomatedLeadLists } from '../actions/lead-automation';
import AppWrapper from '@/components/AppContainer/AppContainer';
import Spacing from '@/components/Spacing/Spacing';
import LeadCollectionTable from '@/components/Table/LeadCollectionTable';
import MultiActionDropdown from '@/components/MultiActionDropdown/MultiActionDropdown';
import LoadingLeadsPage from '../loading';
import AutoLeadListTable from '@/components/Table/AutoLeadListTable';

type ExpandedAutomatedLeadList = AutomatedLeadList & { leadCount: number };

export default function LeadsPage () {
   const router = useRouter();
   const [searchQuery, setSearchQuery] = useState("");
   const [autoLeadLists, setAutoLeadLists] = useState<ExpandedAutomatedLeadList[] | null>(null);

   async function loadAll () {
      const allAutoLeadLists: any[] = await getAllAutomatedLeadLists();
      setAutoLeadLists(p => ([ ...allAutoLeadLists ]));
   }

   useEffect(() => { loadAll() }, [])

   if (autoLeadLists == null) return <LoadingLeadsPage />

   return (
      <AppWrapper>
         <Spacing size={2} />
         <div className="text-l full pd-1 bold-600 dfb align-center gap-10">
            Hello. See all newly automated leads!
         </div>
         <div className="text-xs grey-5 full pd-05 mb-2">Automatically send emails, validate and create offers.</div>
         <div className="horizontal-convertible box full gap-10 pd-05 mb-1">
            <input 
               type="text"
               className="xxxs pd-13 pdx-2 tiny-shadow full"
               placeholder='Search Auto Lead Lists...'
               style={{ maxWidth: "300px" }}
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="box full dfb justify-end gap-10">
               <MultiActionDropdown
                  className="xxxs outline-black pd-12 pdx-15 tiny-shadow border-radius-15"
                  actions={[
                     { appearance: "normal", label: <><ScrollText size={18} /> Lead Automation Queue</>, action: () => router.push("/automated-leads-queue") },
                  ]}
               >
                  Options <ChevronDown size={18} />
               </MultiActionDropdown>
            </div>
         </div>
         <div className="box full dfb column gap-10">
            <AutoLeadListTable
               autoLeadLists={autoLeadLists.filter(lc => lc.name.toLowerCase().includes(searchQuery.toLowerCase()))}
               onClickAutoLeadList={autoLeadList => router.push(`/auto-lead-list/${autoLeadList.leadListId}`)}
            />
         </div>
      </AppWrapper>
   )
}