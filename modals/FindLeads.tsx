'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { smallBusinessFinderScraper, thomsonLocalScraper } from "@/app/actions/findLeads";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { useModal } from "@/components/Modal/ModalContext";
import { CustomSelect } from "@/components/Select/CustomSelect";
import { FolderPlus, UserRoundSearch, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Select from "@/components/Select/Select";
import { getFolders, getLeadLists } from "@/app/actions/utils";
import { insertLeadsWithExistingLeadCollection, insertLeadsWithNewLeadCollection } from "@/app/actions/leads";

type ModalSections = "form" | "save-leads"
type LeadFindMethod = "small-biz-finder" | "thomson-local"

export default function FindLeads() {
   const { close } = useModal();
   const [modalSection, setModalSection] = useState<ModalSections>("form");

   // FORM SECTION STATES
   const [niche, setNiche] = useState("");
   const [location, setLocation] = useState("");
   const [leadFindMethod, setLeadFindMethod] = useState<LeadFindMethod>("small-biz-finder");
   const [showWaitingMessage, setShowWaitingMessage] = useState(false);

   // SAVE LEADS SECTION STATES
   const noneFolder: Folder = { id: "", name: "None", folderId: "none" };
   const [rawLeads, setRawLeads] = useState<LeadItemFormatted[]>([]);
   const [newLeadListName, setNewLeadListName] = useState("");
   const [showChooseLeadList, setShowChooseLeadList] = useState(false);
   const [selectedFolder, setSelectedFolder] = useState("");
   const [selectedLeadList, setSelectedLeadList] = useState("");
   const [folders, setFolders] = useState<Folder[]>([noneFolder]);
   const [leadLists, setLeadLists] = useState<LeadCollection[]>([]);

   async function getAllFoldersAndLeadLists () {
      const allFolders: any[] = await getFolders();
      const allLeadLists: any[] = await getLeadLists();
      setFolders(p => ([ noneFolder, ...allFolders ]));
      setLeadLists(p => ([ ...allLeadLists ]));
   }

   useEffect(() => { getAllFoldersAndLeadLists() }, [])

   async function submitLeadFind (callback: Function) {
      if (niche == "" || niche.trim() == "") {
         toast.error("Please enter a niche");
         callback();
         return;
      }
      if (location == "" || location.trim() == "") {
         toast.error("Please enter a location");
         callback();
         return;
      }
      setShowWaitingMessage(true)
      if (leadFindMethod == "small-biz-finder") {
         const scraperResult = await smallBusinessFinderScraper(niche, location);
         if (scraperResult.success) {
            toast.success(`${scraperResult.data.length} Leads Found!`);
            setRawLeads(scraperResult.data.map(l => ({
               name: l.name,
               address: l.address,
               email: l.email,
               website: l.website,
               phoneNumber: l.phoneNumber,
            })))
            if (scraperResult.data.length > 0) setModalSection("save-leads");
         } else {
            toast.error("Failed to find any leads");
         }
         setShowWaitingMessage(false);
      } else {
         const scraperResult = await thomsonLocalScraper(niche, location);
         if (scraperResult.success) {
            toast.success(`${scraperResult.data.length} Leads Found!`);
            setRawLeads(scraperResult.data.map(l => ({
               name: l.name,
               address: l.address,
               email: l.email,
               website: l.website,
               phoneNumber: l.phoneNumber,
            })))
            if (scraperResult.data.length > 0) setModalSection("save-leads");
         } else {
            toast.error("Failed to find any leads");
         }
         setShowWaitingMessage(false);
      }
      callback();
   }

   async function submitSaveLead (callback: Function) {
      if (selectedFolder == "None") {
         toast.error("Please choose a folder");
         callback();
         return;
      }
      if (showChooseLeadList) {
         if (selectedLeadList == "") {
            toast.error("Please choose a lead list");
            callback();
            return;
         }
         const saved = await insertLeadsWithExistingLeadCollection(rawLeads, selectedLeadList);
         if (saved) {
            toast.success("Saved Leads Successfully");
            close();
         } else {
            toast.error("Failed to save leads");
         }
         callback();
      } else {
         if (newLeadListName == "" || newLeadListName.trim() == "") {
            toast.error("Please enter the lead list name");
            callback();
            return;
         }
         const saved = await insertLeadsWithNewLeadCollection(rawLeads, newLeadListName);
         if (saved) {
            toast.success("Saved Leads Successfully");
            close();
         } else {
            toast.error("Failed to save leads");
         }
         callback();
      }
   }


   if (modalSection == "form") {
      return (
         <div className="box full pd-1 dfb column gap-20">
            <div className="text-l full text-left bold-600">Find Leads</div>
            <div className="box full">
               <input 
                  type="text" className="xxs pd-13 pdx-2 full"
                  value={niche} onChange={e => setNiche(e.target.value)}
                  placeholder="Niche"
               />
            </div>
            <div className="box full">
               <input 
                  type="text" className="xxs pd-13 pdx-2 full"
                  value={location} onChange={e => setLocation(e.target.value)}
                  placeholder="Location"
               />
            </div>
            <div className="box full">
               <CustomSelect
                  options={[
                     {
                        option: <div className='box dfb align-center gap-10 fit'>
                           <CustomUserIcon url='https://smallbusinesssaturdayuk.com/favicon-32x32.png' size={20} round /> Small Business Finder
                        </div>,
                        optionName: "small-biz-finder"
                     },
                     {
                        option: <div className='box dfb align-center gap-10 fit'>
                           <CustomUserIcon url='https://www.thomsonlocal.com/favicon.ico' size={20} round /> Thomson Local
                        </div>,
                        optionName: "thomson-local"
                     },
                  ]}
                  onSelect={(option) => setLeadFindMethod(option)}
                  defaultOptionIndex={0}
                  style={{ width: "100%" }}
               />
            </div>
            {showWaitingMessage && (<div className="box full">
               <div className="text-xs full text-left bold-700 accent-color">
                  Please be patient fetching leads may take as long as 3mins.
               </div>
            </div>)}
            <div className="box full dfb align-center gap-10">
               <AwaitButton className="xxs pd-13 full" onClick={submitLeadFind}><UserRoundSearch size={20} /> Find</AwaitButton>
               <button className="xxs pd-13 full outline-black" onClick={close}>Cancel</button>
            </div>
         </div>
      )
   } else {
      return (
         <div className="box full pd-1 dfb column gap-20">
            <div className="text-l full text-left bold-600">Save the Leads</div>
            <div className="text-xs full text-left">We found {rawLeads.length} leads for "{niche} {location}"</div>
            <div className="text-m full text-left bold-600 mt-1">Choose Folder</div>
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
            <div className="text-m full text-left bold-600 mt-2">Choose Lead List</div>
            {showChooseLeadList ? (<>
               <div className="box full">
                  <CustomSelect
                     options={
                        leadLists.map(leadList => ({
                           option: <div className='box dfb align-center gap-10 fit'><UsersRound size={17} /> {leadList.name}</div>,
                           optionName: leadList.leadCollectionsId
                        }))
                     }
                     onSelect={(option) => setSelectedLeadList(option)}
                     defaultOptionIndex={0}
                     style={{ width: "100%" }}
                  />
               </div>
            </>) : (
               <div className="box full">
                  <input 
                     type="text" className="xxs pd-13 pdx-2 full"
                     value={newLeadListName} onChange={e => setNewLeadListName(e.target.value)}
                     placeholder="New Lead List Name"
                  />
               </div>
            )}
            <div className="text-xxs fit accent-color bold-500 cursor-pointer"  onClick={() => setShowChooseLeadList(p => !p)}>
               <u>{showChooseLeadList ? "Create a new Lead List" : "Choose existing Lead List"}</u>
            </div>
            <div className="box full dfb align-center gap-10">
               <AwaitButton className="xxs pd-13 full" onClick={submitSaveLead}><FolderPlus size={20} /> Save</AwaitButton>
               <button className="xxs pd-13 full outline-black" onClick={() => setModalSection("form")}>Back</button>
            </div>
         </div>
      )
   }
}
