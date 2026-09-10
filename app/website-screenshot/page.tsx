'use client'
import { useState } from "react";
import { takeWebsiteScreenshot } from "../actions/extras";
import { ArrowUp, ArrowUpRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import AppContainer from "@/components/AppContainer/AppContainer"
import Spacing from "@/components/Spacing/Spacing";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Link from "next/link";

export default function page() {
   const [url, setUrl] = useState("");
   const [websiteImg, setWebsiteImg] = useState<any>(null);

   async function handleTakeWebsiteScreenshot (callback: Function) {
      const res = await takeWebsiteScreenshot(url);
      if (res === false) {
         toast.error("Failed to take a screenshot of website");
      } else {
         setWebsiteImg(res);
      }
      callback();
   }

   function screenshotAnotherSite () {
      setUrl("");
      setWebsiteImg(null);
   }

   return (
      <AppContainer>
         {websiteImg == null ? (<>
            <div className="box full dfb column gap-10">
               <Spacing size={2} />
               <div className="text-l bold-800 full">TAKE A WEBSITE SCREENSHOT</div>
               <div className="text-xxs grey-5 full">Enter the website's url including 'https://' at the start</div>
               <div className="box full dfb align-center gap-10 mw-800 mt-15">
                  <input 
                     type="text" className="xxxs pd-13 pdx-2 full border-radius-20" placeholder="Website Url"
                     value={url} onChange={e => setUrl(e.target.value)}
                  />
                  <AwaitButton className="xxs pd-13 fit pdx-15 border-radius-20" onClick={handleTakeWebsiteScreenshot}>
                     <ArrowUp size={17} />
                  </AwaitButton>
               </div>
            </div>
         </>) : (<>            
            <div className="box full dfb column gap-10">
               <Spacing size={2} />
               <div className="text-l bold-800 full">SCREENSHOT TAKEN</div>
               <div className="box full dfb align-center gap-10 wrap">
                  <Link className="box fit" href={url} target="_blank" referrerPolicy="no-referrer">
                     <button className="xxxs pd-12 pdx-2 fit border-radius-15">Visit Website <ArrowUpRight size={16} /></button>
                  </Link>
                  <button className="xxxs pd-12 pdx-2 fit border-radius-15" onClick={screenshotAnotherSite}>
                     Another Screenshot <RotateCcw size={16} />
                  </button>
               </div>
               <Spacing />
               <div className="box full dfb align-center gap-10 wrap">
                  <div className="website-screenshot-wrapper">
                     <img src={websiteImg} alt="website screenshot" width={1280} height={720} />
                  </div>
               </div>
               <Spacing size={5} />
            </div>
         </>)}
      </AppContainer>
   )
}
