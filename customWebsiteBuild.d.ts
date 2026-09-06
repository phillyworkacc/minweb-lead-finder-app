import { WebsiteConfig } from "./websiteConfig";

export type BusinessSectionValues = {
   logo: string;
   name: string;
   minwebBusinessId: string;
   description: string;
   email: string;
   address: string;
   phoneNumber: string;
   googleMapEmbedUrl: string;
   businessPlaceId: string;
   quoteCta: string;
}

export type StylingSectionValues = {
   accentColor: string;
   secondaryColor: string;
   background: string;
   foreground: string;
   fontFamily: AllFonts;
   headerBackground: string;
   headerColor: string;
   formColorsBackground: string;
   formColorsColor: string;
   footerBackground: string;
   footerColor: string; 
}

export type ColorsSectionValues = {
   name: string;
   minwebBusinessId: string;
   description: string;
   email: string;
   address: string;
   phoneNumber: string;
   googleMapEmbedUrl: string;
   businessPlaceId: string;
   logo: string;
}

export type ImagesSectionValues = string[];
export type HeaderSectionValues = Omit<WebsiteConfig['header'], "background" | "color" | "links">
export type HeroSectionValues = WebsiteConfig['hero'];

export type ContentSectionValues = {
   aboutUs: string[];
   servicesDescriptionCopy: string;
   openingTimes: WebsiteConfig['openingTimes'];
}

export type ServicesSectionValues = WebsiteConfig['services'];
export type ProjectsSectionValues = WebsiteConfig['projects'];
export type ReviewsSectionValues = WebsiteConfig['reviews'];
export type SocialMediaSectionValues = WebsiteConfig['socialMedia'];
export type FooterSectionValues = Omit<WebsiteConfig['footer'], "background" | "color">;