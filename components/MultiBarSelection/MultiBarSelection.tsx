'use client'
import "./MultiBarSelection.css"
import { useState } from "react";

type SelectionOption = {
   label: React.ReactNode | string;
   action: () => void;
}

type MultiBarSelectionProps = {
   options: SelectionOption[];
   defaultSelectedIndex?: number;
}

export default function MultiBarSelection ({ options, defaultSelectedIndex }: MultiBarSelectionProps) {
   const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex || 0);

   return (
      <div className="multi-bar-selection">
         {options.map((option, index) => (
            <div 
               key={index} 
               className={`bar-selection ${selectedIndex == index ? 'selected' : ''}`}
               onClick={() => {
                  setSelectedIndex(index)
                  option.action()
               }}
            >
               {typeof option.label == "string"
                  ? <div className="text-xxxs fit">{option.label}</div>
                  : option.label
               }
            </div>
         ))}
      </div>
   )
}
