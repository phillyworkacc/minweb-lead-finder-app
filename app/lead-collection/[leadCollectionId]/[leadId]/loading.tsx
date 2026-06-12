import AppWrapper from "@/components/AppContainer/AppContainer";
import { UserRound } from "lucide-react";
import LoadingCard from "@/components/Card/LoadingCard";

export default function LoadingLeadCollectionLeadPage () {
   return (
      <AppWrapper>
         <div className="text-s full pd-1 bold-500 dfb align-center gap-10">
            <UserRound size={20} /> Lead Page
         </div>
         <div className="text-xxxs grey-5 full pd-05">
            We are this lead, please be patient
         </div>
         <LoadingCard styles={{ width: "100%", height: "100px" }} />
      </AppWrapper>
   )
}
