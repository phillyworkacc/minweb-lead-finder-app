import { toast } from "sonner";

export function copyToClipboard(text: string) {
   try {
      if (navigator.clipboard && window.isSecureContext) {
         navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
      } else {
         // Fallback for iOS/Safari
         fallbackCopy(text);
      }
      toast("Copied")
   } catch (err) {}
}

function fallbackCopy(text: string) {
   const textarea = document.createElement('textarea');
   textarea.value = text;

   // Prevent scrolling to bottom on iOS
   textarea.style.position = 'fixed';
   textarea.style.top = '0';
   textarea.style.left = '0';
   textarea.style.opacity = '0';

   document.body.appendChild(textarea);
   textarea.focus();
   textarea.select();

   try {
      document.execCommand('copy');
   } catch (err) {
      console.warn('Fallback: Copy failed', err);
   }

   document.body.removeChild(textarea);
}

export function titleCase (str: string): string {
   if (str.replaceAll("_"," ").includes(" ")) {
      return str.replaceAll("_"," ").split(" ").map(strBreak => titleCase(strBreak)).join(" ");
   }
   return `${str[0].toUpperCase()}${str.substring(1).toLowerCase()}`;
}

export function pluralSuffixer (word: string, determiner: number, suffix?: string) {
   if (determiner == 1) {
      return word;
   } else {
      return `${word}${suffix || 's'}`
   }
}