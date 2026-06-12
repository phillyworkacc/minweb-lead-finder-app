export function convertToMilliseconds(
  date: string,
  hour: number,
  minutes: number,
  timePeriod: 'am' | 'pm'
): number {
  // Parse date string (YYYY-MM-DD)
  const [yearStr, monthStr, dayStr] = date.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-based
  const day = parseInt(dayStr, 10);

  // Convert hour to 24-hour format
  let adjustedHour = hour;
  if (timePeriod === 'pm' && hour < 12) adjustedHour += 12;
  if (timePeriod === 'am' && hour === 12) adjustedHour = 0;

  // Create the Date object
  const dateObj = new Date(year, month, day, adjustedHour, minutes);

  // Return time in milliseconds
  return dateObj.getTime();
}

export function formatMilliseconds(ms: number, withoutTime?: boolean, shortHandMonth?: boolean): string {
  const date = new Date(ms);

  const day = date.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const timePeriod = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedMinutes = minutes.toString().padStart(2, '0');

  return withoutTime
    ? `${day} ${shortHandMonth ? month.substring(0,3) : month} ${year}`
    : `${day} ${shortHandMonth ? month.substring(0,3) : month} ${year}, ${hours}:${formattedMinutes} ${timePeriod}`
}
