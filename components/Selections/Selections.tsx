'use client'
import './Selections.css'
import { useState } from 'react';

type SelectProps = {
   selections: any[];
   onSelect: (options: number[]) => void;
   defaultSelectionIndexes?: number[];
}

export default function Selections ({ selections, onSelect, defaultSelectionIndexes }: SelectProps) {
   const [optionSelected, setOptionSelected] = useState<number[]>(defaultSelectionIndexes ? [...defaultSelectionIndexes] : []);

   const toggleSelectOption = (index: number) => {
      if (optionSelected.includes(index)) {
         setOptionSelected(p => ([...p.filter(i => i !== index)]));
         onSelect([...optionSelected.filter(i => i !== index)]);
      } else {
         setOptionSelected(p => ([...p, index]));
         onSelect([...optionSelected, index]);
      }
   }

   return (
      <div className="selections">
         {selections.map((option, index) => (
            <div 
               key={index}
               className={`selection ${(optionSelected.includes(index)) && 'selected'}`}
               onClick={() => toggleSelectOption(index)}
            >
               <span className="text-xxs">{option}</span>
            </div>
         ))}
      </div>
   )
}
