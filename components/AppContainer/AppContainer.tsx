"use client"
import "./AppContainer.css"
import { ReactNode } from "react"
import { MinwebLeadFinderLogo } from "../Icons/Icon";
import { useRouter } from "next/navigation";
import { Bell, ChevronRight, House, LayoutTemplate, Menu, ScrollText, Star, UserRound } from "lucide-react";
import { useModal } from "../Modal/ModalContext";

type AppContainerProps = {
   children: ReactNode;
}

export default function AppContainer ({ children }: AppContainerProps) {
   const router = useRouter();
   const { showModal, close } = useModal();
   
   const links = [
      {
         name: "Home",
         icon: <House size={17} />,
         href: "/", color: "#880224"
      },
      {
         name: "Starred Leads",
         icon: <Star size={17} />,
         href: "/starred-leads", color: "#00408a"
      },
      {
         name: "Website Audit Reports",
         icon: <LayoutTemplate size={17} />,
         href: "/website-audit-reports", color: "#da6f45"
      },
      {
         name: "Lead Automation Queue",
         icon: <ScrollText size={17} />,
         href: "/automated-leads-queue", color: "#91a100"
      },
      {
         name: "Notifications",
         icon: <Bell size={17} />,
         href: "/notifications", color: "#009945"
      },
   ];

   const showHeaderLinksModalBtn = () => {
      showModal({
         content: <>
            <div className="text-l full bold-600 mb-2">Header Links</div>
            <div className="box full dfb column gap-10">
               {links.map(link => (
                  <div 
                     key={link.href}
                     className="box full dfb align-center gap-10 cursor-pointer pd-1"
                     onClick={() => {
                        router.push(link.href);
                        close();
                     }}
                  >
                     <div
                        className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                        style={{ aspectRatio: '1', borderRadius: "100%", background: `${link.color}`, color: "white" }}
                     >{link.icon}</div>
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">{link.name}</div>
                        <ChevronRight size={15} />
                     </div>
                  </div>
               ))}
            </div>
            <div className="box full mt-2">
               <button className="xxxs pd-1 full outline-black" onClick={close}>Close</button>
            </div>
         </>
      })
   }

   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               <div className="app-icon">
                  <div className="app-icon-clickable" onClick={() => router.push("/")}>
                     <MinwebLeadFinderLogo size={30} />
                  </div>
               </div>
               <div className="box fit h-full pdx-1">
                  <button className="outline-black no-shadow pdx-05" onClick={showHeaderLinksModalBtn}>
                     <Menu />
                  </button>
               </div>
            </div>
         </div>
         <div className="content">
            <div className="content-wrapper">
               <div className="box mb-05" />
               {children}
            </div>
         </div>
      </div>
   )
}