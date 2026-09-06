'use client'
import { BusinessSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type BusinessProps = {
   initialValues: BusinessSectionValues;
   onChange: (newValues: BusinessSectionValues) => void;
}

export default function Business ({ initialValues, onChange }: BusinessProps) {
   const [business, setBusiness] = useState<BusinessSectionValues>(initialValues);
   const formSettings = [
      { key: "logo", name: "Logo", type: "text-to-img" },
      { key: "name", name: "Name", type: "text" },
      { key: "minwebBusinessId", name: "Minweb Business Id", type: "text" },
      { key: "description", name: "Description", type: "text" },
      { key: "email", name: "Email", type: "text" },
      { key: "address", name: "Address", type: "text" },
      { key: "phoneNumber", name: "Phone Number", type: "text" },
      { key: "googleMapEmbedUrl", name: "Google Map Embed Url", type: "text" },
      { key: "businessPlaceId", name: "Business Place Id", type: "text" },
      { key: "quoteCta", name: "Quote Cta", type: "text" }
   ]

   useEffect(() => { onChange(business); }, [business]);
   
   function updateValue (key: string, newValue: any) {
      setBusiness(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Business Information</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(business as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
