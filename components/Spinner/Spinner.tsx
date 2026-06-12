'use client'
import './Spinner.css'
import { Loader2 } from 'lucide-react';

type SpinnerProps = {
   black?: boolean;
}

type CustomSpinnerProps = {
   color?: string;
   size?: number;
   strokeWidth?: string;
}

export default function Spinner ({ black }: SpinnerProps) {
   return <span className={`spinner ${black && 'black'}`} />;
}

export function CustomSpinner ({ size, color, strokeWidth }: CustomSpinnerProps) {
   return <div className="loader-circle" style={{width:`${size}px`,height:`${size}px`}}>
      <Loader2 size={size} color={color || '#000'} strokeWidth={strokeWidth || 2.5} />
   </div>;
}
