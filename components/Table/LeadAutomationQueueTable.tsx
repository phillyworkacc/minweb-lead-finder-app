'use client'
import './Table.css';
import { useEffect, useState } from 'react';
import { useModal } from '../Modal/ModalContext';
import { formatMilliseconds } from '@/utils/date';
import { getAllLeadAutomations } from '@/app/actions/lead-automation';
import LAQueueItem from '@/modals/LAQueueItem';
import Checkbox from '../Checkbox/Checkbox';

interface Filters extends Record<string, null | boolean> {
   isCompleted: null | boolean;
   isNotCompleted: null | boolean;
   hasPriority: null | boolean;
   hasNoPriority: null | boolean;
}

export default function LeadAutomationQueueTable () {
   const { showModal } = useModal();
   const [leadAutomationQueue, setLeadAutomationQueue] = useState<LeadQueueItem[]>([]);
   const [searchLeadQueue, setSearchLeadQueue] = useState('');
   const [filters, setFilters] = useState<Filters>({
      isCompleted: null,
      isNotCompleted: null,
      hasPriority: null,
      hasNoPriority: null,
   });

   const applyFilters = (leadQueue: LeadQueueItem[]): LeadQueueItem[] => {
      return leadQueue
         .filter(leadQueueItem => 
            leadQueueItem.niche.toLowerCase().includes(searchLeadQueue.toLowerCase())
            || leadQueueItem.location.toLowerCase().includes(searchLeadQueue.toLowerCase())
         ) // search filter
         .filter(leadQueueItem => {
            if (!filters.hasPriority) return true;
            return (leadQueueItem.priority == "ahead")
         }) // filter for has priority
         .filter(leadQueueItem => {
            if (!filters.hasNoPriority) return true;
            return (leadQueueItem.priority == "none")
         }) // filter for has no priority
         .filter(leadQueueItem => {
            if (!filters.isCompleted) return true;
            return (leadQueueItem.completedAt !== null && leadQueueItem.completedAt !== "" && leadQueueItem.completedAt)
         }) // filter for is completed
         .filter(leadQueueItem => {
            if (!filters.isNotCompleted) return true;
            return (leadQueueItem.completedAt == null || leadQueueItem.completedAt == "" || !leadQueueItem.completedAt)
         }) // filter for is not completed
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
            afterDeleteFunction={() => {
               setLeadAutomationQueue(p => {
                  const idOfLeadQueueItem = p.indexOf(leadQueueItem);
                  const newQueue: any[] = [ ...p.filter(laq => (laq.id !== p[idOfLeadQueueItem].id)) ];
                  return [ ...newQueue ]
               })
            }}
         />
      })
   }

   return (
      <>
         <div className="box full mb-2">
            <div className="text-xxxs full grey-4 mb-05 pdx-05 pd-1">{leadAutomationQueue.length} lead queue(s) items found</div>
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
               <div className="box full dfb wrap align-center gap-15 pd-05 mb-15">
                  <Checkbox 
                     label='Is Completed'
                     onChange={t => setFilters(p => ({ ...p, isCompleted: t || null }))}
                  />
                  <Checkbox 
                     label='Is Not Completed'
                     onChange={t => setFilters(p => ({ ...p, isNotCompleted: t || null }))}
                  />
                  <Checkbox 
                     label='Has Priority'
                     onChange={t => setFilters(p => ({ ...p, hasPriority: t || null }))}
                  />
                  <Checkbox 
                     label='Has No Priority'
                     onChange={t => setFilters(p => ({ ...p, hasNoPriority: t || null }))}
                  />
               </div>
            </div>
            {( 
               searchLeadQueue !== '' ||
               Object.keys(filters).map((k) => filters[k]).includes(true)
            ) && (<div className="box full">
               <div className="text-xxxs full grey-4 mb-05 pdx-05 pd-1">After filters, {applyFilters(leadAutomationQueue).length} lead queue(s) items found</div>
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
