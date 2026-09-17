'use client'
import { checkMyPocketSkill } from "../actions/mps"
import { ChevronDown } from "lucide-react";
import { MPSIcon, MPSLargeIcon } from "@/components/Icons/Icon";
import Spacing from "@/components/Spacing/Spacing";
import AppContainer from "@/components/AppContainer/AppContainer"
import MPSLeads from "@/components/Table/MPSLeads";
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown";

type MPSClientPageProps = {
   listings: MPSListing[];
}

export default function MPSClientPage ({ listings }: MPSClientPageProps) {

   async function handleCheckMps () {
      const results = await checkMyPocketSkill();
      console.log(results);
   }

   return (
      <AppContainer>
         <Spacing size={2} />
         <div className="box full"><MPSLargeIcon size={48} /></div>
         <div className="text-l full pd-1 bold-600 dfb align-center gap-10">
            MyPocketSkill Auto Get Leads!
         </div>
         <div className="text-xs grey-5 full pd-05 mb-2">Write Messages Fast. Get Alerts. More Volume</div>
         <div className="horizontal-convertible box full gap-10 pd-05 mb-1">
            <div className="box full dfb justify-end gap-10">
               <MultiActionDropdown
                  className="xxxs outline-black pd-12 pdx-15 tiny-shadow border-radius-15"
                  actions={[
                     { appearance: "normal", label: <><MPSIcon size={18} /> Check MPS</>, action: handleCheckMps },
                  ]}
               >
                  More Actions <ChevronDown size={18} />
               </MultiActionDropdown>
            </div>
         </div>
         <div className="box full dfb column gap-10">
            <MPSLeads listings={listings} />
         </div>
      </AppContainer>
   )
}
