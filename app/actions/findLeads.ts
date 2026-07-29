"use server"

type ScraperValue = {
   success: boolean;
   error: string | undefined;
   data: any[];
}

const scraperApiUrl = "https://minweb-lead-scraper-api.onrender.com/scrape"

export async function thomsonLocalScraper (niche: string, location: string) {
   const url = `${scraperApiUrl}?location=${encodeURIComponent(location)}&niche=${encodeURIComponent(niche)}`;
   const response = await fetch(url);
   const data = await response.json();
   return data as ScraperValue;
}

export async function smallBusinessFinderScraper (niche: string, location: string) {
   const url = `${scraperApiUrl}-small?location=${encodeURIComponent(location)}&niche=${encodeURIComponent(niche)}`;
   const response = await fetch(url);
   const data = await response.json();
   return data as ScraperValue;
}