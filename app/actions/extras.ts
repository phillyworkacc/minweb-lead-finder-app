"use server"
import Groq from "groq-sdk";

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
      const groq = new Groq();
      const chatCompletion = await groq.chat.completions.create({
         messages: [
            {
               role: "system",
               content: "You generate short, human sounding cold outreach messages. Follow the user's instructions exactly and return valid JSON only."
            },
            {
               role: "user",
               content: prompt
            }
         ],
         model: "openai/gpt-oss-120b",
         temperature: 0.4,
         top_p: 1,
         max_completion_tokens: 2048,
         stream: false,
         reasoning_effort: "medium"
      });
      if (chatCompletion.choices[0].message.content == "") {
         return await useMinwebAiApi(prompt);
      }
      return chatCompletion.choices[0].message.content;
   } catch (err) {
      console.error(err)
      return false;
   }
}