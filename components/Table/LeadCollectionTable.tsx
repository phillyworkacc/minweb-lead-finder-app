'use client'
import './Table.css'
import { titleCase } from '@/lib/str';
import { formatMilliseconds } from '@/utils/date';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../Modal/ModalContext';
import DeleteLeadList from '@/modals/DeleteLeadList';

type LeadCollectionsTableProps = {
   leadCollections: any[];
   onClickLeadCollection?: (leadCollection: any) => void;
}

export default function LeadCollectionTable ({ leadCollections: rawLeadLists, onClickLeadCollection }: LeadCollectionsTableProps) {
   const { showModal } = useModal();
   const [leadCollections, setLeadCollections] = useState(rawLeadLists);
   
   const onDeleteLeadList = async (leadCollection: any) => {
      showModal({ content: <>
         <DeleteLeadList 
            leadCollection={leadCollection} 
            afterDeleteSuccess={(leadCollectionsId) => 
               setLeadCollections(p => ([ ...p.filter(l => l.leadCollectionsId !== leadCollectionsId) ]))
            } 
         />
      </>})
   }

   console.log(rawLeadLists)

   return (
      <div className="table-container">
         <table className="leads-table">
            <thead>
               <tr id='head-row'>
                  <th>Name</th>
                  <th>Total Leads</th>
                  <th>Delete</th>
               </tr>
            </thead>
            <tbody>
               {leadCollections.map((leadCollection, index) => (
                  <tr key={index}>
                     <td onClick={() => { if (onClickLeadCollection) onClickLeadCollection(leadCollection); }}>
                        <div className="box full dfb column gap-5">
                           <div className="text-xs full text-left bold-600">{leadCollection.name}</div>
                           <div className="text-xxxs full text-left grey-5">{formatMilliseconds(parseInt(leadCollection.date))}</div>
                           <div className="box full dfb align-center gap-5 wrap">
                              {leadCollection.folders}
                              {!leadCollection.folders.includes(",") || leadCollection.folders == "" ? (<>
                                 
                              </>) : (<>
                                 {leadCollection.folders.split(",").filter((lc: any) => lc !== "all").map((folderName: any) => (
                                    <div key={folderName} className="folder-tag box fit pd-05 pdx-1">
                                       <div className="text-xt bold-600 whitespace-nowrap">{titleCase(folderName.replaceAll("-", " "))}</div>
                                    </div>
                                 ))}
                              </>)}
                           </div>
                        </div>
                     </td>
                     <td onClick={() => { if (onClickLeadCollection) onClickLeadCollection(leadCollection); }}>
                        {leadCollection.leadCount} lead(s)
                     </td>
                     <td>
                        <button 
                           className="xxxxs pd-1 pdx-1 delete tiny-shadow"
                           onClick={() => onDeleteLeadList(leadCollection)}
                        >
                           <Trash2 size={13} /> Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}
