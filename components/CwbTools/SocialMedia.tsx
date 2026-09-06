'use client'
import { SocialMediaSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type SocialMediaProps = {
   initialValues: SocialMediaSectionValues;
   onChange: (newValues: SocialMediaSectionValues) => void;
}

export default function SocialMedia ({ initialValues, onChange }: SocialMediaProps) {
   const [socialMedia, setSocialMedia] = useState<SocialMediaSectionValues>(initialValues);
   const formSettings = [
      { key: "socialMedia", name: "Social Media Platforms", type: "social-media" },
   ]

   useEffect(() => { onChange(socialMedia); }, [socialMedia]);
   
   function updateValue (key: string, newValue: any) {
      setSocialMedia(p => ([ ...newValue ]))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Social Media Platforms</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(socialMedia as any)}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}