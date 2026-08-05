"use server"

export async function getWebsiteMetadata (url: string): Promise<{ websiteTitle: string, icon: string; } | null> {
   try {
      const baseUrl = new URL(url).origin;
      const res = await fetch(baseUrl);
      const html = await res.text();
      
      const matchTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const websiteTitle = matchTitle ? matchTitle[1].trim() : url.replaceAll("/","").replace(":","").replace("https","").replace("http","").trim();

      // Extract all link tags
      const links = [...html.matchAll(/<link[^>]+>/gi)]
         .map(m => m[0])
         .join("\n");

      // Try common icon rel values
      const iconRels = [
         'icon',
         'shortcut icon',
         'apple-touch-icon',
         'apple-touch-icon-precomposed',
         'mask-icon'
      ];

      for (const rel of iconRels) {
         const regex = new RegExp(
            `<link[^>]+rel=["']?${rel}["']?[^>]*href=["']([^"']+)["']`,
            "i"
         );
         const match = links.match(regex);
         if (match) {
            const href = match[1];
            return {
               websiteTitle,
               icon: href.startsWith("http")
                  ? href
                  : new URL(href, baseUrl).href
            }
         }
      }

      // Fallback
      return {
         websiteTitle,
         icon: `${baseUrl}/favicon.ico`
      };
   } catch (e) {
      return null;
   }
}

export async function useMinwebAiApi (prompt: string) {
   try {
      // const url = "http://192.168.0.104:3080/use-ai"; // testing url
      const url = "https://lead-validating-pipeline.onrender.com/use-ai";
      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "mw-api-key-lv": process.env.MINWEB_LV_API_KEY!
         },
         body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data;
   } catch (err) {
      return false;
   }
}