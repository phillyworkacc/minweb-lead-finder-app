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
// Also banned: literal price words. We want the message to feel affordable
// and low risk, we just never want it to say so in these exact terms.
const LITERAL_PRICE_WORDS = ["cheap", "affordable", "budget friendly", "low cost", "inexpensive"];

const BANNED_WORDS = [
  "unlock", "leverage", "seamless", "elevate", "game changer", "solutions",
  "in today's digital age", "synergy", "cutting edge", "revolutionize",
  "take your business to the next level", "we guarantee", "guaranteed results",
  "circle back", "reach out", "touch base",
  ...LITERAL_PRICE_WORDS
];

// Any offer name that matches one of these is treated as a "new website"
// pitch rather than a maintenance or marketing pitch, which is what
// triggers the free preview incentive below.
const WEBSITE_OFFER_KEYWORDS = ["website redesign", "website build", "new website", "website design", "web design"];

function isWebsiteOffer(offerName = "") {
  const normalized = offerName.toLowerCase();
  return WEBSITE_OFFER_KEYWORDS.some(term => normalized.includes(term));
}


/* ---------- 2. SMALL HELPERS ---------- */

function pickRandom(list: any[], avoid: any[]) {
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

// Only fires when the top offer is a new website pitch. Tells the model to
// weave in the free preview, imply the price is realistic without naming a
// price word, and let genuine care for the business come through. All of it
// stated as direction, never as a script, so wording still varies message
// to message.
function buildWebsiteIncentiveBlock(offerName: string, hasFreeWebsitePreview: boolean) {
  if (!isWebsiteOffer(offerName)) return "";

  const previewLine = hasFreeWebsitePreview
    ? `You already have a free, no obligation preview of a new website built and sitting there ready for them to look at right now. Make this the centerpiece of the message. The core idea: it already exists, there is nothing to lose by looking at it, and if they like what they see, that is when things move forward. Never copy the wording of this instruction directly, say it in your own fresh words.`
    : `No free preview has been built for this lead yet. Do not mention one, do not imply one exists.`;

  return `

INCENTIVES TO WEAVE IN, THIS MESSAGE IS ABOUT A NEW WEBSITE
Work all of the following into the message naturally, in your own words each time, never as a checklist and never copied from the phrasing below:
1. ${previewLine}
2. Make it clear the price will not be a stretch for a business their size. Show this through how you frame it, never by stating a number and never by using the words ${LITERAL_PRICE_WORDS.join(", ")}.
3. Let a genuine, specific desire to see their business do better come through, the way it would if a real person looked at their actual site because they wanted to help, not because this business is one of a thousand leads getting the same message.
`;
}

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
   includeOptOutLine: boolean,
   hasFreeWebsitePreview: boolean
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


/* ---------- 3. THE PROMPT BUILDER ---------- */

export function buildOutreachPrompt({
   sender, business, websiteAudit, leadScore,
   leadOffers, channel, recentOpeners = [], includeOptOutLine = false, hasFreeWebsitePreview
}: BuildOutreachPromptParams) {

  if (!business || !websiteAudit || !leadScore || !leadOffers) {
    throw new Error("business, websiteAudit, leadScore and leadOffers are all required.");
  }

  const { top, second, closeSecond } = rankOffers(leadOffers);
  const angle = pickRandom(OPENER_ANGLES, recentOpeners);
  const tone = TONE_BY_PRIORITY[leadScore.priority] || TONE_BY_PRIORITY.Medium;
  const relevantSignals = OFFER_SIGNAL_MAP[top.offer] || [];
  const websiteIncentiveBlock = buildWebsiteIncentiveBlock(top.offer, hasFreeWebsitePreview);

  const websiteExample = isWebsiteOffer(top.offer) ? `

EXAMPLE FOR A WEBSITE OFFER WITH THE INCENTIVES ABOVE, FOR REFERENCE ONLY, DO NOT REUSE THIS WORDING
{
  "channel": "sms",
  "subject": null,
  "message": "Hey Sarah, I actually put together a quick new homepage for your shop already, just so you could see what it might look like. No cost and no obligation either way. I build these for small businesses specifically, so the price is never some big scary number. Want me to send over the link?",
  "primaryOffer": "Website redesign",
  "secondaryOffer": null,
  "openerAngle": "quick observation",
  "personalizationHook": "outdated homepage with no clear next step for visitors",
  "characterCount": 296
}` : "";

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
${websiteIncentiveBlock}
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
6. End with exactly one soft, low pressure call to action, phrased like a question, never a hard sell, never more than one ask. If an incentives section appears above, the call to action should naturally connect to it, for example offering to send over what already exists.
7. Keep it tight. If channel is sms, use two to four short sentences, under 320 characters total, no emojis. If channel is email, use a subject line under 45 characters and a body under 500 characters across no more than three short paragraphs, no emojis.
8. ${includeOptOutLine && channel === "sms" ? 'Add a brief opt out line at the very end, separate in tone from the rest, such as "Text stop to opt out."' : "No opt out line is needed for this message."}
9. If an incentives section appears above, you must work all of it into the message naturally, do not skip any part of it and do not paste its wording directly.
10. Your entire response must be the JSON object and nothing else. No markdown, no code fences, no preamble like "here is the message", no explanation after it. The first character of your response must be { and the last character must be }.

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
${websiteExample}

EXAMPLE OF WHAT TO AVOID, TOO CORPORATE, TOO GENERIC, CONTAINS A DASH, READS LIKE AI
"Hi there! In today's digital age, having a strong online presence is essential - we noticed your website could use some improvements. Our solutions can help elevate your business. Let's schedule a call!"

Now write one message for the real business and audit data above. Return JSON only, matching the schema, nothing else.
`.trim();
}


/* ---------- 4. VALIDATE AND PARSE WHAT THE MODEL SENDS BACK ---------- */

function parseOutreachResponse(rawText: any) {
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

// Catches the things this prompt cares most about, dashes, length, and
// literal price words slipping through, so you can auto retry a generation
// instead of sending a bad message.
export function validateOutreach(result: any, channel: "sms"|"email") {
  const limits = { sms: 320, email: 500 };
  const limit = limits[channel] || 320;
  const message = result.message || "";
  const length = message.length;
  const dashPattern = /[-\u2010\u2011\u2012\u2013\u2014]/;
  const lowerMessage = message.toLowerCase();
  const bannedPriceWordFound = LITERAL_PRICE_WORDS.find(word => lowerMessage.includes(word)) || null;

  return {
    valid: length <= limit && !dashPattern.test(message) && !bannedPriceWordFound,
    length,
    limit,
    withinLength: length <= limit,
    containsDash: dashPattern.test(message),
    bannedPriceWordFound
  };
}

/* ---------- 6. SEND IT TO WHICHEVER AI PLATFORM YOU'RE USING ---------- */
// Example with the Anthropic API. Swap the url, headers and model for
// OpenAI, Gemini, or whatever you're running, the prompt string itself
// does not change.

/*
const prompt = buildOutreachPrompt({ sender, business, websiteAudit, leadScore, leadOffers, channel: "sms" });

const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }]
  })
});

const data = await response.json();
const rawText = data.content[0].text;
const result = parseOutreachResponse(rawText);
const check = validateOutreach(result, "sms");

if (!check.valid) {
  // re-run buildOutreachPrompt and call the model again, or log it for review
  console.warn("Message failed validation:", check);
}

console.log(result);
*/


/* ---------- 7. EXPORTS, USE IN YOUR REAL PIPELINE LIKE THIS ---------- */
// const { buildOutreachPrompt, parseOutreachResponse, validateOutreach } = require("./lead-outreach-prompt-generator.js");
// const prompt = buildOutreachPrompt({ sender, business: lead.business, websiteAudit: lead.audit, leadScore: lead.score, leadOffers: lead.offers, channel: "sms", hasFreeWebsitePreview: lead.hasPreviewBuilt });
// ...send prompt to your model, then...
// const result = parseOutreachResponse(rawModelText);

// if (typeof module !== "undefined" && module.exports) {
//   module.exports = {
//     buildOutreachPrompt,
//     parseOutreachResponse,
//     validateOutreach,
//     rankOffers,
//     runDemo
//   };
// }