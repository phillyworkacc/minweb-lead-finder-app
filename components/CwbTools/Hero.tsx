'use client'
import { HeroSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type HeroProps = {
   initialValues: HeroSectionValues;
   onChange: (newValues: HeroSectionValues) => void;
}

export default function Hero ({ initialValues, onChange }: HeroProps) {
   const [hero, setHero] = useState<HeroSectionValues>(initialValues);
   const formSettings = [
      { key: "headline", name: "Headline", type: "text" },
      { key: "subHeading", name: "Sub Heading", type: "text" },
      { key: "description", name: "Description", type: "textarea" },
      { key: "backgroundImage", name: "Background Image", type: "text-to-img" },
   ]

   useEffect(() => { onChange(hero); }, [hero]);
   
   function updateValue (key: string, newValue: any) {
      setHero(p => ({ ...p, [key]: newValue }))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Hero Section</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(hero as any)[formSetting.key]}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
