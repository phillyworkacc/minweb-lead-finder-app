'use client'
import { ContentSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type ContentProps = {
   initialValues: ContentSectionValues;
   onChange: (newValues: ContentSectionValues) => void;
}

export default function Content ({ initialValues, onChange }: ContentProps) {
   const [content, setContent] = useState<ContentSectionValues>(initialValues);
   const formSettings = [
      { key: "aboutUs", name: "About Us", type: "textarea-about" },
      { key: "servicesDescriptionCopy", name: "Services Description Copy", type: "textarea" },
      { key: "openingTimes", name: "Opening Times", type: "opening-times" },
   ]

   useEffect(() => { onChange(content); }, [content]);
   
   function updateValue (key: string, newValue: any) {
      setContent(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Content</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(content as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
