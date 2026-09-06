'use client'
import { ImagesSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type ImagesProps = {
   initialValues: ImagesSectionValues;
   onChange: (newValues: ImagesSectionValues) => void;
}

export default function Images ({ initialValues, onChange }: ImagesProps) {
   const [images, setImages] = useState<ImagesSectionValues>(initialValues);
   const formSettings = [
      { key: "images", name: "Website Images", type: "text-img-array" },
   ]

   useEffect(() => { onChange(images); }, [images]);
   
   function updateValue (key: string, newValue: any) {
      setImages(p => ([ ...newValue ]))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Images</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(images as any)}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
