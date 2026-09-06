'use client'
import "@/styles/cwb.css"
import AppContainer from "@/components/AppContainer/AppContainer";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Business from "@/components/CwbTools/Business";
import Spacing from "@/components/Spacing/Spacing";
import {
   BusinessSectionValues, ContentSectionValues, FooterSectionValues, HeaderSectionValues,
   HeroSectionValues, ImagesSectionValues, ProjectsSectionValues, ReviewsSectionValues, ServicesSectionValues,
   SocialMediaSectionValues, StylingSectionValues
} from "@/customWebsiteBuild";
import { useState } from "react";
import { BusinessIcon } from "@/components/Icons/Icon";
import { leadCardItemEllipsis, websiteFormatting } from "@/machine/helpers";
import { MapPin, Phone, Mail, Globe, SquareArrowOutUpRight, Search, Copy } from "lucide-react";
import Styling from "@/components/CwbTools/Styling";
import Images from "@/components/CwbTools/Images";
import Header from "@/components/CwbTools/Header";
import Hero from "@/components/CwbTools/Hero";
import Content from "@/components/CwbTools/Content";
import Services from "@/components/CwbTools/Services";
import Projects from "@/components/CwbTools/Projects";
import Reviews from "@/components/CwbTools/Reviews";
import SocialMedia from "@/components/CwbTools/SocialMedia";
import Footer from "@/components/CwbTools/Footer";
import Link from "next/link";
import { copyToClipboard } from "@/lib/str";
import { color } from "framer-motion";

type CustomWebsiteBuilderToolProps = {
   lead: AutomatedLead;
}

export default function CustomWebsiteBuilderTool ({ lead }: CustomWebsiteBuilderToolProps) {
   // section controller
   const sections = ['business','styling','images','header','hero','content','services','projects','reviews','social-media','footer','finish'];
   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

   // states for each section
   const [business, setBusiness] = useState<BusinessSectionValues>({
      logo: "", name: lead.name, minwebBusinessId: "", description: "",
      email: lead.email || '', address: lead.address || "", phoneNumber: lead.phoneNumber || "", googleMapEmbedUrl: "",
      businessPlaceId: "", quoteCta: "",
   });
   const [styling, setStyling] = useState<StylingSectionValues>({
      accentColor: "#ffffff", secondaryColor: "#ffffff", background: "#ffffff",
      foreground: "#ffffff", fontFamily: "Inter",
      headerBackground: "#ffffff", headerColor: "#ffffff",
      formColorsBackground: "#ffffff", formColorsColor: "#ffffff",
      footerBackground: "#ffffff", footerColor: "#ffffff"
   });
   const [images, setImages] = useState<ImagesSectionValues>([]);
   const [header, setHeader] = useState<HeaderSectionValues>({
      linksStyle: "upper-case",
      cta: "phone",
      desktopNavStyle: "left"
   });
   const [hero, setHero] = useState<HeroSectionValues>({
      headline: "",
      subHeading: "",
      description: "",
      backgroundImage: ""
   });
   const [content, setContent] = useState<ContentSectionValues>({
      aboutUs: [],
      servicesDescriptionCopy: "",
      openingTimes: {
         'Sunday': "", 'Monday': "", 'Tuesday': "", 'Wednesday': "",
         'Thursday': "", 'Friday': "", 'Saturday': "",
      }
   });
   const [services, setServices] = useState<ServicesSectionValues>([]);
   const [projects, setProjects] = useState<ProjectsSectionValues>([]);
   const [reviews, setReviews] = useState<ReviewsSectionValues>([]);
   const [socialMedia, setSocialMedia] = useState<SocialMediaSectionValues>([]);
   const [footer, setFooter] = useState<FooterSectionValues>({ style: "footer-1", logoSize: 55 });

   return (
      <AppContainer>
         <div className="box full pd-1">
            <Breadcrumb
               textSize='xxxs' noDashboard
               pages={[
                  { label: "Back to Lead List", href: `/auto-lead-list/${lead.leadListId}` },
                  { label: `Create Website for ${lead.name}`, href: "" }
               ]}
            />
         </div>

         <div className="box full" style={{ userSelect: "text" }}>
            <div className="text-m full bold-700 pd-1 mt-1">{lead.name}</div>
            <div className="text-xxxs full grey-5">{lead?.address!.trim()}</div>
            {(lead.email) ? ( <div className="text-xxxs full grey-5 pd-05">{lead.email}</div> ) : (<></>)}
            {(lead.phoneNumber) ? ( <div className="text-xxxs full grey-5 pd-05">{lead.phoneNumber}</div> ) : (<></>)}
            {(lead.website) ? ( <div className="text-xxxs full grey-5 pd-05">{lead.website}</div> ) : (<></>)}
            <div className="box full dfb wrap gap-5 mt-1" style={{ maxWidth: "650px" }}>
               <Link href={`https://google.com/search?q=${encodeURIComponent(`${lead.name} ${lead.address}`)}`} target="_blank">
                  <button className="xxxxs pd-11 full pdx-15 border-radius-15 whitespace-nowrap mw-500"><Search size={14} /> Google Search</button>
               </Link>
            </div>
         </div>
         <Spacing size={2} />
         
         <div className="box full dfb align-center gap-10 pd-2">
            <button 
               className="xxs pd-13 pdx-2 radius-20 outline-black no-shadow fit"
               onClick={e => setCurrentSectionIndex(p => (p < 1 ? 0 : p-1))}
            >Back</button>
            <button 
               className="xxs pd-13 pdx-2 radius-20 no-shadow fit"
               onClick={e => setCurrentSectionIndex(p => (p > 9 ? 11 : p+1))}
            >{currentSectionIndex == 10 ? "Build" : "Next"}</button>
         </div>

         <div className="box full pd-1">
            {sections[currentSectionIndex] == "business" && (<>
               <Business initialValues={business} onChange={newValue => setBusiness(newValue)} />
            </>)}

            {sections[currentSectionIndex] == "styling" && (<>
               <Styling initialValues={styling} onChange={newValue => setStyling(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "images" && (<>
               <Images initialValues={images} onChange={newValue => setImages(p => ([ ...newValue ]))} />
            </>)}
            
            {sections[currentSectionIndex] == "header" && (<>
               <Header initialValues={header} onChange={newValue => setHeader(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "hero" && (<>
               <Hero initialValues={hero} onChange={newValue => setHero(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "content" && (<>
               <Content initialValues={content} onChange={newValue => setContent(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "services" && (<>
               <Services initialValues={services} onChange={newValue => setServices(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "projects" && (<>
               <Projects initialValues={projects} onChange={newValue => setProjects(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "reviews" && (<>
               <Reviews initialValues={reviews} onChange={newValue => setReviews(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "social-media" && (<>
               <SocialMedia initialValues={socialMedia} onChange={newValue => setSocialMedia(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "footer" && (<>
               <Footer initialValues={footer} onChange={newValue => setFooter(newValue)} />
            </>)}
            
            {sections[currentSectionIndex] == "finish" && (<>
               {JSON.stringify({
                  styling: {
                     accentColor: styling.accentColor,
                     secondaryColor: styling.secondaryColor,
                     background: styling.background,
                     foreground: styling.foreground,
                     fontFamily: styling.fontFamily,
                     footer: {
                        background: styling.footerBackground,
                        color: styling.footerColor
                     }
                  },
                  logo: business.logo,
                  accentColor: styling.accentColor,
                  secondaryColor: styling.secondaryColor,
                  quoteCta: business.quoteCta,
                  minwebBusinessId: business.minwebBusinessId,
                  name: business.name,
                  description: business.description,
                  email: business.email,
                  address: business.address,
                  phoneNumber: business.phoneNumber,
                  googleMapEmbedUrl: business.googleMapEmbedUrl,
                  businessPlaceId: business.businessPlaceId,
                  header: {
                     ...header,
                     background: styling.headerBackground,
                     color: styling.headerColor,
                     links: [
                        { href: "/", label: "Home" },
                        { href: "/services", label: "Services" },
                        { href: "/gallery", label: "Gallery" },
                        { href: "/projects", label: "Projects" },
                        { href: "/reviews", label: "Testimonials" },
                        { href: "/review-us", label: "Review Us" },
                        { href: "/contact", label: "Contact Us" },
                     ]
                  },
                  formColors: {
                     background: styling.formColorsBackground,
                     color: styling.formColorsColor
                  },
                  hero, aboutUs: content.aboutUs,
                  servicesDescriptionCopy: content.servicesDescriptionCopy,
                  services, projects,
                  openingTimes: content.openingTimes,
                  landingPageImages: images,
                  galleryImages: images,
                  chatBot: {
                     position: "right",
                     ctaMessage: "Let us know if you have any questions!",
                     ctaMessageTimeout: 10000, // in milliseconds (10 seconds as default)
                     inbox: "This text goes straight to my personal phone. I will make sure to get back to you the second I'm free!"
                  },
                  reviews, footer, socialMedia
               })}

               <Spacing size={2} />
               <button 
                  className="xxxxs pd-11 full pdx-15 border-radius-15 whitespace-nowrap mw-500"
                  onClick={() => copyToClipboard(JSON.stringify({
                  styling: {
                     accentColor: styling.accentColor,
                     secondaryColor: styling.secondaryColor,
                     background: styling.background,
                     foreground: styling.foreground,
                     fontFamily: styling.fontFamily,
                     footer: {
                        background: styling.footerBackground,
                        color: styling.footerColor
                     }
                  },
                  logo: business.logo,
                  accentColor: styling.accentColor,
                  secondaryColor: styling.secondaryColor,
                  quoteCta: business.quoteCta,
                  minwebBusinessId: business.minwebBusinessId,
                  name: business.name,
                  description: business.description,
                  email: business.email,
                  address: business.address,
                  phoneNumber: business.phoneNumber,
                  googleMapEmbedUrl: business.googleMapEmbedUrl,
                  businessPlaceId: business.businessPlaceId,
                  header: {
                     ...header,
                     background: styling.headerBackground,
                     color: styling.headerColor,
                     links: [
                        { href: "/", label: "Home" },
                        { href: "/services", label: "Services" },
                        { href: "/gallery", label: "Gallery" },
                        { href: "/projects", label: "Projects" },
                        { href: "/reviews", label: "Testimonials" },
                        { href: "/review-us", label: "Review Us" },
                        { href: "/contact", label: "Contact Us" },
                     ]
                  },
                  formColors: {
                     background: styling.formColorsBackground,
                     color: styling.formColorsColor
                  },
                  hero, aboutUs: content.aboutUs,
                  servicesDescriptionCopy: content.servicesDescriptionCopy,
                  services, projects,
                  openingTimes: content.openingTimes,
                  landingPageImages: images,
                  galleryImages: images,
                  chatBot: {
                     position: "right",
                     ctaMessage: "Let us know if you have any questions!",
                     ctaMessageTimeout: 10000, // in milliseconds (10 seconds as default)
                     inbox: "This text goes straight to my personal phone. I will make sure to get back to you the second I'm free!"
                  },
                  reviews, footer, socialMedia
               }))}
               >
                  <Copy size={14} /> Copy Website Config
               </button>
            </>)}
         </div>
         
         <Spacing size={7} />
      </AppContainer>
   )
}
