'use client'
import { HeaderSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type HeaderProps = {
   initialValues: HeaderSectionValues;
   onChange: (newValues: HeaderSectionValues) => void;
}

export default function Header ({ initialValues, onChange }: HeaderProps) {
   const [header, setHeader] = useState<HeaderSectionValues>(initialValues);
   const formSettings = [
      { key: "linksStyle", name: "Links Style", type: "select-links-style" },
      { key: "cta", name: "Call To Action Type", type: "select-cta-type" },
      { key: "desktopNavStyle", name: "Desktop Nav Style", type: "select-desktop-nav-style" },
   ]

   useEffect(() => { onChange(header); }, [header]);
   
   function updateValue (key: string, newValue: any) {
      setHeader(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Header</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(header as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
