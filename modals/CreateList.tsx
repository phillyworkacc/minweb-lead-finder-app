'use client'
import { useModal } from "@/components/Modal/ModalContext";
import { FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getFolders } from "@/app/actions/utils";
import { toast } from "sonner";
import { createLeadCollection } from "@/app/actions/leads";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Select from "@/components/Select/Select";

export default function CreateList() {
   const noneFolder: Folder = { id: "", name: "None", folderId: "none" };
   const { close } = useModal();
   const [name, setName] = useState("");
   const [selectedFolder, setSelectedFolder] = useState("");
   const [folders, setFolders] = useState<Folder[]>([noneFolder]);

   async function getAllFolders () {
      const allFolders: any[] = await getFolders();
      setFolders(p => ([ noneFolder, ...allFolders ]));
   }

   useEffect(() => { getAllFolders() }, [])

   async function submitCreateLeadList (callback: Function) {
      if (name == "" || name.trim() == "") {
         toast.error("Please enter a name for the lead list");
         callback();
         return;
      }
      if (selectedFolder == "") {
         toast.error("Please select a folder");
         callback();
         return;
      }
      const createdLeadList = await createLeadCollection(name, selectedFolder);
      if (createdLeadList) {
         toast.success(`${name} list has been created!`);
         close();
      } else {
         toast.error("Failed to create this lead list");
      }
      callback();
   }

   return (
      <div className="box full pd-1 dfb column gap-20">
         <div className="text-l full text-left bold-600">Create Lead List</div>
         <div className="box full">
            <input 
               type="text" className="xxs pd-13 pdx-2 full"
               value={name} onChange={e => setName(e.target.value)}
               placeholder="Name"
            />
         </div>
         <div className="box full">
            <Select
               options={folders.map(f => (f.name))}
               onSelect={folder => {
                  setSelectedFolder((folder == "None") ? "" : folder.toLowerCase().replaceAll(" ", "-"));
               }}
               style={{ width: "100%" }}
               selectedOptionStyle={{ padding: "5px 10px" }}
            />
         </div>
         <div className="box full dfb align-center gap-10">
            <AwaitButton className="xxs pd-13 full" onClick={submitCreateLeadList}><FolderPlus size={20} /> Create</AwaitButton>
            <button className="xxs pd-13 full outline-black" onClick={close}>Cancel</button>
         </div>
      </div>
   )
}
