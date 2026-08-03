'use client'
import './Table.css'
import { titleCase } from '@/lib/str';
import { formatMilliseconds } from '@/utils/date';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useModal } from '../Modal/ModalContext';
import DeleteAutoLeadList from '@/modals/DeleteAutoLeadList';

type AutoLeadListTableProps = {
   autoLeadLists: any[];
   onClickAutoLeadList?: (autoLeadList: any) => void;
}

export default function AutoLeadListTable ({ autoLeadLists: rawLeadLists, onClickAutoLeadList }: AutoLeadListTableProps) {
   const { showModal } = useModal();
   const [leadCollections, setLeadCollections] = useState(rawLeadLists);
   
   const onDeleteLeadList = async (autoLeadList: any) => {
      showModal({ content: <>
         <DeleteAutoLeadList 
            autoLeadList={autoLeadList} 
            afterDeleteSuccess={leadListId => 
               setLeadCollections(p => ([ ...p.filter(l => l.leadListId !== leadListId) ]))
            } 
         /></>
      })
   }

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
                     <td onClick={() => { if (onClickAutoLeadList) onClickAutoLeadList(leadCollection); }}>
                        <div className="box full dfb column gap-5">
                           <div className="text-xs full text-left bold-600">{leadCollection.name}</div>
                           <div className="text-xxxs full text-left grey-5">{formatMilliseconds(parseInt(leadCollection.date))}</div>
                           <div className="box full dfb align-center gap-5 wrap">
                              {leadCollection.folders.split(",").filter((lc: any) => lc !== "all").map((folderName: any) => (
                                 <div key={folderName} className="folder-tag box fit pd-05 pdx-1">
                                    <div className="text-xt bold-600 whitespace-nowrap">{titleCase(folderName.replaceAll("-", " "))}</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </td>
                     <td onClick={() => { if (onClickAutoLeadList) onClickAutoLeadList(leadCollection); }}>
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
