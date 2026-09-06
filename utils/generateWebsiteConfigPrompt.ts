export function generateWebsiteConfigPrompt (lead: AutomatedLead) {
   return `
Business research/copywriting assistant. Research the business below online, then output ONLY a single valid JSON object matching the schema at the bottom. Same inputs must always produce the same output: no random variation, no invented facts, no creative deviation from the rules below.
 
BUSINESS INFO:
\`\`\`text
Name: ${lead.name}
Address: ${lead.address}
Email: ${lead.email}
PhoneNumber: ${lead.phoneNumber}
Website: ${lead.website}
\`\`\`
 
RESEARCH: website, Google Business Profile, Google Maps/reviews, Facebook, Instagram, Yell, Checkatrade, TrustATrader, Houzz, LinkedIn. First party sources (site/socials) win for services and projects. Google Business Profile wins for hours and location. Cross reference sources and favour the most recent, most authoritative one when they conflict.
 
NEVER INVENT: emails, opening hours, social URLs, accreditations, years established, review counts/ratings, guarantees, insurance status, awards, employee or customer names, locations, completed projects, image URLs. If something cannot be verified, use the specified fallback ("" / [] / "Contact For Availability") and never a plausible sounding guess. Marketing copy may only be built around verified facts.
 
ALWAYS "": minwebBusinessId, businessPlaceId, googleMapEmbedUrl. Never researched, never filled in.
 
LOGO: always return logo as an empty string "". It is injected separately by the calling application, never sourced from research.
 
PHONE: use the supplied Twilio number if given, else the verified main business number, formatted as +44... for UK numbers.
 
BRANDING: derive colours and font from the logo, website, vehicles, uniforms and social graphics. Favour existing brand colours; modernise only if the branding is poor or inconsistent. Use valid hex colours. accentColor must equal styling.accentColor exactly, character for character. Choose one Google Font name that fits the trade, based on evidence, not at random.
 
COPY: British English, specific to this business, no lorem ipsum, no unsupported superlatives (best, leading, unbeatable, number one, etc unless evidenced). NO DASHES of any kind (hyphen, en dash, em dash) in customer facing text, for example write "high quality" not "high-quality" and "no obligation" not "no-obligation". Slugs, URLs, phone numbers and hex codes are exempt from this rule only.
 
LENGTHS: description 50 to 100 words. hero.headline 4 to 10 words, hero.description 30 to 70 words. aboutUs: exactly 3 paragraphs, no more, no fewer (1: who/what the business is, 2: experience/capability/approach, 3: service area and why to make contact). services: one object per genuinely distinct service, id as a lowercase url friendly slug, shortDescription 10 to 20 words, description 40 to 90 words, images as an array. servicesDescriptionCopy 15 to 35 words. projects: 3 to 8 real evidenced projects, description 40 to 100 words each; use fewer than 3 if that is all the evidence supports; never invent one to fill the array. reviews: 3 to 6 genuine reviews, name as given publicly or "Verified Customer" if hidden, lightly cleaned but not reworded in meaning, else an empty array. openingTimes: verified hours in "9am to 5pm" style for all 7 days, OR "Contact For Availability" for all 7 days; never a mix of verified and guessed days. socialMedia: only confirmed profile URLs, else an empty array.
 
IMAGES: only real, public, verifiable URLs sourced from the business's own website, socials or Google Business Profile. Never invented, guessed, stock, or belonging to another business. An empty array or empty string is always better than an unverified image. Applies to hero.backgroundImage, every service and project images array, landingPageImages (up to 6), and galleryImages (6 to 20 where available).
 
HEADER: header.links, header.linksStyle, header.cta and header.desktopNavStyle are fixed and must be reproduced exactly as shown in the schema below for every business, with no additions, removals, reordering or renamed labels, regardless of the nature of the business. Only header.background and header.color may be adjusted to match brand colours.
 
quoteCta must be exactly "Get A Free Quote" if the business explicitly advertises free quotations, otherwise exactly "Get A Quote". No other value is valid.
 
chatBot.position and chatBot.ctaMessageTimeout are fixed as shown in the schema. Only tailor chatBot.ctaMessage and chatBot.inbox, and keep them free of dashes.
 
footer.style is fixed as shown in the schema.
 
OUTPUT FORMAT RULES:
- Output ONLY the JSON object. No markdown code fences, no backticks, no leading or trailing prose, no comments, no trailing commas.
- All object keys and all string values must use double quotes, exactly as valid JSON requires.
- Numbers (like ctaMessageTimeout) must be unquoted numeric literals.
- The object must be directly parseable by JSON.parse with no modification.
- Follow the exact key order shown in the schema below.
- Arrays for services, projects, reviews and socialMedia show one example item only, to demonstrate shape. Populate each with the real verified count of items, or an empty array if none can be verified.
 
SCHEMA (structure, key order and fixed values to reproduce exactly where marked FIXED):
 
{
  "styling": {
    "accentColor": "#000000",
    "secondaryColor": "#000000",
    "background": "#ffffff",
    "foreground": "#000000",
    "fontFamily": "Raleway",
    "footer": { "background": "#000000", "color": "#ffffff" }
  },
  "logo": "",
  "accentColor": "#000000",
  "quoteCta": "Get A Quote",
  "minwebBusinessId": "",
  "name": "",
  "email": "",
  "phoneNumber": "",
  "address": "",
  "businessPlaceId": "",
  "googleMapEmbedUrl": "",
  "description": "",
  "header": {
    "background": "#fff",
    "color": "#000000",
    "linksStyle": "title-case",
    "cta": "phone",
    "desktopNavStyle": "right",
    "links": [
      { "href": "/", "label": "Home" },
      { "href": "/services", "label": "Services" },
      { "href": "/gallery", "label": "Gallery" },
      { "href": "/projects", "label": "Projects" },
      { "href": "/reviews", "label": "Testimonials" },
      { "href": "/review-us", "label": "Review Us" },
      { "href": "/contact", "label": "Contact Us" }
    ]
  },
  "hero": { "headline": "", "subHeading": "", "description": "", "backgroundImage": "" },
  "formColors": { "background": "#ffffff", "color": "#000000" },
  "aboutUs": ["", "", ""],
  "servicesDescriptionCopy": "",
  "services": [ { "id": "", "name": "", "shortDescription": "", "description": "", "images": [] } ],
  "projects": [ { "id": "", "name": "", "description": "", "images": [] } ],
  "openingTimes": {
    "Sunday": "", "Monday": "", "Tuesday": "", "Wednesday": "",
    "Thursday": "", "Friday": "", "Saturday": ""
  },
  "landingPageImages": [],
  "galleryImages": [],
  "chatBot": { "position": "right", "ctaMessage": "", "ctaMessageTimeout": 10000, "inbox": "" },
  "reviews": [ { "name": "", "review": "" } ],
  "footer": { "style": "footer-2" },
  "socialMedia": [ { "platform": "", "label": "", "link": "" } ]
}
 
Before returning, silently verify: the JSON parses cleanly; no dashes anywhere in customer facing copy; no invented facts or images; header.links is character for character identical to the schema; aboutUs has exactly 3 entries; accentColor equals styling.accentColor; key order matches the schema; running this exact prompt again on the same business information and the same research findings would produce an identical result.
 
Return only the JSON object now.`;
}