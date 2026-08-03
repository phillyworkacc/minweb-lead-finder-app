'use client'
import { useModal } from '@/components/Modal/ModalContext';
import { pluralSuffixer } from '@/lib/str';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteAutomatedLeadList } from '@/app/actions/lead-automation';
import AwaitButton from '@/components/AwaitButton/AwaitButton';

type ExpandedAutoLeadList = AutomatedLeadList & { leadCount: number };
type DeleteAutoLeadListProps = {
   autoLeadList: ExpandedAutoLeadList;
   afterDeleteSuccess: (leadCollectionsId: string) => void;
}

export default function DeleteAutoLeadList ({ autoLeadList, afterDeleteSuccess }: DeleteAutoLeadListProps) {
   const { close } = useModal();

   const onDeleteClicked = async (callback: Function) => {
      const deleted = await deleteAutomatedLeadList(autoLeadList.leadListId);
      if (deleted) {
         toast.success("Deleted Auto Lead List: " + autoLeadList.name);
         afterDeleteSuccess(autoLeadList.leadListId)
         close();
      } else {
         toast.error("Failed to delete automated lead list");
         callback();
      }
   }

   return (
      <div className="box full dfb column gap-5">
         <div className="text-s pd-1 bold-500 text-center">
            Are you sure you want to delete this Lead Collection ({autoLeadList.name}) ?
         </div>
         <div className="text-xxs grey-4 text-center">{autoLeadList.name} has {autoLeadList.leadCount} {pluralSuffixer('lead', autoLeadList.leadCount, 's')}</div>
         <div className="box full dfb align-center justify-center pd-1 gap-10">
            <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
            <AwaitButton className="xxs full pd-15 delete whitespace-nowrap" onClick={onDeleteClicked}>
               <Trash2 size={16} /> Delete
            </AwaitButton>
         </div>
      </div>
   )
}
