'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import { createFolder } from "@/app/actions/utils";
import { toast } from "sonner";
import AwaitButton from "@/components/AwaitButton/AwaitButton";

export default function CreateFolder() {
   const { close } = useModal();
   const [name, setName] = useState("");

   async function submitCreateFolder (callback: Function) {
      if (name == "" || name.trim() == "") {
         toast.error("Please enter a folder name");
         callback();
         return;
      }
      const createdFolder = await createFolder(name);
      if (createdFolder) {
         toast.success(`${name} folder has been created!`);
         close();
      } else {
         toast.error("Failed to create a folder");
      }
      callback();
   }

   return (
      <div className="box full pd-1 dfb column gap-20">
         <div className="text-l full text-left bold-600">Create Folder</div>
         <div className="box full">
            <input 
               type="text" className="xxs pd-13 pdx-2 full"
               value={name} onChange={e => setName(e.target.value)}
               placeholder="Folder Name"
            />
         </div>
         <div className="box full dfb align-center gap-10">
            <AwaitButton className="xxs pd-13 full" onClick={submitCreateFolder}><FolderPlus size={20} /> Create</AwaitButton>
            <button className="xxs pd-13 full outline-black" onClick={close}>Cancel</button>
         </div>
      </div>
   )
}
