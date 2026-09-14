"use server"
import { parsePhoneNumberFromString } from "libphonenumber-js";
import crypto from "node:crypto";

export async function normalizePhone(phone: string, defaultCountry = "GB") {
   if (!phone) {
      return {
         raw: "",
         valid: false,
         number: null,
      };
   }

   try {
      const parsed = parsePhoneNumberFromString(String(phone).trim(), defaultCountry as any);

      if (!parsed) {
         return {
            raw: phone,
            valid: false,
            number: null,
         };
      }

      return {
         raw: phone,
         valid: parsed.isValid(),
         number: parsed.number,
         nationalNumber: parsed.nationalNumber,
         country: parsed.country ?? null,
      };
   } catch {
      return {
         raw: phone,
         valid: false,
         number: null,
      };
   }
}

export async function normalizeWebsite(website: string) {
   if (!website) return null;

   let value = String(website).trim();

   if (!value) return null;
   if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

   try {
      const url = new URL(value);
      url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");

      return {
         url: url.toString(),
         domain: url.hostname,
      };
   } catch {
      return null;
   }
}

export async function createLeadKey(lead: any) {
   const data = [
      lead.name ?? "",
      lead.website ?? "",
      lead.phone ?? "",
      lead.address ?? "",
   ].join("|").toLowerCase().trim();

   return crypto.createHash("sha256").update(data).digest("hex");
}

export async function normalizeLead(lead: any) {
   const website = normalizeWebsite(lead.website);
   const phone = normalizePhone(lead.phone);

   return {
      ...lead,
      name: lead.name?.trim() ?? "",
      address: lead.address?.trim() ?? "",
      normalizedPhone: phone,
      normalizedWebsite: website,
   };
}