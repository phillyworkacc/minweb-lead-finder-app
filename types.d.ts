type LeadCollection = {
   id: number;
   leadCollectionsId: string;
   name: string;
   date: string;
   folders: string;
}

type Lead = {
   id: number;
   leadCollectionsId: string;
   leadId: string;
   name: string;
   email: string;
   address: string;
   phoneNumber: string;
   website: string;
   called: string;
   starred: boolean;
}

type WebsiteAuditReport = {
   id: number;
   auditId: string;
   leadCollectionsId: string;
   leadId: string;
   auditJson: string;
   date: string;
}

type Folder = {
   id: string;
   folderId: string;
   name: string;
}

type WebsiteAuditReportExtra = WebsiteAuditReport & {
   name?: string;
}

type WebsiteAudit = {
   title: string;
   website: any;
   auditPoints: {
      issue: string;
      detail: string;
   }[];
}

type LeadQueueItem = {
   id: number;
   niche: string;
   location: string;
   priority: string;
   createdAt: string;
   completedAt: string;
}

type AutomatedLeadList = {
   id: number;
   leadListId: string;
   name: string;
   date: string;
   folders: string;
}

type AutomatedLead = {
   id: number;
   leadListId: string;
   leadId: string;
   name: string;
   email: string;
   address: string;
   phoneNumber: string;
   website: string;
   called: string;
   starred: boolean;
   date: string;
   websiteScrapedInfo: string;
   audit: string;
   leadScore: string;
   offersForLead: string;
   outreachPrompt: string;
}

// CUSTOM TYPES FOR LEAD JSONs
type WebsiteScrapedInfo = {
   exists: boolean;
   url: string;
   title: string;
   metaDescription: string;
   loadingTime: number,
   socialLinks: {
      facebook: string;
      instagram: string;
      linkedin: string;
      twitter: string;
      youtube: string;
      tiktok: string;
   },
   googleMapEmbedded: false,
   contactFormPresent: true,
   emails: string[];
   phoneNumbers: string[];
   images: {
      total: number;
      missingAlt: number;
   };
   cta: {
      exists: boolean;
      text:  string[];
   },
   ssl: boolean;
}

type WebsiteSpeed = "fast" | "average" | "slow";
type ProperWebsiteAudit = {
   websiteScore: number;
   mobileFriendly: boolean;
   ssl: boolean;
   speed: WebsiteSpeed;
   hasCTA: boolean;
   hasContactInfo: boolean;
   hasMetaDescription: boolean;
   hasTitle: boolean;
   hasGoogleMapsEmbedded: boolean;
   hasContactForm: boolean;
   hasImages: boolean;
   missingAltImages: number,
   socialPresence: {
      facebook: boolean;
      instagram: boolean;
      linkedin: boolean;
      twitter: boolean;
      youtube: boolean;
      tiktok: boolean;
   },
   strengths: string[];
   weaknesses: string[];
}

type LeadPriority = "High" | "Medium" | "Low";
type LeadScore = {
   score: number;
   priority: LeadPriority;
   reasons: string[];
}

type Offer = {
   offer: "Website redesign" | "Website maintenance" | "SEO" | "Social media management" | "5-Star Google Reviews" | "Missed Call Text Back";
   score: number
}
type LeadOffers = Offer[];