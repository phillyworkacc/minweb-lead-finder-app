'use client'
import MultiBarSelection from "@/components/MultiBarSelection/MultiBarSelection";
import { useModal } from "@/components/Modal/ModalContext";
import { titleCase } from "@/lib/str";
import { formatMilliseconds } from "@/utils/date";
import { MapPin, UserRound } from "lucide-react";
import { deleteLeadQueueItem, updateLeadQueueItemPriority } from "@/app/actions/lead-automation";
import { toast } from "sonner";

type LAQueueItemProps = {
   leadQueueItem: LeadQueueItem;
   afterRunFunction: (priority: string) => void;
   afterDeleteFunction: () => void;
}

export default function LAQueueItem ({ leadQueueItem, afterRunFunction, afterDeleteFunction }: LAQueueItemProps) {
   const { close } = useModal();

   async function updateLAQPriority (priority: string) {
      const updated = await updateLeadQueueItemPriority(leadQueueItem.id, priority);
      if (updated) {
         toast.success("Updated Priority for Lead Queue Item");
         afterRunFunction(priority);
         close();
      } else {
         toast.error("Failed to update priority");
      }
   }

   async function deleteLAQItem () {
      const deleted = await deleteLeadQueueItem(leadQueueItem.id);
      if (deleted) {
         toast.success("Deleted a Lead Queue Item");
         afterDeleteFunction();
         close();
      } else {
         toast.error("Failed to delete this lead automation item");
      }
   }

   return (
      <div className="box full pd-1">
         <div className="text-m full bold-700">Lead Queue Item</div>
         
         <div className="box full pd-1">
            <div className="text-xxs full dfb align-center gap-5">
               <UserRound size={15} /> {titleCase(leadQueueItem.niche)}
            </div>
            <div className="text-xxs full dfb align-center gap-5">
               <MapPin size={15} /> {titleCase(leadQueueItem.location)}
            </div>
         </div>
         
         {leadQueueItem.completedAt ? (<>
            <div className="box full pd-1">
               <div className="text-xxs full">
                  Lead Automation Completed on <b>{formatMilliseconds(parseInt(leadQueueItem.completedAt))}</b>
               </div>
            </div>
         </>) : (<>
            <div className="box full pd-1">
               <div className="text-s full bold-600">Choose Priority</div>
               <div className="box full pd-05">
                  <MultiBarSelection
                     options={[
                        { label: "None", action: async () => { await updateLAQPriority("none"); } },
                        { label: "Ahead", action: async () => { await updateLAQPriority("ahead"); } },
                     ]}
                     defaultSelectedIndex={leadQueueItem.priority == "none" ? 0 : 1}
                  />
               </div>
            </div>
            <div className="box full pd-1">
               <div className="text-s full bold-600">Delete This Automation Item</div>
               <div className="box full dfb align-center justify-center pd-1 gap-10">
                  <button className="xxxs full pd-12 delete tiny-shadow" onClick={deleteLAQItem}>Delete</button>
               </div>
            </div>
         </>)}
         
         <div className="box full dfb align-center justify-center pd-1 gap-10">
            <button className="xxxs full pd-12 outline-black tiny-shadow" onClick={close}>Close</button>
         </div>
      </div>
   )
}
