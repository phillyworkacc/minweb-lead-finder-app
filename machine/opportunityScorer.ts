type Audit = {
   websiteScore?: number;
   socialPresence?: {
      facebook?: boolean;
      instagram?: boolean;
      linkedin?: boolean;
      tiktok?: boolean;
   };
};

type Offer = {
    offer: string;
};

const WEIGHTS = {
   // Website
   NO_WEBSITE: 25,
   WEBSITE_VERY_POOR: 25,   // <30
   WEBSITE_POOR: 20,        // <50
   WEBSITE_AVERAGE: 10,     // <70
   // Reviews
   LOW_REVIEWS: 15,         // <10
   SOME_REVIEWS: 8,         // <30
   // Socials
   NO_SOCIALS: 10,
   ONE_SOCIAL: 5,
   // Contactability
   HAS_EMAIL: 10,
   // AI Opportunity
   WEBSITE_BUILD: 20
};

export function calculateOpportunityScore(leads: AutomatedLead[]) {
   if (!leads.length) {
      return {
         opportunityScore: 0,
         averageLeadScore: 0,
         totalEmails: 0,
         totalWebsiteBuilds: 0,
         totalNoWebsite: 0
      };
   }

   let totalScore = 0;
   let totalEmails = 0;
   let totalWebsiteBuilds = 0;
   let totalNoWebsite = 0;

   for (const lead of leads) {
      let score = 0;
      let audit: Audit = {};
      let offers: Offer[] = [];

      try {
         audit = JSON.parse(lead.audit || "{}");
      } catch {}

      try {
         offers = JSON.parse(lead.offersForLead || "[]");
      } catch {}

      // ----------------------------
      // No website
      // ----------------------------

      if (!lead.website?.trim()) {
         score += WEIGHTS.NO_WEBSITE;
         totalNoWebsite++;
      }

      // ----------------------------
      // Website Quality
      // ----------------------------

      if (typeof audit.websiteScore === "number") {
         if (audit.websiteScore < 30) {
            score += WEIGHTS.WEBSITE_VERY_POOR;
         } else if (audit.websiteScore < 50) {
            score += WEIGHTS.WEBSITE_POOR;
         } else if (audit.websiteScore < 70) {
            score += WEIGHTS.WEBSITE_AVERAGE;
         }
      }

      // ----------------------------
      // Social Media
      // ----------------------------

      const socials = audit.socialPresence;
      if (socials) {
         const activeSocials =
            Number(!!socials.facebook) +
            Number(!!socials.instagram) +
            Number(!!socials.linkedin) +
            Number(!!socials.tiktok);

         if (activeSocials === 0) {
            score += WEIGHTS.NO_SOCIALS;
         } else if (activeSocials === 1) {
            score += WEIGHTS.ONE_SOCIAL;
         }
      }

      // ----------------------------
      // Email Found
      // ----------------------------
      if (lead.email?.trim()) {
         score += WEIGHTS.HAS_EMAIL;
         totalEmails++;
      }

      // ----------------------------
      // AI Offer Recommendation
      // ----------------------------
      const websiteOffer = offers.some(o => o.offer.toLowerCase().includes("website"));

      if (websiteOffer) {
         score += WEIGHTS.WEBSITE_BUILD;
         totalWebsiteBuilds++;
      }

      score = Math.min(score, 100);
      totalScore += score;
   }

   return {
      opportunityScore: Math.round(totalScore / leads.length),
      averageLeadScore: Math.round(totalScore / leads.length),
      totalEmails,
      totalWebsiteBuilds,
      totalNoWebsite
   };
}