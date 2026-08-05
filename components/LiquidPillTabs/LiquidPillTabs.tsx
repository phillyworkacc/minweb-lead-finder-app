"use client";
import styles from "./LiquidPillTabs.module.css";

type Tab = {
   id: string;
   label: string;
};

type LiquidPillTabsProps = {
   tabs: Tab[];
   active: string;
   onChange: (id: string) => void;
}

export default function LiquidPillTabs({ tabs, active, onChange }: LiquidPillTabsProps) {
   return (
      <div className={styles.wrapper}>
         <div className={styles.tabs}>
         {tabs.map((tab) => (
            <button
               key={tab.id}
               onClick={() => onChange(tab.id)}
               className={`${styles.tab} ${active === tab.id ? styles.active : ""}`}
            >
               <span>{tab.label}</span>
            </button>
         ))}
         </div>
      </div>
   );
}