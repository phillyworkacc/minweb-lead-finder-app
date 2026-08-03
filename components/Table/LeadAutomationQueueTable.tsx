'use client'
import './Table.css';
import { useEffect, useState } from 'react';
import { useModal } from '../Modal/ModalContext';
import { formatMilliseconds } from '@/utils/date';
import { getAllLeadAutomations } from '@/app/actions/lead-automation';
import LAQueueItem from '@/modals/LAQueueItem';

export default function LeadAutomationQueueTable () {
   const { showModal } = useModal();
   const [leadAutomationQueue, setLeadAutomationQueue] = useState<LeadQueueItem[]>([]);
   const [searchLeadQueue, setSearchLeadQueue] = useState('');

   const applyFilters = (leads: LeadQueueItem[]): LeadQueueItem[] => {
      return leads
         .filter(lead => 
            lead.niche.toLowerCase().includes(searchLeadQueue.toLowerCase())
            || lead.location.toLowerCase().includes(searchLeadQueue.toLowerCase())
         ) // search filter
   }

   async function loadAutomationQueue () {
      const queue = await getAllLeadAutomations();
      if (queue == false) {
         setLeadAutomationQueue([]);
      } else {
         setLeadAutomationQueue(p => ([...queue]));
      }
   }

   useEffect(() => { loadAutomationQueue() }, [])

   function openLeadQueueItemModal (leadQueueItem: LeadQueueItem) {
      showModal({
         content: <LAQueueItem 
            leadQueueItem={leadQueueItem}
            afterRunFunction={(priority) => {
               setLeadAutomationQueue(p => {
                  const idOfLeadQueueItem = p.indexOf(leadQueueItem);
                  const newQueue = [ ...p ];
                  newQueue[idOfLeadQueueItem].priority = priority;
                  return [ ...newQueue ]
               })
            }}
         />
      })
   }

   return (
      <>
         <div className="box full mb-2">
            <div className='box full dfb column'>
               <div className="box full pd-05">
                  <input
                     type="text"
                     className="xxxs full pd-13 pdx-15 tiny-shadow"
                     placeholder='Search lead queue...'
                     value={searchLeadQueue}
                     style={{ maxWidth: "700px" }}
                     onChange={e => setSearchLeadQueue(e.target.value)}
                  />
               </div>
            </div>
            {( searchLeadQueue !== '' ) && (<div className="box full">
               <div className="text-xxxs full grey-4 mb-05 pdx-05 pd-1">After filters, {applyFilters(leadAutomationQueue).length} lead queue(s) found</div>
            </div>)}
         </div>
         <div className="table-container">
            <table className="leads-table">
               <thead>
                  <tr id='head-row'>
                     <th>Niche</th>
                     <th>Location</th>
                     <th>Priority</th>
                     <th>Date Created</th>
                     <th>Completed At</th>
                  </tr>
               </thead>
               <tbody>
                  {applyFilters(leadAutomationQueue).map((leadQueueItem, index) => (
                     <tr key={index} onClick={() => openLeadQueueItemModal(leadQueueItem)}>
                        <td className='name'>{leadQueueItem.niche}</td>
                        <td>{leadQueueItem.location}</td>
                        <td>{leadQueueItem.priority}</td>
                        <td>{formatMilliseconds(parseInt(leadQueueItem.createdAt), false, true)}</td>
                        <td>{leadQueueItem.completedAt ? formatMilliseconds(parseInt(leadQueueItem.completedAt), false, true) : 'Not Complete'}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   )
}
