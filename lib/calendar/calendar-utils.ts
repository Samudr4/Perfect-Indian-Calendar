/**
 * Pure Calendar and Date Utilities for Perfect Calendar.
 * Designed to be timezone-independent using date-only ISO strings (YYYY-MM-DD).
 */

/**
 * Returns today's ISO date string (YYYY-MM-DD) based on the current system/local time.
 */
export function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const PROTOTYPE_TODAY_ISO = getTodayIso();

export type CalendarViewType = "month" | "week" | "day" | "year";

import { getDaySummary, EntryCategory } from "./entry-resolver";
export type { EntryCategory };

export interface CalendarDayInfo {
  isoDate: string; // YYYY-MM-DD
  year: number;
  month: number; // 1 - 12
  day: number; // 1 - 31
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  isCurrentMonth: boolean;
  isToday: boolean;
  hasContent: boolean;
  contentCount?: number;
  categories: EntryCategory[];
  isHoliday: boolean;
  holidayTitle?: string;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const WEEKDAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const WEEKDAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns number of days in a month (1-indexed month: 1 = Jan, 12 = Dec).
 */
export function getDaysInMonth(year: number, month: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

/**
 * Format year, month, day into ISO "YYYY-MM-DD" string.
 */
export function formatIsoDate(year: number, month: number, day: number): string {
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * Parse an ISO date string "YYYY-MM-DD" into numeric parts.
 */
export function parseIsoDate(isoDate: string): { year: number; month: number; day: number } {
  const [y, m, d] = isoDate.split("-").map(Number);
  return { year: y, month: m, day: d };
}

/**
 * Calculates day of the week (0 = Sunday, 6 = Saturday) for an ISO date.
 */
export function getDayOfWeek(year: number, month: number, day: number): number {
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return utcDate.getUTCDay();
}

/**
 * Shift an ISO date by a number of days (+ or -) without timezone offset bugs.
 */
export function shiftIsoDate(isoDate: string, daysDelta: number): string {
  const { year, month, day } = parseIsoDate(isoDate);
  const utc = new Date(Date.UTC(year, month - 1, day + daysDelta));
  return formatIsoDate(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate());
}

export function getPreviousDay(isoDate: string): string {
  return shiftIsoDate(isoDate, -1);
}

export function getNextDay(isoDate: string): string {
  return shiftIsoDate(isoDate, 1);
}

export function getPreviousWeekDate(isoDate: string): string {
  return shiftIsoDate(isoDate, -7);
}

export function getNextWeekDate(isoDate: string): string {
  return shiftIsoDate(isoDate, 7);
}

/**
 * Generates the full 7-column month grid array, including preceding and trailing days.
 */
export function getMonthGrid(
  year: number,
  month: number,
  todayIso: string = getTodayIso(),
  geographyId: string = "assam"
): CalendarDayInfo[] {
  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayWeekday = getDayOfWeek(year, month, 1); // 0 (Sun) to 6 (Sat)

  const days: CalendarDayInfo[] = [];

  // Previous month padding
  const prevMonthInfo = getPreviousMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(prevMonthInfo.year, prevMonthInfo.month);

  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const isoDate = formatIsoDate(prevMonthInfo.year, prevMonthInfo.month, d);
    const dayOfWeek = getDayOfWeek(prevMonthInfo.year, prevMonthInfo.month, d);
    const summary = getDaySummary(isoDate, geographyId);
    days.push({
      isoDate,
      year: prevMonthInfo.year,
      month: prevMonthInfo.month,
      day: d,
      dayOfWeek,
      isCurrentMonth: false,
      isToday: isoDate === todayIso,
      hasContent: summary.count > 0,
      contentCount: summary.count,
      categories: summary.categories,
      isHoliday: summary.isHoliday,
      holidayTitle: summary.holidayTitle,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const isoDate = formatIsoDate(year, month, d);
    const dayOfWeek = getDayOfWeek(year, month, d);
    const summary = getDaySummary(isoDate, geographyId);
    days.push({
      isoDate,
      year,
      month,
      day: d,
      dayOfWeek,
      isCurrentMonth: true,
      isToday: isoDate === todayIso,
      hasContent: summary.count > 0,
      contentCount: summary.count,
      categories: summary.categories,
      isHoliday: summary.isHoliday,
      holidayTitle: summary.holidayTitle,
    });
  }

  // Next month padding to complete 35 or 42 grid slots
  const remainingSlots = (7 - (days.length % 7)) % 7;
  const nextMonthInfo = getNextMonth(year, month);

  for (let d = 1; d <= remainingSlots; d++) {
    const isoDate = formatIsoDate(nextMonthInfo.year, nextMonthInfo.month, d);
    const dayOfWeek = getDayOfWeek(nextMonthInfo.year, nextMonthInfo.month, d);
    const summary = getDaySummary(isoDate, geographyId);
    days.push({
      isoDate,
      year: nextMonthInfo.year,
      month: nextMonthInfo.month,
      day: d,
      dayOfWeek,
      isCurrentMonth: false,
      isToday: isoDate === todayIso,
      hasContent: summary.count > 0,
      contentCount: summary.count,
      categories: summary.categories,
      isHoliday: summary.isHoliday,
      holidayTitle: summary.holidayTitle,
    });
  }

  return days;
}

/**
 * Generates the 7 days of the week containing the given ISO date.
 */
export function getWeekDays(
  isoDate: string,
  todayIso: string = getTodayIso(),
  geographyId: string = "assam"
): CalendarDayInfo[] {
  const { year, month, day } = parseIsoDate(isoDate);
  const dow = getDayOfWeek(year, month, day); // 0 (Sun) - 6 (Sat)
  const sundayIso = shiftIsoDate(isoDate, -dow);

  const days: CalendarDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const currentIso = shiftIsoDate(sundayIso, i);
    const parts = parseIsoDate(currentIso);
    const summary = getDaySummary(currentIso, geographyId);
    days.push({
      isoDate: currentIso,
      year: parts.year,
      month: parts.month,
      day: parts.day,
      dayOfWeek: i,
      isCurrentMonth: parts.month === month,
      isToday: currentIso === todayIso,
      hasContent: summary.count > 0,
      contentCount: summary.count,
      categories: summary.categories,
      isHoliday: summary.isHoliday,
      holidayTitle: summary.holidayTitle,
    });
  }
  return days;
}

export function formatWeekRange(weekDays: CalendarDayInfo[]): string {
  if (weekDays.length === 0) return "";
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  const firstMonth = MONTH_NAMES_SHORT[first.month - 1];
  const lastMonth = MONTH_NAMES_SHORT[last.month - 1];

  if (first.month === last.month) {
    return `${first.day} – ${last.day} ${firstMonth} ${first.year}`;
  }
  if (first.year === last.year) {
    return `${first.day} ${firstMonth} – ${last.day} ${lastMonth} ${first.year}`;
  }
  return `${first.day} ${firstMonth} ${first.year} – ${last.day} ${lastMonth} ${last.year}`;
}

export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
}

export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
}

/**
 * Format an ISO date into editorial headline format:
 * "Tuesday, 8 September 2026"
 */
export function formatEditorialDate(isoDate: string): string {
  const { year, month, day } = parseIsoDate(isoDate);
  const weekdayIndex = getDayOfWeek(year, month, day);
  const weekdayName = WEEKDAY_NAMES_FULL[weekdayIndex];
  const monthName = MONTH_NAMES[month - 1];
  return `${weekdayName}, ${day} ${monthName} ${year}`;
}

/**
 * Format a short month + year label: "September 2026"
 */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month - 1]} ${year}`;
}
