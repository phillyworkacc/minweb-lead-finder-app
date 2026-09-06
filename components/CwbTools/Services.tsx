'use client'
import { ServicesSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type ServicesProps = {
   initialValues: ServicesSectionValues;
   onChange: (newValues: ServicesSectionValues) => void;
}

export default function Services ({ initialValues, onChange }: ServicesProps) {
   const [services, setServices] = useState<ServicesSectionValues>(initialValues);
   const formSettings = [
      { key: "services", name: "Website Services", type: "services-array" },
   ]

   useEffect(() => { onChange(services); }, [services]);
   
   function updateValue (key: string, newValue: any) {
      setServices(p => ([ ...newValue ]))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Services</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(services as any)}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
