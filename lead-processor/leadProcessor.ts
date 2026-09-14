import { normalizeLead } from "./utils/normalize";
import { checkDNS } from "./services/dns";
import { checkWebsite } from "./services/website";
import { auditWebsite } from "./services/auditWebsite";
import { checkCompaniesHouse } from "./services/companiesHouse";

function bucketLead({ lead, dns, website, companiesHouse, score }: { lead: any, dns: any, website: any, companiesHouse: any, score: number }) {
   if (companiesHouse?.dissolved) {
      return {
         bucket: "inactive_business",
         priority: 0,
         reason: "Company appears dissolved",
      };
   }

   if (!lead.normalizedWebsite) {
      return {
         bucket: "no_website",
         priority: 100,
         reason: "No website",
      };
   }

   if (dns?.resolves === false) {
      return {
         bucket: "website_dead",
         priority: 95,
         reason: "Domain does not resolve",
      };
   }

   if (website?.parked) {
      return {
         bucket: "parked_domain",
         priority: 95,
         reason: "Domain appears parked",
      };
   }

   if (website?.live === false) {
      return {
         bucket: "website_broken",
         priority: 90,
         reason: "Website is not responding correctly",
      };
   }

   const scoreValue = Number(score);

   if (Number.isFinite(scoreValue)) {
      if (scoreValue <= 50) {
         return {
            bucket: "redesign_candidate",
            priority: 85,
            reason: `Low website score: ${scoreValue}`,
         };
      }

      if (scoreValue >= 80) {
         return {
            bucket: "good_website",
            priority: 10,
            reason: `Strong website score: ${scoreValue}`,
         };
      }

      return {
         bucket: "review",
         priority: 50,
         reason: `Website score: ${scoreValue}`,
      };
   }

   return {
      bucket: "manual_review",
      priority: 50,
      reason: "No score available",
   };
}

export async function processLead (originalLead: Lead | AutomatedLead) {
   const lead = await normalizeLead(originalLead);
   const [
      companiesHouse,
      websiteAudit
   ] = await Promise.all([
      checkCompaniesHouse(lead.name,lead.address),
      auditWebsite(lead.website),
   ]);

   let dns = null;
   let website: any = null;
   let score: number | null = null;

   const domain = lead.normalizedWebsite?.domain;
   if (domain) {
      dns = await checkDNS(domain);
      /*
      * null means DNS check failed/unknown.
      * We can still try the website.
      */
      if (dns.resolves === true || dns.resolves === null) {
         website = await checkWebsite(lead.normalizedWebsite);
      }
   }

   // const companiesHouse = await companiesHousePromise;
   const shouldScore = website?.live === true && website?.parked !== true && companiesHouse?.dissolved !== true;
   if (shouldScore) {
      score = websiteAudit ? websiteAudit.audit.websiteScore : 0
   }

   const classification = bucketLead({ lead, dns, website, companiesHouse, score: score! });
   return {
      ...originalLead,
      normalizedPhone: lead.normalizedPhone?.number ?? null,
      phoneValid: lead.normalizedPhone?.valid ?? false,
      normalizedWebsite: lead.normalizedWebsite?.url ?? null,
      domain,
      dns,
      websiteScore: websiteAudit?.audit?.score ?? null,
      companiesHouse,
      websiteAudit: websiteAudit.audit || website,
      scoring: score,
      ...classification,
      processedAt: new Date().toISOString(),
   };
}