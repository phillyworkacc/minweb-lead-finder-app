"use client"
import "./HoverButton.css"
import { ReactNode } from "react"

type HoverButtonProps = {
   className?: string;
   onClick?: () => void;
   children: ReactNode;
};

export default function HoverButton ({ onClick, className, children }: HoverButtonProps) {
   return (
      <button
         className={"hover-button " + className} onClick={() => { if (onClick) onClick(); }}
      >{children}</button>
   )
}
