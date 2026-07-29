"use client"
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, CSSProperties } from "react";

type SelectCustomOptions = {
   optionName: string;
   option: any;
}

type CustomSelectProps = {
   options: SelectCustomOptions[];
   onSelect: (option: any, index?: number) => void;
   defaultOptionIndex?: number;
   style?: CSSProperties;
   optionStyle?: CSSProperties;
   selectedOptionStyle?: CSSProperties;
   selectedOptionClassName?: string;
   optionClassName?: string;
}

export function CustomSelect ({ options, defaultOptionIndex, onSelect, style, optionStyle, selectedOptionStyle }: CustomSelectProps) {
   const [initialOption, setInitialOption] = useState(defaultOptionIndex || 0);
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

   return (
      <div className="select" style={style}>
         <div className="selected-option" onClick={() => setShowDropdown(prev => !prev)}>
            <div className="content" style={selectedOptionStyle}><span className="text-xxxs">{options[initialOption].option}</span></div>
            <div className="arrow"><ChevronDown size={18} /></div>
         </div>
         {showDropdown && <motion.div 
            ref={dropdownRef}
            className="options-list"
            initial={{ y: -20, x: 0, opacity: 0 }}
            animate={{ y: 0, x: 0, opacity: 1 }}
            transition={{ duration: 0.1, ease: [.37,.93,.7,.96] }}
         >
            {options.map((option, index) => {
               return <div 
                  key={index} 
                  className="option"
                  style={optionStyle}
                  onClick={() => {
                     setInitialOption(index);
                     onSelect(option.optionName, index);
                     setShowDropdown(false);
               }}><span className="text-xxxs">{option.option}</span></div>
            })}
         </motion.div>}
      </div>
   )
}