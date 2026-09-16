import fs from "fs"


export function mpsCookies (): string {
   const cookiesObject = JSON.parse(fs.readFileSync("./cookies/mps.json", "utf8"));
   const cookiesToData = cookiesObject.map((co: any) => (`${co.name}=${encodeURIComponent(co.value)};`))
   return cookiesToData.join("");
}