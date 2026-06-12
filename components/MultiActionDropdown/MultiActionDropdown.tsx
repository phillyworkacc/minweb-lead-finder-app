'use client'
import "./MultiActionDropdown.css"
import { AnimatePresence, motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react"
import { ReactNode, useEffect, useRef, useState } from "react";

type MultiActionDropdownProps = {
   actions: {
      action: Function;
      label: ReactNode | string;
      appearance: 'normal' | 'success' | 'delete';
   }[];
}

export default function MultiActionDropdown ({ actions }: MultiActionDropdownProps) {
   const [showDropdown, setShowDropdown] = useState(false);
   const dropdownRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      function handleClickOutside(event: any) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [dropdownRef]);

   return (<>
      <div className="multi-action-dropdown">
         <button className="fit multi-action-btn" onClick={() => setShowDropdown(p => !p)}>
            <MoreHorizontal size={16} />
         </button>
         <AnimatePresence>
            {showDropdown && (<motion.div
               ref={dropdownRef}
               className="multi-action-dropdown-box"
               initial={{ y: -20, x: 0, opacity: 0 }}
               animate={{ y: 0, x: 0, opacity: 1 }}
               transition={{ duration: 0.1, ease: [.5,.91,.66,.95] }}
            >
               {actions.map((action, index) => (
                  <div className={`mad-item ${action.appearance}`} key={index} onClick={() => {
                     action.action();
                     setShowDropdown(false);
                  }}>
                     <div className="text-xxxs full bold-500 dfb align-center gap-5 whitespace-nowrap">
                        {action.label}
                     </div>
                  </div>
               ))}
            </motion.div>)}
         </AnimatePresence>
      </div>
   </>)
}
