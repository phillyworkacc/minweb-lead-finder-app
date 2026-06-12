export function calculateAuditScore (audit: WebsiteAudit) {
   let totalScore = 0;
   const scoreBreakdown = [];

   // 1. Load Speed Scoring
   const loadTime = parseFloat(
      audit.auditPoints.find(p => p.issue.includes("Homepage Loads"))?.issue.match(/([\d.]+)s/)![1]!
   );
   if (loadTime < 3) {
      totalScore += 2;
      scoreBreakdown.push({ category: "Load Speed", score: 2, comment: "Fast" });
   } else if (loadTime < 5) {
      totalScore += 1;
      scoreBreakdown.push({ category: "Load Speed", score: 1, comment: "Moderate" });
   } else {
      scoreBreakdown.push({ category: "Load Speed", score: 0, comment: "Slow" });
   }

   // 2. CTA
   const ctaDetail = audit.auditPoints.find(p => p.issue.includes("CTA"))?.detail!;
   if (ctaDetail.includes("detected")) {
      totalScore += 2;
      scoreBreakdown.push({ category: "CTA", score: 2, comment: "Present" });
   } else if (ctaDetail.includes("Missing")) {
      scoreBreakdown.push({ category: "CTA", score: 0, comment: "Missing" });
   } else {
      totalScore += 1;
      scoreBreakdown.push({ category: "CTA", score: 1, comment: "Weak" });
   }

   // 3. Mobile Usability
   const mobileDetail = audit.auditPoints.find(p => p.issue.includes("Mobile Usability"))?.detail!;
   if (mobileDetail.includes("tap link")) {
      totalScore += 2;
      scoreBreakdown.push({ category: "Mobile Usability", score: 2, comment: "Clickable phone link" });
   } else if (mobileDetail.includes("hard to tap")) {
      scoreBreakdown.push({ category: "Mobile Usability", score: 0, comment: "Not mobile-friendly" });
   } else {
      totalScore += 1;
      scoreBreakdown.push({ category: "Mobile Usability", score: 1, comment: "Average" });
   }

   // 4. Google Maps
   const mapsDetail = audit.auditPoints.find(p => p.issue.includes("Google Maps"))?.detail!;
   if (mapsDetail.includes("detected")) {
      totalScore += 2;
      scoreBreakdown.push({ category: "Google Maps", score: 2, comment: "Embedded" });
   } else {
      scoreBreakdown.push({ category: "Google Maps", score: 0, comment: "Missing" });
   }

   // 5. Schema
   const schemaDetail = audit.auditPoints.find(p => p.issue.includes("Schema"))?.detail!;
   if (schemaDetail.includes("detected")) {
      totalScore += 2;
      scoreBreakdown.push({ category: "Schema Markup", score: 2, comment: "Present" });
   } else if (schemaDetail.includes("hurts local SEO")) {
      scoreBreakdown.push({ category: "Schema Markup", score: 0, comment: "Missing" });
   } else {
      totalScore += 1;
      scoreBreakdown.push({ category: "Schema Markup", score: 1, comment: "Partial" });
   }

   // Final verdict
   let verdict = "";
   let verdictColor = "";
   if (totalScore >= 10) {
      verdict = "Your website is in great shape. Minor tweaks can make it elite.";
      verdictColor = "#22cc00";
   } else if (totalScore >= 6) {
      verdict = "Your website is okay but definitely has room to improve.";
      verdictColor = "#e08700";
   } else {
      verdict = "Your site is underperforming. You're likely missing out on leads and visibility.";
      verdictColor = "#b30000";
   }

   return {
      totalScore,
      outOf: 12,
      scoreBreakdown,
      verdict,
      verdictColor
   };
}