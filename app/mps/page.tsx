import { dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { mpsListingsTable } from "@/db/schemas";
import { desc } from "drizzle-orm";
import { sanitise } from "@/utils/extras";
import MPSClientPage from "./MPSClientPage";
import AppContainer from "@/components/AppContainer/AppContainer";

export const dynamic = "force-dynamic";

export default async function page() {
   const listings = await dalDbOperation(async () => {
      const results = await db.select().from(mpsListingsTable).orderBy(desc(mpsListingsTable.listingId));
      return results;
   })

   if (listings.success) {
      return <MPSClientPage listings={sanitise(listings.data)} />
   } else {
      return <AppContainer>
         <div className="text-xs full pd-1">Failed to get listings from MPS</div>
      </AppContainer>
   }
}
