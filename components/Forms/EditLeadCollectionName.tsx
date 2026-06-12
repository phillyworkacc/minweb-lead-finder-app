'use client'
import { FolderPen } from "lucide-react";
import { useState } from "react";
import { useModal } from "../Modal/ModalContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editLeadCollectionName } from "@/app/actions/leads";
import AwaitButton from "../AwaitButton/AwaitButton";

export default function EditLeadCollectionName({ leadCollection }: { leadCollection: LeadCollection }) {
   const { close } = useModal();
   const router = useRouter();
   const [newName, setNewName] = useState("");

   const onEditClicked = async (callback: Function) => {
      if (newName.trim() == "") {
         toast.error("Please enter a name for the lead collection");
         callback();
      }
      const updated = await editLeadCollectionName(leadCollection.leadCollectionsId, newName);
      if (updated) {
         toast.success("Edited Lead Collection's Name to " + newName);
         router.refresh();
         close();
      } else {
         toast.error("Failed to edit lead collection's name");
         callback();
      }
   }

   return (
      <div className='box full dfb column gap-5'>
         <div className="text-s pd-1 bold-500 text-center">
            Enter the new name of the Lead Collection ({leadCollection.name}) ?
         </div>
         <div className="box full text-center">
            <input 
               type="text"
               className="xxs full pd-15 pdx-2"
               placeholder='New Lead Collection Name'
               value={newName}
               onChange={e => setNewName(e.target.value)}
            />
         </div>
         <div className="box full dfb align-center justify-center pd-1 gap-10">
            <button className="xxs full pd-15 outline-black" onClick={close}>Cancel</button>
            <AwaitButton className="xxs full pd-15 whitespace-nowrap" onClick={onEditClicked}>
               <FolderPen size={16} /> Save
            </AwaitButton>
         </div>
      </div>
   )
}
