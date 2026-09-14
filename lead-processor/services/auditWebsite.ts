export async function auditWebsite (websiteUrl: string) {
   try {
      const url = "https://lead-validating-pipeline.onrender.com/website-auditor";
      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-type": "application/json",
            "mw-api-key-lv": process.env.MINWEB_LV_API_KEY!
         },
         body: JSON.stringify({ url: websiteUrl, facebookUrl: "" })
      });
      const result = await response.json();

      if (result.success) {
         return result.data;
      } else {
         console.log(result.error);
         return false;
      }
   } catch (err) {
      console.error(err);
      return false;
   }
}