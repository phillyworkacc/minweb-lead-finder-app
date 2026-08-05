/* ============================================================
   LEAD OUTREACH MESSAGE GENERATOR
   ------------------------------------------------------------
   Turns your website audit + lead score + offer scores into a
   short, human, tightly personalized outreach message.

   Works with any LLM API (Claude, GPT, Gemini, Llama, whatever
   you're running). Call buildOutreachPrompt(...) to get back a
   single prompt string, send that string to your model, then
   run the raw text through parseOutreachResponse() to get
   clean, validated JSON back every time.
   ============================================================ */


/* ---------- 1. CONFIG YOU CAN TWEAK ---------- */

// Which audit fields actually matter for each offer.
// Stops the model from grabbing a random, irrelevant stat.
const OFFER_SIGNAL_MAP = {
   "5-Star Google Reviews": ["googleReviews", "hasGoogleMapsEmbedded", "strengths", "weaknesses"],
   "Missed Call Text Back": ["hasContactInfo", "hasCTA", "hasContactForm"],
   "Social media management": ["socialPresence"],
   "SEO": ["hasMetaDescription", "hasTitle", "missingAltImages", "websiteScore", "speed"],
   "Website maintenance": ["speed", "ssl", "websiteScore", "mobileFriendly"],
   "Website redesign": ["websiteScore", "hasCTA", "mobileFriendly", "weaknesses"]
};

// Rotated per call so leads don't all get the same shaped message.
const OPENER_ANGLES = [
   "curiosity",
   "straight to the point",
   "compliment first",
   "friendly local business tone",
   "quick observation",
   "low pressure favor",
   "missed opportunity"
];

const TONE_BY_PRIORITY = {
   High: "confident and warm, a little more direct, this business is showing real buying signals",
   Medium: "friendly, curious, zero pressure",
   Low: "light and easygoing, just planting a seed, no pitch energy at all"
};

// Words that instantly make a text read as AI or corporate. Banned.
const BANNED_WORDS = [
   "unlock", "leverage", "seamless", "elevate", "game changer", "solutions",
   "in today's digital age", "synergy", "cutting edge", "revolutionize",
   "take your business to the next level", "we guarantee", "guaranteed results",
   "circle back", "reach out", "touch base"
];


/* ---------- 2. SMALL HELPERS ---------- */

function pickRandom(list: any[], avoid: any[] = []) {
   const pool = list.filter((item: any) => !avoid.includes(item));
   const source = pool.length ? pool : list;
   return source[Math.floor(Math.random() * source.length)];
}

// Deterministic ranking done in code, not left to the model to calculate.
function rankOffers(leadOffers: LeadOffers) {
   const sorted = [...leadOffers].sort((a, b) => b.score - a.score);
   const top = sorted[0];
   const second = sorted[1];
   const closeSecond = top && second ? (top.score - second.score) <= 10 : false;
   return { sorted, top, second, closeSecond };
}


/* ---------- 3. THE PROMPT BUILDER ---------- */
type BuildOutreachPromptParams = {
   sender: { firstName: string; agencyName: string; },
   business: {
      name: string;
      industry: string;
      city: string;
      ownerFirstName: string;
   },
   websiteAudit: ProperWebsiteAudit,           
   leadScore: LeadScore,
   leadOffers: LeadOffers,
   channel: "sms" | "email",
   recentOpeners: never[],
   includeOptOutLine: boolean
}

type AiPromptResult = {
   channel: "sms" | "email";
   subject?: string;
   message: string;
   primaryOffer: string;
   secondaryOffer: string;
   openerAngle: string;
   personalizationHook: string;
   characterCount: number;
}

export function buildOutreachPrompt({
   sender, business, websiteAudit, leadScore,
   leadOffers, channel, recentOpeners = [], includeOptOutLine = false
}: BuildOutreachPromptParams) {
   if (!business || !websiteAudit || !leadScore || !leadOffers) {
      throw new Error("business, websiteAudit, leadScore and leadOffers are all required.");
   }

   const { top, second, closeSecond } = rankOffers(leadOffers);
   const angle = pickRandom(OPENER_ANGLES, recentOpeners);
   const tone = TONE_BY_PRIORITY[leadScore.priority] || TONE_BY_PRIORITY.Medium;
   const relevantSignals = OFFER_SIGNAL_MAP[top.offer] || [];

   const schema = `{
   "channel": "sms" or "email",
   "subject": string or null,
   "message": string,
   "primaryOffer": string,
   "secondaryOffer": string or null,
   "openerAngle": string,
   "personalizationHook": string,
   "characterCount": number
}`;

   return `
You are an elite local business growth consultant and direct response copywriter. You personally look at small business websites and send the owner a short, human note about one thing you noticed and one way you could help. You have sent thousands of these. Business owners can tell in one second if a message is from a real person or a robot, and you never sound like a robot.

WHO IS SENDING THIS
${JSON.stringify(sender, null, 2)}
If a first name is provided above, you may sign off with it naturally. Never invent a name that was not given to you.

THE BUSINESS YOU ARE WRITING TO
${JSON.stringify(business, null, 2)}
If ownerFirstName is present, use it once, naturally, early in the message. If it is not present, keep the greeting general and do not invent a name.

WHAT YOUR AGENCY OFFERS
Website build and redesign, missed call text back, five star Google review generation, social media management, SEO, and website maintenance.

WEBSITE AUDIT RESULTS
${JSON.stringify(websiteAudit, null, 2)}
Only reference something that is explicitly confirmed true or false above. Never invent or assume a detail that is not present in this data.

LEAD SCORE, INTERNAL USE ONLY, NEVER MENTION THIS TO THE LEAD
${JSON.stringify(leadScore, null, 2)}

OFFER FIT, ALREADY RANKED FOR YOU
Lead the message with: ${top.offer}
${closeSecond ? `A second offer is close behind and may be woven in naturally if it fits in a single sentence: ${second.offer}. Do not force it.` : "Stick to this one offer only. Do not mention any other service."}

MOST RELEVANT AUDIT DETAILS FOR THIS OFFER
Draw your one personalization detail from these fields if they are present in the audit above: ${relevantSignals.join(", ")}. Translate whatever you find into plain English a non technical business owner would understand. Never say technical terms like meta description, alt text, or SSL certificate out loud, describe what the problem actually means for their business instead.

YOUR ASSIGNMENT FOR THIS SPECIFIC MESSAGE
Tone to use: ${tone}
Opener angle to use: ${angle}
Do not open the message the same way as any of these previous openers: ${recentOpeners.length ? recentOpeners.join(" | ") : "none yet, this is the first message for this angle rotation"}

HARD RULES, FOLLOW ALL OF THEM
1. Never use a hyphen, en dash, or em dash anywhere in the message. If a sentence seems to need one, rewrite the sentence instead.
2. Sound like a real person texting from their phone. Contractions are good. Never use any of these words or phrases: ${BANNED_WORDS.join(", ")}.
3. Reference exactly one specific, real detail from the audit data. Make the benefit to their business obvious, such as more calls answered or more customers finding them, without promising a specific number or outcome.
4. Do not mention the lead score, the priority label, or that this business was scored or audited by software. It should read like a person personally looked at their site today.
5. Never guarantee results, rankings, timelines, or specific numbers.
6. End with exactly one soft, low pressure call to action, phrased like a question, never a hard sell, never more than one ask.
7. Keep it tight. If channel is sms, use two to four short sentences, under 320 characters total, no emojis. If channel is email, use a subject line under 45 characters and a body under 500 characters across no more than three short paragraphs, no emojis.
8. ${includeOptOutLine && channel === "sms" ? 'Add a brief opt out line at the very end, separate in tone from the rest, such as "Text stop to opt out."' : "No opt out line is needed for this message."}
9. Your entire response must be the JSON object and nothing else. No markdown, no code fences, no preamble like "here is the message", no explanation after it. The first character of your response must be { and the last character must be }.

RESPONSE SCHEMA, MATCH IT EXACTLY
${schema}

EXAMPLE OF THE RIGHT TONE, DIFFERENT BUSINESS, FOR REFERENCE ONLY, DO NOT REUSE THIS WORDING
{
  "channel": "sms",
  "subject": null,
  "message": "Hey James, I was looking at your site earlier and noticed there's no way to message you directly, just a phone number listed. That probably costs you a few jobs a week from people who'd rather text than call. I fix this exact thing for shops like yours. Want me to show you what it'd look like on your site?",
  "primaryOffer": "Missed Call Text Back",
  "secondaryOffer": null,
  "openerAngle": "quick observation",
  "personalizationHook": "no contact form or text option, phone number only",
  "characterCount": 301
}

EXAMPLE OF WHAT TO AVOID, TOO CORPORATE, TOO GENERIC, CONTAINS A DASH, READS LIKE AI
"Hi there! In today's digital age, having a strong online presence is essential - we noticed your website could use some improvements. Our solutions can help elevate your business. Let's schedule a call!"

Now write one message for the real business and audit data above. Return JSON only, matching the schema, nothing else.
`.trim();
}


/* ---------- 4. VALIDATE AND PARSE WHAT THE MODEL SENDS BACK ---------- */
export function parseOutreachResponse(rawText: string) {
   const cleaned = rawText.trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/, "")
      .trim();

   let parsed;
   try {
      parsed = JSON.parse(cleaned);
   } catch (err: any) {
      throw new Error("Model did not return valid JSON: " + err.message);
   }

   const required = ["channel", "message", "primaryOffer", "openerAngle"];
   for (const field of required) {
      if (!(field in parsed)) {
         throw new Error(`Missing required field in response: ${field}`);
      }
   }
   return parsed;
}

// Catches the two things this prompt cares most about, dashes and length,
// so you can auto retry a generation instead of sending a bad message.
export function validateOutreach(result: AiPromptResult, channel: AiPromptResult["channel"]) {
   const limits = { sms: 320, email: 500 };
   const limit = limits[channel] || 320;
   const message = result.message || "";
   const length = message.length;
   const dashPattern = /[-\u2010\u2011\u2012\u2013\u2014]/;

   return {
      valid: length <= limit && !dashPattern.test(message),
      length,
      limit,
      withinLength: length <= limit,
      containsDash: dashPattern.test(message)
   };
}


// const outreachPrompt = buildOutreachPrompt({
//          sender: { firstName: "Philip", agencyName: "Minweb Agency" },
//          business: {
//             name: websiteScrapedInfo.title,
//             industry: nextLeadSearch.niche,
//             city: nextLeadSearch.location,
//             ownerFirstName: ""
//          },
//          websiteAudit: audit,
//          leadScore,
//          leadOffers: offersForLead,
//          channel: "sms",
//          recentOpeners: []
//       });