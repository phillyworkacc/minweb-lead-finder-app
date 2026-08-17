'use client'
import "./SelectionTab.css"
import { useEffect, useState } from "react";

type SelectionTab = {
   items: {
      label: string | React.ReactNode;
      action: () => void;
      color: string;
      foreground: string;
   }[]
}

export default function SelectionTab ({ items }: SelectionTab) {
   const [selectedItem, setSelectedItem] = useState<number>(0);

   useEffect(() => {
      const itemColor = items[selectedItem];
      document.documentElement.style.setProperty("--selected-selection-tab-bg", itemColor.color);
      document.documentElement.style.setProperty("--selected-selection-tab-foreground", itemColor.foreground);
   }, [selectedItem])

   return (
      <div className="selection-tab">
         {items.map((item, index) => (
            <div 
               key={index} 
               className={`tab-item ${index == selectedItem ? 'selected' : ''}`} 
               onClick={() => {
                  item.action()
                  setSelectedItem(index)
               }}
            >
               {item.label}
            </div>
         ))}
      </div>
   )
}
