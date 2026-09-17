"use server"
import { mpsCookies } from "@/cookies/cookies";
import { sendNotificationToAll } from "./notifications";
import { pluralSuffixer } from "@/lib/str";
import { db } from "@/db";
import { mpsListingsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function checkMyPocketSkill () {
   try {
      const myPocketSkillListingsUrl = "https://www.mypocketskill.com/api/listings/quick-search-2/?offering=0&requesting=1&volunteering=0&remote=1&levels=1,2,3,4,5,6,7&ages=all&task_types=&listing_ids=&search_from_profile=0&distance=100&price_min=NaN&price_max=NaN&offset=0&sorted_by=MostRecent&term=&tags_term=&created_at=1";

      const apiCookie = mpsCookies();
   
      const response = await fetch(myPocketSkillListingsUrl, {
         method: "GET",
         headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36",
            "Cookie": apiCookie // paste your full cookie string here
         }
      });
   
      const data = await response.json();
      const listings = data.results.listings;
      console.log(`Total Listings Found: ${listings.length}`);
      
      const filteredListings = listings.filter((listing: any) => {
         const keyWords = ["social media", "instagram", "tiktok", "facebook", "website", "app", "web", "design", "logo", "social"];
         let exists = false;
         for (const keyword of keyWords) {
            if (listing.description.toLowerCase().includes(keyword)) {
               exists = true;
               break;
            }
         }
         return (exists && listing.remote == true)
      })
   
      const finalFilteredListings = filteredListings.map((listing: any) => ({
         listingId: listing.id,
         name: listing.profile.name,
         description: listing.description,
         createdAt: listing.createdDate
      }));
      const listingsToAdd: number[] = [];

      for (const listing of finalFilteredListings) {
         const [res] = await db.select().from(mpsListingsTable).where(eq(mpsListingsTable.listingId, listing.listingId));
         if (!res) listingsToAdd.push(listing.listingId);
      }

      const finalListings = finalFilteredListings.filter((l: any) => listingsToAdd.includes(l.listingId));

      if (finalListings.length > 0) {
         await sendNotificationToAll(
            `MPS Clients`,
            `Found ${listingsToAdd.length} new ${pluralSuffixer('lead',listingsToAdd.length,'s')} on MPS`,
            '/mps'
         );
         const inserted = await db.insert(mpsListingsTable).values(finalListings);
         return (inserted.rowCount > 0);
      } else {
         return true;
      }
   } catch (err) {
      console.error(err);
      return false;
   }
}