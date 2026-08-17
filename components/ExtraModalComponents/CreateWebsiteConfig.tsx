'use client'

type CreateWebsiteConfigProps = {
   lead: AutomatedLead;
}

export default function CreateWebsiteConfig ({ lead }: CreateWebsiteConfigProps) {


   // business place id, google map embed url, form colors (bg and color), font
   // services, footer styling

   return (
      <div className="box full dfb column gap-20">
         <div className="text-sm full bold-700 mb-05">Create Website Config</div>
         {/* <div className="box full dfb column gap-5">
            <div className="text-xxs full">Enter Email</div>
            <input 
               type="email" className="xxxs pd-12 pdx-15 full"
               placeholder="Email" style={{ maxWidth: "400px" }}
               value={email} onChange={e => setEmail(e.target.value)}
            />
         </div>
         <div className="box full dfb column gap-5">
            <div className="text-xxs full">Enter Phone Number</div>
            <input 
               type="email" className="xxxs pd-12 pdx-15 full"
               placeholder="Phone Number" style={{ maxWidth: "400px" }}
               value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
            />
         </div>
         <div className="box pd-1">
            <AwaitButton 
               className="xxxs pd-15 fit pdx-2 border-radius-15 whitespace-nowrap mw-500"
               onClick={submitUpdateLeadInfo}
            ><UserRoundCheck size={16} /> Update</AwaitButton>
         </div> */}
      </div>
   )
}
