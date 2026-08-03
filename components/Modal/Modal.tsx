'use client'
import './Modal.css'
import { X } from 'lucide-react';
import { ReactNode } from 'react'

type ModalProps = {
   children: ReactNode;
   close?: () => void;
}

export function Modal ({ children }: ModalProps) {
   return (
      <div className="modal">
         <div className='modal-box'>{children}</div>
      </div>
   )
}

export function MassiveModal ({ children, close }: Required<ModalProps>) {
   return (
      <div className="massive-modal">
         <div className='massive-modal-box'>
            <div className="close" onClick={close}><X size={16} strokeWidth={3} /></div>
            <div className="massive-modal-container">{children}</div>
         </div>
      </div>
   )
}
