"use client"
import AppWrapper from '@/components/AppContainer/AppContainer';
import { formatMilliseconds } from '@/utils/date';
import { UserRound, UsersRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ListView from '@/components/ListView/ListView';
import CardView from '@/components/CardView/CardView';
import { useState } from 'react';

type LeadsPageProps = {
   leadsCollections: LeadCollection[];
}

export default function LeadsPage ({ leadsCollections }: LeadsPageProps) {
   const router = useRouter();
   const [searchQuery, setSearchQuery] = useState("");

   return (
      <AppWrapper>
         <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
            <UserRound size={20} /> Leads
         </div>
         <div className="text-xxxs grey-5 full pd-05">
            Below are all your leads
         </div>
         <div className="box full pd-05 mb-1">
               <input 
                  type="text"
                  className="xxxs normal-w pd-1 pdx-15"
                  placeholder='Search Lead Collections...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
               />
         </div>
         <div className="box full dfb column gap-10">
            <CardView
               items={leadsCollections.filter(lc => lc.name.toLowerCase().includes(searchQuery.toLowerCase()))}
               itemDisplayComponent={(leadCollection: LeadCollection) => (
                  <div className="box full dfb column gap-5 pd-05 pdx-05" onClick={() => router.push(`/lead-collection/${leadCollection.leadCollectionsId}`)}>
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs fit bold-600">{leadCollection.name}</div>
                        <UsersRound size={16} />
                     </div>
                     <div className="text-t full grey-4">{formatMilliseconds(parseInt(leadCollection.date))}</div>
                  </div>
               )}
            />
         </div>
      </AppWrapper>
   )
}
