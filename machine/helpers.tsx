import { Check } from "lucide-react";
import { ReactNode } from "react"

function FilterDropdownBox ({ children }:{ children: ReactNode }) {
   return <div className="box fit dfb align-center gap-5">{children}</div>
}

export function websiteFormatting (url: string, noThreshold?: boolean) {
   const threshold = 25;
   const href = new URL(url).hostname;
   if (noThreshold) return url;
   return (href.length > threshold) ? `${href.toLowerCase().substring(0,threshold)}...` : `${href.toLowerCase()}`;
}

export function leadCardItemEllipsis (str: string) {
   const threshold = 45;
   return (str.length > threshold) ? `${str.substring(0,threshold)}...` : `${str.toLowerCase()}`;
}

export function filterDropdownActions (filters: any, setFilters: any): { action: Function; label: ReactNode | string; appearance: 'normal' | 'success' | 'delete'; }[] {
   const filterLabels: Record<any, string> = {
      hasEmail: "Has Email",
      hasWebsite: "Has Website",
      hasNoWebsite: "Has No Website",
      hasPhoneNumber: "Has Phone Number",
      hasSocialMedia: "Has Social Media",
      hasHighPriority: "Has High Priority",
      hasMediumPriority: "Has Medium Priority",
      hasLowPriority: "Has Low Priority",
      isStarred: "Starred",
      needsSeo: "Needs SEO",
      needsSMMA: "Needs SMMA",
      needsMissedCallTB: "Needs Missed Call TB",
      needsWebRedesignMaintenance: "Needs Web Design",
   }

   const filterKeys = Object.keys(filters);
   return filterKeys.map(filterKey => ({
      appearance: "normal",
      label: <FilterDropdownBox>{filters[filterKey] && (<Check size={16} color='#1131ff' strokeWidth={4} />)} {filterLabels[filterKey]}</FilterDropdownBox>,
      action: () => setFilters((p: any) => ({ ...p, [filterKey]: !p[filterKey] || null }))
   }))
}