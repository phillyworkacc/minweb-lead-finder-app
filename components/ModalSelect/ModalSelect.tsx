'use client'
import './ModalSelect.css'
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleCheck, CirclePlus, Square, X } from 'lucide-react';
import { type CSSProperties, useState } from 'react';

type ModalSelectProps = {
   options: any[];
   onSelect: (option: any, index?: number) => void;
   title: string;
   styles?: CSSProperties;
   showDeselect?: boolean;
   defaultOption?: number;
}

export default function ModalSelect ({ options, onSelect, title, styles, defaultOption, showDeselect }: ModalSelectProps) {
   const [search, setSearch] = useState('');
   const [optionChosen, setOptionChosen] = useState<number | null>(defaultOption || null);
   const [pendingOptionChosen, setPendingOptionChosen] = useState<number | null>(defaultOption || null);
   const [showModalSelector, setShowModalSelector] = useState(false);

   return (
      <div className="modal-select" style={styles}>
         <div className="selected-option" onClick={() => {
            setSearch("");
            setShowModalSelector(true);
         }}>
            <div className="content">
               {(optionChosen == null) ? 'No Option Chosen' : options[optionChosen]}
            </div>
            <div className="arrow"><CirclePlus size={18} /></div>
         </div>

         <AnimatePresence>
            {showModalSelector && <motion.div 
               className="options-modal-container"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.1, ease: [.5,.91,.66,.95] }}
            >
               <div className="options-modal-box">
                  <div className="close-ms">
                     <div className="close-btn" onClick={() => setShowModalSelector(false)}>
                        <X size={18} />
                     </div>
                  </div>

                  <div className="text-l bold-700 full">{title}</div>

                  <div className="search-box">
                     <input type="text" className="xxs pd-1 pdx-15 full" placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} />
                  </div>

                  <div className="options-list-container">
                     <div className="options-list">
                        {options
                        .filter(option => option.toLowerCase().includes(search.toLowerCase()))
                        .map((option, index) => {
                           return <div 
                              key={index} 
                              className={`option ${(options.indexOf(option) == pendingOptionChosen) && 'selected'}`}
                              onClick={() => {
                                 const originalOptionIndex = options.indexOf(option);
                                 setPendingOptionChosen(originalOptionIndex);
                              }}
                           >
                              {(options.indexOf(option) == pendingOptionChosen) && (
                                 <motion.div 
                                    className="selected-check"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.1, ease: 'easeIn' }}
                                 >
                                    <Check size={17} />
                                 </motion.div>
                              )}
                              {option}
                           </div>
                        })}
                     </div>
                  </div>

                  <div className="text-s dfb align-center justify-end gap-10 mt-1">
                     {(showDeselect) && (<button 
                        className='xs outline-black tiny-shadow pd-1 pdx-2'
                        onClick={() => {
                           setPendingOptionChosen(null);
                           setOptionChosen(null);
                           onSelect('', -1);
                           setShowModalSelector(false);
                        }}
                     >Deselect <Square size={17} /></button>)}
                     <button 
                        className='xs pd-1 pdx-2'
                        onClick={() => {
                           setShowModalSelector(false);
                           onSelect(options[pendingOptionChosen!], pendingOptionChosen!);
                           setOptionChosen(pendingOptionChosen);
                        }}
                     >Choose <CircleCheck size={17} /></button>
                  </div>

               </div>
            </motion.div>}
         </AnimatePresence>

      </div>
   )
}
