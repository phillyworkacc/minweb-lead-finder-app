'use client'
import "./Card.css"
import { CSSProperties, ReactNode } from "react";

type CardProps = {
   children: ReactNode;
   styles?: CSSProperties;
   className?: string;
   cursor?: boolean;
   onClick?: Function;
}

export default function Card({ children, className, cursor, onClick, styles }: CardProps) {
   return (
      <div 
         className={`card ${className}`}
         style={{ ...styles, cursor: cursor ? 'pointer' : 'default' }}
         onClick={() => onClick ? onClick() : {}}
      >{children}</div>
   )
}
