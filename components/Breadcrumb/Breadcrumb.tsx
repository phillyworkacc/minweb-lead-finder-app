'use client'
import { useRouter } from "next/navigation";

type BreadcrumbProps = {
   pages: {
      href: string;
      label: string;
   }[];
   textSize?: string;
   noDashboard?: boolean;
}

export default function Breadcrumb({ pages, textSize, noDashboard}: BreadcrumbProps) {
   const router = useRouter();

   return (
      <div className="box full dfb align-center wrap gap-10">
         {(!noDashboard) && (<div className="box fit dfb align-center gap-10">
            <div className={`text-${textSize || 'xxs'} visible-link`} onClick={() => router.push('/')}>Dashboard</div>
            <div className={`text-${textSize || 'xxs'}`}>/</div>
         </div>)}
         {pages.map((page, index) => (
            <div className="box fit dfb align-center gap-10" key={index}>
               <div 
                  className={`text-${textSize || 'xxs'} whitespace-nowrap ${(index == (pages.length-1)) ? 'bold-600 accent-color' : 'visible-link'}`}
                  onClick={() => { if (index !== (pages.length-1)) router.push(page.href); }}
               >{page.label}</div>
               {(index !== (pages.length-1)) && (<div className="text-xxs">/</div>)}
            </div>
         ))}
      </div>
   )
}
