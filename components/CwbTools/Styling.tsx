'use client'
import { StylingSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type StylingProps = {
   initialValues: StylingSectionValues;
   onChange: (newValues: StylingSectionValues) => void;
}

export default function Styling ({ initialValues, onChange }: StylingProps) {
   const [styling, setStyling] = useState<StylingSectionValues>(initialValues);
   const formSettings = [
      { key: "accentColor", name: "Accent Color", type: "color" },
      { key: "secondaryColor", name: "Secondary Color", type: "color" },
      { key: "background", name: "Background", type: "color" },
      { key: "foreground", name: "Foreground", type: "color" },
      { key: "fontFamily", name: "Font", type: "select-font" },
      { key: "headerBackground", name: "Header Background", type: "color" },
      { key: "headerColor", name: "Header Color", type: "color" },
      { key: "formColorsBackground", name: "Form Color - Background", type: "color" },
      { key: "formColorsColor", name: "Form Color - Color", type: "color" },
      { key: "footerBackground", name: "Footer Background", type: "color" },
      { key: "footerColor", name: "Footer Color", type: "color" }
   ]

   useEffect(() => { onChange(styling); }, [styling]);
   
   function updateValue (key: string, newValue: any) {
      setStyling(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Styling</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(styling as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
