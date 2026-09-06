import { allFonts } from "@/utils/fontsSelection"

export function getOptionsForSelect (type: string): { option: any, optionName: string }[] {
   if (type == "select-links-style") {
      return [
         { option: "Upper case", optionName: "upper-case" },
         { option: "Title case", optionName: "title-case" }
      ]
   } else if (type == "select-desktop-nav-style") {
      return [
         { option: "Left", optionName: "left" },
         { option: "Center", optionName: "center" },
         { option: "Right", optionName: "right" }
      ]
   } else if (type == "select-cta-type") {
      return [
         { option: "Phone", optionName: "phone" },
         { option: "Quote", optionName: "quote" }
      ]
   } else if (type == "select-font") {
      return allFonts.map(font => ({ option: font, optionName: font }));
   } else if (type == "select-footer-style") {
      return [
         { optionName: "footer-1", option: "Footer 1" },
         { optionName: "footer-2", option: "Footer 2" }
      ];
   }
   return []
}