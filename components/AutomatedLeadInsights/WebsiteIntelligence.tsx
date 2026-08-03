"use client"
import "./WebsiteIntelligence.css"
import { BicepsFlexed, Check, FacebookIcon, FileText, Globe, Image, Images, InstagramIcon, LinkedinIcon, Mail, MapPin, MessageSquare, MousePointerClick, Phone, ShieldCheck, Smartphone, TriangleAlert, TwitterIcon, Type, X, YoutubeIcon } from "lucide-react";
import { TiktokIcon } from "../Icons/Icon";
import Spacing from "../Spacing/Spacing";
import Link from "next/link";
import ScoreStamp from "../ScoreStamp/ScoreStamp";

type WebsiteIntelligenceProps = {
   websiteScrapedInfo: WebsiteScrapedInfo;
   websiteAudit: ProperWebsiteAudit;
}

export default function WebsiteIntelligence ({ websiteScrapedInfo, websiteAudit }: WebsiteIntelligenceProps) {
   if (websiteScrapedInfo.exists && websiteScrapedInfo.url) {
      return (<>
         <div className="text-sm full bold-700 mb-05">Website & Lead Insights</div>
         <div className="text-s full bold-500 mb-15">{websiteScrapedInfo.title}</div>
         <div className="box full dfb wrap gap-10">
            <ScoreCard score={websiteAudit.websiteScore} />
            <WebsiteSpeed speed={websiteAudit.speed} loadTimeMs={websiteScrapedInfo.loadingTime} />
            <ImagesCaptured images={websiteScrapedInfo.images} />
         </div>

         <Spacing size={2} />
         <div className="text-xs full bold-700 mb-1">Signals</div>
         <Signals audit={websiteAudit} />

         <Spacing size={2} />
         <div className="text-xs full bold-700 mb-1">Web Search Result</div>
         <SearchResultOverview websiteScrapedInfo={websiteScrapedInfo} />

         <Spacing size={2} />
         <div className="text-xs full bold-700 mb-1">Social Media Presence</div>
         <SocialMediaPresence websiteScrapedInfo={websiteScrapedInfo} audit={websiteAudit} />

         <Spacing size={2} />
         <div className="text-xs full bold-700 mb-1">Call To Actions</div>
         <CallToActions websiteScrapedInfo={websiteScrapedInfo} />

         <Spacing size={2} />
         <div className="text-xs full bold-700 mb-1">Contact Information</div>
         <ContactInfos websiteScrapedInfo={websiteScrapedInfo} />

         <Spacing size={2} />
         <StrengthsAndWeaknesses audit={websiteAudit} />
      </>)
   } else {
      return (<>
         <div className="text-sm full bold-700 mb-05">Website & Lead Insights</div>
         <div className="text-s full bold-500 mb-15">{websiteScrapedInfo.title}</div>
         <div className="text-xxs grey-5 full">No Website</div>
      </>)
   }
}

function ScoreCard ({ score }: { score: number }) {
   const grade = (score: number) => {
      const s = Math.min(100, Math.max(0, score))
      if (s >= 90) return { grade: "A", tone: "teal", color: "#008a60", label: "Excellent" };
      if (s >= 80) return { grade: "B", tone: "gold", color: "#008a60", label: "Good" };
      if (s >= 70) return { grade: "C", tone: "slate", color: "#e66f00", label: "Fair" };
      if (s >= 55) return { grade: "D", tone: "amber", color: "#e66f00", label: "Weak" };
      return { grade: "F", tone: "rust", color: "#550300", label: "Critical" };
   }

   return (<div className="web-int-card">
      <div className="text-xxt bold-500 full grey-4">WEBSITE SCORE</div>
      {/* <div className="box full dfb align-center gap-10 pd-05">
         <div className="text-ml bold-700 full">{grade(score).grade}</div>
         <div className="text-xxs bold-500 fit">{score}/100</div>
      </div>
      <div className="web-int-score-card-progress">
         <div className="web-int-score-card-progress-bar" style={{ width: `${score}%`, background: grade(score).tone }} />
      </div> */}
      <ScoreStamp
         value={score}
         primary={grade(score).grade}
         secondary={`${score}/100`}
         tone={grade(score).tone as any}
         caption={grade(score).label.toUpperCase()}
      />
   </div>)
}

function WebsiteSpeed ({ speed, loadTimeMs }: { speed: WebsiteSpeed, loadTimeMs: number }) {
   return (<div className="web-int-card">
      <div className="text-xxt bold-500 full grey-4">LOAD PERFORMANCE</div>
      <div className="text-ml bold-600 full pd-05">{(loadTimeMs/1000).toFixed(2)}s</div>
      <div className="load-performance-meter-container">
         <div className="load-performance-meter">
            <div className={`gauge ${speed}`} />
            <div className="fast-region" />
            <div className="avg-region" />
            <div className="slow-region" />
         </div>
         <div className="load-performance-meter-label">
            <div className="label">FAST</div>
            <div className="label">AVG</div>
            <div className="label">SLOW</div>
         </div>
      </div>
   </div>)
}

function ImagesCaptured ({ images }: { images: WebsiteScrapedInfo["images"] }) {
   return (<div className="web-int-card">
      <div className="text-xxt bold-500 full grey-4 mb-05">IMAGES CAPTURED</div>
      <div className="box full dfb column gap-10">
         <div className="box full dfb align-center gap-10">
            <div className="box fit h-full dfb align-center"><Images size={15} /></div>
            <div className="text-xxxs full">{images.total} image(s) found</div>
         </div>
         <div className="box full dfb align-center gap-10">
            <div className="box fit h-full dfb align-center"><TriangleAlert size={15} color="#b54708" /></div>
            <div className="text-xxxs full" style={{ color: "#b54708" }}>{images.missingAlt} missing alt text</div>
         </div>
      </div>
   </div>)
}

function Signals ({ audit }: { audit: ProperWebsiteAudit }) {
   const signals = [
      { key: "ssl", label: "SSL Certificate", pass: audit.ssl, Icon: ShieldCheck },
      { key: "mobile", label: "Mobile Friendly", pass: audit.mobileFriendly, Icon: Smartphone },
      { key: "title", label: "Title Tag", pass: audit.hasTitle, Icon: Type },
      { key: "meta", label: "Meta Description", pass: audit.hasMetaDescription, Icon: FileText },
      { key: "cta", label: "Call-To-Action", pass: audit.hasCTA, Icon: MousePointerClick },
      { key: "form", label: "Contact Form", pass: audit.hasContactForm, Icon: MessageSquare },
      { key: "contact", label: "Contact Info", pass: audit.hasContactInfo, Icon: Mail },
      { key: "maps", label: "Google Maps Embed", pass: audit.hasGoogleMapsEmbedded, Icon: MapPin },
      { key: "images", label: "Images Present", pass: audit.hasImages, Icon: Image },
   ];

   return (<div className="box full dfb wrap gap-5">
      {signals.map(({ pass, label, key, Icon }) => (
         <div key={key} className={`signal-tag ${pass ? "pass" : "fail"}`}>
            <div className="box fit h-full dfb align-center">
               <Icon size={13} />
            </div>
            <div className="text-t bold-600 full grey-5">{label}</div>
            <div className="box fit h-full dfb align-center">
               {pass ? <Check size={13} /> : <X size={13} />}
            </div>
         </div>
      ))}
   </div>)
}

function SearchResultOverview ({ websiteScrapedInfo }: { websiteScrapedInfo: WebsiteScrapedInfo }) {
   return (<div className="web-int-card-full">
      <div className="box full dfb column gap-5">
         <div className="box full dfb align-center gap-10" style={{ color: "#0f766e" }}>
            <div className="box fit h-full dfb align-center"><Globe size={15} /></div>
            <div className="text-t full">{new URL(websiteScrapedInfo.url).hostname}</div>
         </div>
         <div className="text-xs full pd-05 bold-500" style={{ color: "#1a0dab" }}>{websiteScrapedInfo.title}</div>
         <div className="text-t full grey-5">{websiteScrapedInfo.metaDescription}</div>
      </div>
   </div>)
}

function SocialMediaPresence ({ websiteScrapedInfo, audit }: { audit: ProperWebsiteAudit, websiteScrapedInfo: WebsiteScrapedInfo }) {
   const socialPlatforms = [
      { key: "facebook", label: "Facebook", Icon: FacebookIcon, color: "#1877F2", background: "#E7F3FF" },
      { key: "instagram", label: "Instagram", Icon: InstagramIcon, color: "#E4405F", background: "#FDECF1" },
      { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon, color: "#0A66C2", background: "#EAF4FE" },
      { key: "twitter", label: "X", Icon: TwitterIcon, color: "#111827", background: "#F3F4F6" },
      { key: "youtube", label: "YouTube", Icon: YoutubeIcon, color: "#FF0000", background: "#FFEAEA" },
      { key: "tiktok", label: "TikTok", Icon: TiktokIcon, color: "#111827", background: "#F3F4F6" },
   ]

   return (<div className="box full dfb wrap gap-10">
      {socialPlatforms.map(sp => (websiteScrapedInfo as any).socialLinks[sp.key]).filter(l => l !== "").length > 0 ? (<>
         {socialPlatforms
            .filter(s => (
               (audit as any).socialPresence[s.key] && (websiteScrapedInfo as any).socialLinks[s.key]
            ))
            .map((socialPlatform, index) => {
            const { background, color } = socialPlatform;
            const href = (websiteScrapedInfo as any).socialLinks[socialPlatform.key];
            return (
               <Link key={index} className="box fit social-media-link-display" href={href} target="_blank" style={{ background, color }}>
                  <div className="box full dfb align-center gap-10">
                     <div className="box fit h-full dfb align-center"><socialPlatform.Icon size={15} /></div>
                     <div className="text-t full">{socialPlatform.label}</div>
                  </div>
               </Link>
            )
         })}
      </>) : (<>
         <div className="text-xxxs grey-5 full">No Social Media Presence</div>
      </>)}
   </div>)
}

function CallToActions ({ websiteScrapedInfo }: { websiteScrapedInfo: WebsiteScrapedInfo }) {
   if (websiteScrapedInfo.cta.exists) {
      return <div className="box full dfb wrap gap-10">
         {websiteScrapedInfo.cta.text.map((text, index) => (
            <div className="cta-tag-pill text-xxxs bold-600" key={index}>{text}</div>
         ))}
      </div>
   } else {
      return <div className="text-xxxs grey-5 full">No CTA</div>
   }
}

function ContactInfos ({ websiteScrapedInfo }: { websiteScrapedInfo: WebsiteScrapedInfo }) {
   if ((websiteScrapedInfo.phoneNumbers.length + websiteScrapedInfo.emails.length) > 0) {
      return (<div className="box full dfb column gap-10">
         {websiteScrapedInfo.emails.map((email, index) => (
            <div key={index} className="box full dfb align-center gap-10">
               <div className="box fit h-full dfb align-center">
                  <Mail size={15} /> 
               </div>
               <div className="text-xxxs full">{email}</div>
            </div>
         ))}
         {websiteScrapedInfo.phoneNumbers.map((phoneNumber, index) => (
            <div key={index} className="box full dfb align-center gap-10">
               <div className="box fit h-full dfb align-center">
                  <Phone size={15} /> 
               </div>
               <div className="text-xxxs full">{phoneNumber}</div>
            </div>
         ))}
      </div>)
   } else {
      return <div className="text-xxxs grey-5 full">No Contact Information Found</div>
   }
}

function StrengthsAndWeaknesses ({ audit }: { audit: ProperWebsiteAudit }) {
   if ((audit.strengths.length + audit.weaknesses.length) > 0) {
      return (<div className="box full dfb wrap gap-20">
         <div className="box fit dfb column gap-5" style={{ minWidth: "300px" }}>
            <div className="text-s full bold-600 dfb align-center gap-5 mb-05" style={{ color: "#00962d" }}>
               <BicepsFlexed size={15} /> Strengths
            </div>
            {audit.strengths.map((strength, index) => (
               <div key={index} className="box full dfb align-center gap-10">
                  <div className="box fit h-full dfb align-center">
                     <Check size={15} color="#006e21" />
                  </div>
                  <div className="text-xxxs full grey-5 bold-500">{strength}</div>
               </div>
            ))}
         </div>
         <div className="box fit dfb column gap-5" style={{ minWidth: "300px" }}>
            <div className="text-s full bold-600 dfb align-center gap-5 mb-05" style={{ color: "#cf0000" }}>
               <TriangleAlert size={15} /> Weaknesses
            </div>
            {audit.weaknesses.map((weakness, index) => (
               <div key={index} className="box full dfb align-center gap-10">
                  <div className="box fit h-full dfb align-center">
                     <X size={15} color="#a30000" />
                  </div>
                  <div className="text-xxxs full grey-5 bold-500">{weakness}</div>
               </div>
            ))}
         </div>
      </div>)
   } else {
      return <div className="text-xxs grey-5 full error">No Strength or Weakness Found</div>
   }
}