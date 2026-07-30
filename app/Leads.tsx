"use client"
import { ChevronDown, FolderPlus, Plus, UserRound, UserRoundSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useModal } from '@/components/Modal/ModalContext';
import { getFolders } from './actions/utils';
import AppWrapper from '@/components/AppContainer/AppContainer';
import Spacing from '@/components/Spacing/Spacing';
import Select from '@/components/Select/Select';
import LeadCollectionTable from '@/components/Table/LeadCollectionTable';
import CreateList from '@/modals/CreateList';
import CreateFolder from '@/modals/CreateFolder';
import MultiActionDropdown from '@/components/MultiActionDropdown/MultiActionDropdown';
import FindLeads from '@/modals/FindLeads';

type ExpandedLeadCollection = LeadCollection & { leadCount: number };
type LeadsPageProps = {
   leadsCollections: ExpandedLeadCollection[];
}

export default function LeadsPage ({ leadsCollections: rawLeadLists }: LeadsPageProps) {
   const router = useRouter();
   const { showModal } = useModal();
   const [searchQuery, setSearchQuery] = useState("");
   const [leadsCollections, setLeadsCollections] = useState(rawLeadLists);
   const [folders, setFolders] = useState<string[]>(["All"]);

   async function getAllFolders () {
      const allFolders: any[] = await getFolders();
      setFolders(p => ([ "All", ...allFolders.map(f => f.name) ]));
   }

   useEffect(() => { getAllFolders() }, [])

   function openCreateLeadList () {
      showModal({ content: <CreateList /> })
   }

   function openCreateFolder () {
      showModal({ content: <CreateFolder /> })
   }

   function openFindLeads () {
      showModal({ content: <FindLeads /> })
   }

   return (
      <AppWrapper>
         <Spacing size={2} />
         <div className="text-l full pd-1 bold-500 dfb align-center gap-10">
            <UserRound size={30} /> Hello. Find more leads today!
         </div>
         <div className="text-xs grey-5 full pd-05 mb-2">Cold Calls. Mark. Star. Qualify</div>
         <div className="horizontal-convertible box full gap-10 pd-05 mb-1">
            <Select
               style={{ padding: "3px 10px", width: "100%", maxWidth: "200px" }}
               selectedOptionStyle={{ textAlign: "left", width: "100%" }}
               options={folders}
               onSelect={(folder) => {
                  const selectedFolderName = folder.toLowerCase().replaceAll(" ", "-");
                  setLeadsCollections(prev => ([
                     ...rawLeadLists.filter(leadList => leadList.folders.split(",").includes(selectedFolderName))
                  ]))
               }}
            />
            <input 
               type="text"
               className="xxxs pd-13 pdx-2 tiny-shadow full"
               placeholder='Search Lead Collections...'
               style={{ maxWidth: "300px" }}
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="box full dfb justify-end gap-10">
               <MultiActionDropdown
                  className="xxxs outline-black pd-12 pdx-15 tiny-shadow border-radius-15"
                  actions={[
                     { appearance: "normal", label: <><Plus size={18} /> Create List</>, action: openCreateLeadList },
                     { appearance: "normal", label: <><FolderPlus size={18} /> Create Folder</>, action: openCreateFolder },
                     { appearance: "normal", label: <><UserRoundSearch size={18} /> Find Leads</>, action: openFindLeads },
                  ]}
               >
                  Options <ChevronDown size={18} />
               </MultiActionDropdown>
            </div>
         </div>
         <div className="box full dfb column gap-10">
            <LeadCollectionTable
               leadCollections={leadsCollections.filter(lc => lc.name.toLowerCase().includes(searchQuery.toLowerCase()))}
               onClickLeadCollection={leadsCollection => router.push(`/lead-collection/${leadsCollection.leadCollectionsId}`)}
            />
         </div>
      </AppWrapper>
   )
}
