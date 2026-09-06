'use client'
import { ProjectsSectionValues } from "@/customWebsiteBuild";
import { useEffect, useState } from "react";
import FormElement from "./FormElement";

type ProjectsProps = {
   initialValues: ProjectsSectionValues;
   onChange: (newValues: ProjectsSectionValues) => void;
}

export default function Projects ({ initialValues, onChange }: ProjectsProps) {
   const [projects, setProjects] = useState<ProjectsSectionValues>(initialValues);
   const formSettings = [
      { key: "projects", name: "Website Projects", type: "projects-array" },
   ]

   useEffect(() => { onChange(projects); }, [projects]);
   
   function updateValue (key: string, newValue: any) {
      setProjects(p => ([ ...newValue ]))
   }

   return (
      <div className="box full dfb column gap-15">
         <div className="text-ml bold-600 full">Website Projects</div>
         {formSettings.map((formSetting, index) => (
            <FormElement 
               key={index} formSetting={formSetting as any}
               initialValue={(projects as any)}
               updateValue={updateValue}
            />
         ))}
      </div>
   )
}
