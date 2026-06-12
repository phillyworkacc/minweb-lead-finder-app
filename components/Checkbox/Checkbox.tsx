'use client'
import "./Checkbox.css"
import { Check } from "lucide-react";
import { useState } from "react";

type CheckboxProps = {
   label: string;
   defaultChecked?: boolean;
   onChange: (value: boolean) => void;
}

export default function Checkbox ({ label, onChange, defaultChecked }: CheckboxProps) {
   const [checked, setChecked] = useState(defaultChecked || false)

   const onToggleCheck = () => {
      onChange(!checked);
      setChecked(c => !c);
   }

   return (
      <div className="box fit dfb align-center gap-5 pd-05 cursor-pointer" onClick={onToggleCheck}>
         <div className={`check-box-check ${checked && 'checked'}`}>
            <Check size={12} color="#fff" />
         </div>
         <div className="text-t full h-full dfb whitespace-nowrap">{label}</div>
      </div>
   )
}
