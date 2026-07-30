'use client'
import { deleteLeadCollection } from '@/app/actions/leads';
import { useModal } from '@/components/Modal/ModalContext';
import { pluralSuffixer } from '@/lib/str';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AwaitButton from '@/components/AwaitButton/AwaitButton';

type ExpandedLeadCollection = LeadCollection & { leadCount: number };
type DeleteLeadListProps = {
   leadCollection: ExpandedLeadCollection;
   afterDeleteSuccess: (leadCollectionsId: string) => void;
}

export default function DeleteLeadList ({ leadCollection, afterDeleteSuccess }: DeleteLeadListProps) {
   const { close } = useModal();

   const onDeleteClicked = async (callback: Function) => {
      const deleted = await deleteLeadCollection(leadCollection.leadCollectionsId);
      if (deleted) {
         toast.success("Deleted Lead Collection: " + leadCollection.name);
         afterDeleteSuccess(leadCollection.leadCollectionsId)
         close();
      } else {
         toast.error("Failed to delete lead collection");
         callback();
      }
   }

   return (
      <div className="box full dfb column gap-5">
         <div className="text-s pd-1 bold-500 text-center">
            Are you sure you want to delete this Lead Collection ({leadCollection.name}) ?
         </div>
         <div className="text-xxs grey-4 text-center">{leadCollection.name} has {leadCollection.leadCount} {pluralSuffixer('lead', leadCollection.leadCount, 's')}</div>
         <div className="box full dfb align-center justify-center pd-1 gap-10">
            <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
            <AwaitButton className="xxs full pd-15 delete whitespace-nowrap" onClick={onDeleteClicked}>
               <Trash2 size={16} /> Delete
            </AwaitButton>
         </div>
      </div>
   )
}
