"use client"
import "./RecommendedOffers.css"
import { Layout, PhoneMissed, Search, Share2, Star, Wrench } from "lucide-react";
import Spacing from "../Spacing/Spacing";

type RecommendedOffersProps = {
   leadOffers: LeadOffers;
}

const offerIcons: Record<Offer["offer"], React.ReactNode> = {
  "Website redesign": <Layout size={16} />,
  "Website maintenance": <Wrench size={16} />,
  SEO: <Search size={16} />,
  "Social media management": <Share2 size={16} />,
  "5-Star Google Reviews": <Star size={16} />,
  "Missed Call Text Back": <PhoneMissed size={16} />,
};

const offerMetadata: Record<Offer["offer"], { short: string; blurb: string }> = {
   "Website redesign": {
      short: "Redesign",
      blurb: "The site's foundation is holding the business back.",
   },
   "Website maintenance": {
      short: "Maintenance",
      blurb: "The site works, but upkeep is falling behind.",
   },
   SEO: {
      short: "SEO",
      blurb: "Findability in search is the growth bottleneck.",
   },
   "Social media management": {
      short: "Social",
      blurb: "Social channels are inactive or underused.",
   },
   "5-Star Google Reviews": {
      short: "Reviews",
      blurb: "Review volume or rating is limiting local trust.",
   },
   "Missed Call Text Back": {
      short: "Call Back",
      blurb: "Inbound calls are likely going unanswered.",
   },
};

export default function RecommendedOffers ({ leadOffers }: RecommendedOffersProps) {
   return (<>
      <div className="text-sm full bold-700 mb-15">Recommended Offers</div>
      {leadOffers.length > 0 ? (<>
         <BestMatch leadOffers={leadOffers} />
         <Spacing size={1} />
      </>) : (<></>)}

      <div className="text-xs full bold-700 mb-1">All Offers</div>
      <ListAllOfferPoints leadOffers={leadOffers} />
   </>)
}

function BestMatch ({ leadOffers }: { leadOffers: LeadOffers }) {
   if (leadOffers.length > 0) {
      const sortedLeadOffers = leadOffers.sort((a,b) => b.score - a.score)
      const bestOffer = sortedLeadOffers[0];
      const runnerUp = sortedLeadOffers[1];

      return (<div className="rec-off-best-match-card">
         <div className="box full dfb align-center bold-600 gap-5">
            <div className="box fit h-full dfb align-center"><Star size={15} /></div>
            <div className="text-xt full dfb align-center bold-600 gap-5">BEST MATCH</div>
         </div>
         <div className="box full dfb align-center gap-10">
            <div className="rec-off-best-match-icon">{offerIcons[bestOffer.offer]}</div>
            <div className="box full dfb column" style={{ gap: "2px" }}>
               <div className="text-xxxs full bold-600 grey-5">{bestOffer.offer}</div>
               <div className="text-xt full">{offerMetadata[bestOffer.offer].blurb}</div>
            </div>
            <div className="text-sm fit bold-500">{bestOffer.score}</div>
         </div>
         {runnerUp ? (<>
            <div className="box full pd-05">
               <div className="dashed-divider-line" />
            </div>
            <div className="text-t full bold-500">
               +{bestOffer.score-runnerUp.score} pts ahead of {runnerUp.offer}
            </div>
         </>) : (<></>)}
      </div>)
   }
}

function ListAllOfferPoints ({ leadOffers }: { leadOffers: LeadOffers }) {
   if (leadOffers.length > 0) {
      return (<div className="box full dfb column gap-10">
         {leadOffers.map((leadOffer, index) => {
            const icon = offerIcons[leadOffer.offer]
            return <div key={index} className="box full dfb align-center gap-15">
               <div className="text-t fit bold-600 grey-5">{index+1}</div>
               {icon}
               <div className="text-t grey-5 bold-600 fit">{leadOffer.offer} ({leadOffer.score})</div>
            </div>
         })}
      </div>)
   } else {
      return <div className="text-xxs grey-5 full error">No offers for this lead</div>
   }
}
