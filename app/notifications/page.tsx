'use client'
import { enableNotifications } from "@/utils/notifications";
import { useEffect, useState } from "react";
import AppWrapper from "@/components/AppContainer/AppContainer"
import Spacing from "@/components/Spacing/Spacing"
import currentUser from "@/utils/user";

export default function page() {
   const [enabledNotifications, setEnabledNotifications] = useState<boolean | null>(null);

   useEffect(() => {
      if (localStorage.getItem("minweb-lead-api-enabled-notifications")) {
         setEnabledNotifications(true);
      } else {
         setEnabledNotifications(false);
      }
   }, [])

   if (enabledNotifications == null) return null;

   async function enablePushNotifications () {
      const { clientId } = currentUser();
      await enableNotifications(clientId);
      setEnabledNotifications(true);
   }

   return (
      <AppWrapper>
         <Spacing size={2} />
         <div className="text-l full pd-1 bold-500 dfb align-center gap-10">
            App Notifications
         </div>
         <div className="box full dfb column pd-05">
            <div className="text-xxxxs full grey-5">Get notified on your phone once you automated leads are found</div>
            <div className="box full mt-1">
               <button 
                  className="xxxs pd-1 pdx-2" 
                  onClick={enablePushNotifications}
                  disabled={enabledNotifications}
               >
                  {enabledNotifications ? 'Enabled' : 'Enable'}
               </button>
            </div>
         </div>
      </AppWrapper>
   )
}
