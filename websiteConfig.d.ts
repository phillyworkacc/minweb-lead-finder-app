import { AllFonts } from "./utils/fontsSelection";

type ClientPreviewWebsite = {
   id: number;
   leadListId: string;
   leadId: string;
   websiteId: string;
   websiteConfig: string;
   createdAt: string;
}

type HeaderLink = {
   label: string;
   href: string;
}

type ServiceItem = {
   id: string;
   name: string;
   shortDescription: string;
   description: string;
   images: string[];
}

type ProjectItem = {
   id: string;
   name: string;
   description: string;
   images: string[];
}

type OpeningDays = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
type OpeningTimes = Record<OpeningDays, string>;

type ChatBotSettings = {
   position: "left" | "right";
   ctaMessage: string;
   ctaMessageTimeout: number; // in milliseconds (10 seconds as default - 10000)
   inbox: string;
}

type HeaderSettings = {
   background: string;
   color: string;
   linksStyle: "upper-case" | "title-case";
   cta: "phone" | "quote";
   links: HeaderLink[];
   desktopNavStyle: "left" | "center" | "right";
}

type ReviewItem = {
   name: string;
   review: string;
}

type SocialMediaPlatform = "instagram" | "tiktok" | "facebook" | "x" | "linkedIn" | "youtube";
type SocialMediaLink = {
   platform: SocialMediaPlatform;
   label: string;
   link: string;
}
type SocialMediaLinks = SocialMediaLink[];

type FooterSettings = {
   style: "footer-1" | "footer-2";
   logoSize?: number;
   background?: string;
   color?: string;
}

type StylingSettings = {
   accentColor: string;
   secondaryColor: string;
   background: string;
   foreground: string;
   fontFamily: AllFonts;
   header: {
      background: string;
      color: string;
   }
   formColors: {
      background: string;
      color: string;
   }
   footer: {
      background: string;
      color: string;
   }
}

export type WebsiteConfig = {
   styling: StylingSettings;
   logo: string;
   accentColor: string;
   secondaryColor: string;
   quoteCta: string;
   minwebBusinessId: string;
   name: string;
   description: string;
   email: string;
   address: string;
   phoneNumber: string;
   googleMapEmbedUrl: string;
   businessPlaceId: string;
   header: HeaderSettings;
   hero: {
      headline: string;
      subHeading: string;
      description: string;
      backgroundImage: string;
   };
   aboutUs: string[];
   servicesDescriptionCopy: string;
   services: ServiceItem[];
   projects?: ProjectItem[];
	openingTimes: OpeningTimes,
	landingPageImages: string[],
	galleryImages: string[],
	chatBot: ChatBotSettings;
   reviews: ReviewItem[];
   footer: FooterSettings;
   socialMedia?: SocialMediaLinks;
}