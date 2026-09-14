"use server"
import dns from "node:dns/promises";

export async function checkDNS(domain: string) {
   if (!domain) {
      return {
         resolves: false,
         status: "no_domain",
      };
   }

   try {
      const result = await dns.lookup(domain);

      return {
         resolves: true,
         status: "resolved",
         address: result.address,
         family: result.family,
      };
   } catch (error: any) {
      if (error.code === "ENOTFOUND" || error.code === "ENODATA") {
         return {
            resolves: false,
            status: "not_found",
         };
      }

      return {
         resolves: null,
         status: "unknown",
         error: error.message,
      };
   }
}