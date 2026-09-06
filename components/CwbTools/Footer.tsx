'use client'
import { FooterSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type FooterProps = {
   initialValues: FooterSectionValues;
   onChange: (newValues: FooterSectionValues) => void;
}

export default function Footer ({ initialValues, onChange }: FooterProps) {
   const [footer, setFooter] = useState<FooterSectionValues>(initialValues);
   const formSettings = [
      { key: "style", name: "Footer Style", type: "select-footer-style" },
      { key: "logoSize", name: "Logo Size", type: "number" },
   ]

   useEffect(() => { onChange(footer); }, [footer]);
   
   function updateValue (key: string, newValue: any) {
      setFooter(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Footer Settings</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(footer as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}