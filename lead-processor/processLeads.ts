"use server"
import pLimit from "p-limit";
import { processLead } from "./leadProcessor"

/*
* Cache only exists while this function is running.
*
* If two leads have the same website:
*
* abcplumbing.co.uk
* abcplumbing.co.uk
*
* we don't check the website twice.
*/

const domainCache = new Map();

export async function processLeads(leads: Lead[] | AutomatedLead[], { concurrency = 10 } = {}) {
   if (!Array.isArray(leads)) {
      throw new TypeError("processLeads expects an array of lead objects");
   }

   const limit = pLimit(concurrency);
   let completed = 0;

   const jobs = leads.map((lead) => limit(async () => {
      try {
         // Optional domain cache.
         let domain = null;
         if (lead.website) {
            try {
               let website = lead.website.trim();
               if (!/^https?:\/\//i.test(website)) website = `https://${website}`;
               
               domain = new URL(website).hostname.toLowerCase().replace(/^www\./, "");
            } catch {}
         }

         // If we've already processed this exact domain during this run, we can reuse website-related data.
         if (domain && domainCache.has(domain)) {
            const cached = domainCache.get(domain);
            completed++;

            return {
               ...lead,
               ...cached,
               name: lead.name ?? cached.name,
               phone: lead.phoneNumber,
               address: lead.address,
               fromCache: true,
            };
         }

         const result = await processLead(lead);
         if (domain) domainCache.set(domain, result);
         completed++;

         console.log(`[${completed}/${leads.length}]`, lead.name ?? "Unknown", "→", result.bucket);
         return { ...result, fromCache: false };
      } catch (error: any) {
         completed++;
         console.error(`[${completed}/${leads.length}]`, lead.name ?? "Unknown", "→ Failed:", error.message);

         /*
         * One broken lead does not stop
         * the other leads.
         */
         return {
            ...lead,
            bucket: "processing_error",
            priority: 0,
            error: error.message,
            processedAt: new Date().toISOString(),
            fromCache: false,
         };
      }
   }));

   const results = await Promise.all(jobs);
   return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}