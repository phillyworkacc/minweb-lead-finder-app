"use server"
import { dalDbOperation } from "@/dal/helpers"
import { db } from "@/db";
import { foldersTable, leadCollectionsTable } from "@/db/schemas";

export async function getFolders () {
   const folders = await dalDbOperation(async () => {
      const res = await db.select().from(foldersTable);
      return res;
   });

   if (folders.success) {
      return folders.data
   } else return [];
}

export async function getLeadLists () {
   const leadLists = await dalDbOperation(async () => {
      const res = await db.select().from(leadCollectionsTable);
      return res;
   });

   if (leadLists.success) {
      return leadLists.data
   } else return [];
}

export async function createFolder (folderName: string) {
   const created = await dalDbOperation(async () => {
      const folderId = folderName.toLowerCase().replaceAll(" ", "-");
      const res = await db.insert(foldersTable).values({ folderId, name: folderName });
      return (res.rowCount === 1);
   })
   return created.success;
}
