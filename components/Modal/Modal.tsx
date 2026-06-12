'use client'
import './Modal.css'
import { ReactNode } from 'react'

type ModalProps = {
   children: ReactNode;
}

export function Modal ({ children }: ModalProps) {
   return (
      <div className="modal">
         <div className='modal-box'>
            {children}
         </div>
      </div>
   )
}
