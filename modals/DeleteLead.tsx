'use client'
import { deleteLeadFromCollection } from "@/app/actions/leads";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/ModalContext";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function DeleteLead ({ lead, afterDeleteSuccess }: { lead: Lead, afterDeleteSuccess: (leadId: string) => void }) {
   const { close } = useModal();
   const onDeleteClicked = async (callback: Function) => {
      const deleted = await deleteLeadFromCollection(lead.leadCollectionsId, lead.leadId);
      if (deleted) {
         toast.success("Deleted Lead: " + lead.name);
         afterDeleteSuccess(lead.leadId);
         close();
      } else {
         toast.error("Failed to delete lead from collection");
         callback();
      }
      callback();
   }

   return (
      <div className="box full dfb column gap-5">
         <div className="text-s pd-1 bold-500 text-center">
            Are you sure you want to delete {lead.name} ?
         </div>
         <div className="box full dfb align-center justify-center pd-1 gap-10">
            <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
            <AwaitButton className="xxs full pd-15 delete whitespace-nowrap" onClick={onDeleteClicked}>
               <Trash2 size={16} /> Delete
            </AwaitButton>
         </div>
      </div>
   )
}
