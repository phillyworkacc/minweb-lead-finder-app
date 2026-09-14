const API_URL = "https://api.company-information.service.gov.uk";

function normalizeCompanyName(name: String) {
   return String(name ?? "").toLowerCase().replace(/\b(limited|ltd|plc|llp)\b/g, "").replace(/[^a-z0-9]/g, "").trim();
}

function extractPostcode(address: String) {
   if (!address) return null;

   const match = address.match(/\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i);
   return match ? match[0].replace(/\s+/g, "").toUpperCase() : null;
}

function chooseBestCompany(items: any[], businessName: string, address: string) {
   if (!items?.length) return null;

   const expected = normalizeCompanyName(businessName);
   const postcode = extractPostcode(address);

   const ranked = items.map((company) => {
      let score = 0;
      const candidate = normalizeCompanyName(company.title);

      if (candidate === expected) {
         score += 100;
      } else if (candidate.includes(expected) || expected.includes(candidate)) {
         score += 50;
      }

      if (postcode && company.address_snippet?.replace(/\s+/g, "").toUpperCase().includes(postcode)) {
         score += 80;
      }

      if (company.company_status === "active") score += 5;

      return { company, score };
   });

   ranked.sort((a, b) => b.score - a.score);

   /*
    * Deliberately conservative.
    * Do not flag a company dissolved
    * because a vaguely similar business
    * name appeared.
    */
   if (ranked[0].score < 50) return null;

   return ranked[0];
}

export async function checkCompaniesHouse(businessName: string, address: string) {
   const apiKey = process.env.COMPANIES_HOUSE_API_KEY;

   if (!apiKey) {
      return {
         found: null,
         status: "api_key_missing",
      };
   }

   if (!businessName) {
      return {
         found: null,
         status: "no_business_name",
      };
   }

   try {
      const auth = Buffer.from(`${apiKey}:`).toString("base64");
      const query = new URLSearchParams({ q: businessName, items_per_page: "10" });

      const response = await fetch(`${API_URL}/search/companies?${query}`, {
         headers: { Authorization: `Basic ${auth}` },
         signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
         return {
            found: null,
            status: "api_error",
            httpStatus: response.status,
         };
      }

      const data = await response.json();
      const best = chooseBestCompany(data.items, businessName, address);

      if (!best) {
         return {
            found: false,
            status: "not_found",
         };
      }

      const company = best.company;

      return {
         found: true,
         matchConfidence: best.score,
         companyName: company.title,
         companyNumber: company.company_number,
         companyStatus: company.company_status,
         companyType: company.company_type,
         address: company.address_snippet,
         dateOfCreation: company.date_of_creation,
         dissolved: company.company_status === "dissolved",
         active: company.company_status === "active",
      };
   } catch (error: any) {
      return {
         found: null,
         status: "unknown",
         error: error.message,
      };
   }
}