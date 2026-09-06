'use client'
import { ReviewsSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type ReviewsProps = {
   initialValues: ReviewsSectionValues;
   onChange: (newValues: ReviewsSectionValues) => void;
}

export default function Reviews ({ initialValues, onChange }: ReviewsProps) {
   const [reviews, setReviews] = useState<ReviewsSectionValues>(initialValues);
   const formSettings = [
      { key: "reviews", name: "Website Reviews", type: "reviews-array" },
   ]

   useEffect(() => { onChange(reviews); }, [reviews]);
   
   function updateValue (key: string, newValue: any) {
      setReviews(p => ([ ...newValue ]))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Reviews</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(reviews as any)}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
