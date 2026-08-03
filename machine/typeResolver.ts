
export function websiteScrapedInfoResolver (stringJSON: string) {
   return JSON.parse(stringJSON) as WebsiteScrapedInfo;
}

export function websiteAuditResolver (stringJSON: string) {
   return JSON.parse(stringJSON) as WebsiteAudit;
}

export function leadScoreResolver (stringJSON: string) {
   return JSON.parse(stringJSON) as LeadScore;
}

export function leadOffersResolver (stringJSON: string) {
   return JSON.parse(stringJSON) as LeadOffers;
}