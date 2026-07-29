'use client'
import { formatMilliseconds } from '@/utils/date';
import './Table.css'

type LeadCollectionsTableProps = {
   leadCollections: any[];
   onClickLeadCollection?: (leadCollection: any) => void;
}

export default function LeadCollectionTable ({ leadCollections, onClickLeadCollection }: LeadCollectionsTableProps) {
   return (
      <div className="table-container">
         <table className="leads-table">
            <thead>
               <tr id='head-row'>
                  <th>Name</th>
                  <th>Total Leads</th>
               </tr>
            </thead>
            <tbody>
               {leadCollections.map((leadCollection, index) => (
                  <tr key={index} onClick={() => { if (onClickLeadCollection) onClickLeadCollection(leadCollection); }}>
                     <td>
                        <div className="box full dfb column gap-5">
                           <div className="text-xs full text-left bold-600">{leadCollection.name}</div>
                           <div className="text-xxxs full text-left grey-5">{formatMilliseconds(parseInt(leadCollection.date))}</div>
                        </div>
                     </td>
                     <td></td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}
