export function sanitise (object: any) {
   return JSON.parse(JSON.stringify(object));
} 