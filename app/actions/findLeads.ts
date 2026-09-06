"use server"

type ScraperValue = {
   success: boolean;
   error: string | undefined;
   data: any[];
}

const scraperApiUrl = "https://minweb-lead-scraper-api.onrender.com/scrape"

// DEVELOPMENT URL
// const scraperApiUrl = "http://localhost:3080/scrape"

export async function thomsonLocalScraper (niche: string, location: string) {
   const url = `${scraperApiUrl}?location=${encodeURIComponent(location)}&niche=${encodeURIComponent(niche)}`;
   const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ niche, location }),
      headers: {
         "Content-type": "Application/json"
      }
   });
   const data = await response.json();
   console.log(data);
   return data as ScraperValue;
}

export async function smallBusinessFinderScraper (niche: string, location: string) {
   const url = `${scraperApiUrl}-small?location=${encodeURIComponent(location)}&niche=${encodeURIComponent(niche)}`;
   const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ niche, location }),
      headers: {
         "Content-type": "Application/json"
      }
   });
   const data = await response.json();
   return data as ScraperValue;
}