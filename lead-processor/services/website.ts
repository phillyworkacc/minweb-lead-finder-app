"use server"
import * as cheerio from "cheerio";
import { retry } from "../utils/retry";

const PARKED_SIGNATURES = [
   "domain for sale",
   "this domain is for sale",
   "buy this domain",
   "parked free",
   "godaddy.com/forsale",
   "sedoparking",
   "parkingcrew",
   "afternic",
   "hugedomains",
   "domain parking",
];

const PLACEHOLDER_SIGNATURES = [
   "lorem ipsum",
   "your company name",
   "your business name",
   "your text here",
   "coming soon",
   "website under construction",
   "insert text here",
];

const MAX_BODY_SIZE = 1_500_000;

async function readLimitedBody(response: any) {
   if (!response.body) return "";

   const reader = response.body.getReader();
   const decoder = new TextDecoder();

   let body = "";
   let bytes = 0;

   while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      bytes += value.byteLength;

      if (bytes > MAX_BODY_SIZE) {
         await reader.cancel();
         break;
      }

      body += decoder.decode(value, { stream: true });
   }

   return body;
}

async function fetchWithRedirectLimit(startingUrl: string, {
   timeout = 8000,
   maxRedirects = 5,
} = {}) {
   let url = startingUrl;
   const start = performance.now();

   for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
      const controller = new AbortController();
      const timer = setTimeout(() => { controller.abort() }, timeout);

      try {
         const response = await fetch(url, {
            redirect: "manual",
            signal: controller.signal,
            headers: {
               "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                  "AppleWebKit/537.36 (KHTML, like Gecko) " +
                  "Chrome/152.0.0.0 Safari/537.36",
               Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
               "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            }
         });

         clearTimeout(timer);

         if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get("location");
            if (!location) {
               return {
                  response,
                  finalUrl: url,
                  redirects: redirectCount,
               };
            }
            url = new URL(location, url).toString();
            continue;
         }

         return {
            response,
            finalUrl: url,
            redirects: redirectCount,
            loadTimeMs: Math.round(
               performance.now() - start
            ),
         };
      } catch (error) {
         clearTimeout(timer);
         throw error;
      }
   }

   throw new Error(`Too many redirects: ${startingUrl}`);
}

async function requestWebsite(url: string) {
   return retry(
      async () => {
         const result = await fetchWithRedirectLimit(url);

         if (result.response.status === 408 || result.response.status === 429 || result.response.status >= 500) {
            const error: any = new Error(`HTTP ${result.response.status}`);
            error.status = result.response.status;
            throw error;
         }

         return result;
      }, {
         retries: 2,
         delay: 500,
         shouldRetry(error: any) {
            if (!error.status) return true;
            return (error.status === 408 || error.status === 429 || error.status >= 500);
         },
      }
   );
}

function detectParked(html: string) {
   const text = html.toLowerCase();
   return PARKED_SIGNATURES.some((signature) => text.includes(signature));
}

function detectPlaceholders(html: string) {
   const text = html.toLowerCase();
   return PLACEHOLDER_SIGNATURES.filter((signature) => text.includes(signature));
}

function detectBuilder(html: string) {
   const text = html.toLowerCase();
   if (text.includes("wix.com")) return "wix";
   if (text.includes("squarespace")) return "squarespace";
   if (text.includes("weebly")) return "weebly";
   if (text.includes("wp-content") || text.includes("wordpress")) return "wordpress";
   if (text.includes("webflow")) return "webflow";
   return null;
}

function findCopyrightYear(html: string) {
   const regex = /(?:copyright|©|\(c\))\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi;
   const matches = [ ...html.matchAll(regex) ];
   const years = matches.map(match => Number(match[1])).filter((year) =>
      year > 1990 && year <= new Date().getFullYear() + 1
   );
   if (!years.length) return null;
   return Math.max(...years);
}

function analyseHTML(html: string) {
   const $ = cheerio.load(html);
   const viewport = $('meta[name="viewport"]').attr("content");
   const title = $("title").first().text().trim();
   const description = $('meta[name="description"]').attr("content")?.trim();
   const forms = $("form").length;
   const phoneLinks = $('a[href^="tel:"]').length;
   const emailLinks = $('a[href^="mailto:"]').length;
   const images = $("img").length;

   const imagesMissingAlt = $("img").filter((_: any, element: any) => {
      const alt = $(element).attr("alt");
      return !alt?.trim();
   }).length;

   return {
      title: title || null,
      metaDescription: description || null,
      hasViewport: Boolean(viewport),
      hasForm: forms > 0,
      forms,
      hasPhoneLink: phoneLinks > 0,
      hasEmailLink: emailLinks > 0,
      images,
      imagesMissingAlt,
      placeholders: detectPlaceholders(html),
      builder: detectBuilder(html),
      copyrightYear: findCopyrightYear(html),
   };
}

export async function checkWebsite(normalizedWebsite: any) {
   if (!normalizedWebsite) {
      return {
         live: false,
         status: "no_website",
      };
   }

   const domain = normalizedWebsite.domain;
   const httpsUrl = `https://${domain}`;

   let result;
   let sslValid = true;

   try {
      result = await requestWebsite(httpsUrl);
   } catch (httpsError: any) {
      /*
      * Site may still work over HTTP.
      */
      try {
         result = await requestWebsite(`http://${domain}`);
         sslValid = false;
      } catch (httpError: any) {
         return {
            live: null,
            status: "request_failed",
            error: httpError.message ?? httpsError.message,
         };
      }
   }

   const response = result.response;
   const contentType = response.headers.get("content-type") ?? "";
   let html = "";
   if (contentType.includes("text/html")) {
      html = await readLimitedBody(response);
   }

   const parked = html ?detectParked(html) : false;
   const audit = html ? analyseHTML(html) : null;

   const currentYear = new Date().getFullYear();
   const staleCopyright = audit?.copyrightYear
      ? audit.copyrightYear < currentYear - 2
      : null;

   return {
      live: response.status >= 200 && response.status < 400,
      status: response.status,
      finalUrl: result.finalUrl,
      redirects: result.redirects,
      loadTimeMs: result.loadTimeMs,
      sslValid,
      parked,
      pageSize: Buffer.byteLength(html, "utf8"),
      contentType,
      ...audit,
      staleCopyright,
   };
}