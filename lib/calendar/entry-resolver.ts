import { CalendarEntry, EventType } from "@/data/types";
import { PEOPLE } from "@/data/people";
import { HISTORICAL_EVENTS } from "@/data/events";
import { getSourceById } from "@/data/sources";
import { getGeographyById } from "@/data/geographies";
import { parseIsoDate, getTodayIso } from "./calendar-utils";

/**
 * Checks if a given entity matches the target geography filter.
 * If target geography is "all-india" or "india", all events and national figures are shown.
 * If target geography is a specific state (e.g. "punjab", "kerala", "maharashtra"),
 * only events and people belonging to that state are included.
 */
function matchesGeography(entityGeoIds: string[], targetGeoId: string): boolean {
  if (targetGeoId === "all-india" || targetGeoId === "india") return true;
  return entityGeoIds.includes(targetGeoId);
}

function calculateAnniversaryYears(originalYear: number, currentYear: number): string {
  const years = currentYear - originalYear;
  if (years <= 0) return "";
  const suffix =
    years % 10 === 1 && years % 100 !== 11
      ? "st"
      : years % 10 === 2 && years % 100 !== 12
      ? "nd"
      : years % 10 === 3 && years % 100 !== 13
      ? "rd"
      : "th";
  return `${years}${suffix}`;
}

/**
 * Resolves all calendar entries for a given ISO date (YYYY-MM-DD) and active geography.
 */
export function getEntriesForDate(
  isoDate: string,
  geographyId: string = "assam"
): CalendarEntry[] {
  const { year: currentYear, month, day } = parseIsoDate(isoDate);
  const mmDd = `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const entries: CalendarEntry[] = [];

  // 1. Check Births (Born)
  for (const person of PEOPLE) {
    if (!matchesGeography(person.geographyIds, geographyId)) continue;

    const personBirthMmDd = person.birthDate.slice(5); // YYYY-MM-DD -> MM-DD
    if (personBirthMmDd === mmDd) {
      const birthYear = parseInt(person.birthDate.slice(0, 4), 10);
      const anniv = calculateAnniversaryYears(birthYear, currentYear);
      const subtitle = anniv
        ? `Born ${person.birthDate.slice(0, 4)} · ${anniv} Birth Anniversary`
        : `Born ${person.birthDate.slice(0, 4)}`;

      entries.push({
        id: `born-${person.id}-${isoDate}`,
        date: isoDate,
        originalDate: person.birthDate,
        type: "birth-anniversary",
        category: "Born",
        title: person.name,
        nativeTitle: person.nativeName,
        subtitle,
        summary: person.shortBio,
        geographyIds: person.geographyIds,
        linkedPerson: person,
        sources: person.sourceIds.map((sid) => getSourceById(sid)).filter(Boolean) as any,
        importance: "major",
      });
    }

    // 2. Check Deaths (Remembered)
    if (person.deathDate) {
      const personDeathMmDd = person.deathDate.slice(5);
      if (personDeathMmDd === mmDd) {
        const deathYear = parseInt(person.deathDate.slice(0, 4), 10);
        const anniv = calculateAnniversaryYears(deathYear, currentYear);
        const subtitle = anniv
          ? `Passed in ${person.deathDate.slice(0, 4)} · ${anniv} Remembrance Anniversary`
          : `Passed in ${person.deathDate.slice(0, 4)}`;

        entries.push({
          id: `death-${person.id}-${isoDate}`,
          date: isoDate,
          originalDate: person.deathDate,
          type: "death-anniversary",
          category: "Remembered",
          title: person.name,
          nativeTitle: person.nativeName,
          subtitle,
          summary: person.shortBio,
          geographyIds: person.geographyIds,
          linkedPerson: person,
          sources: person.sourceIds.map((sid) => getSourceById(sid)).filter(Boolean) as any,
          importance: "major",
        });
      }
    }
  }

  // 3. Check Events (History & Culture)
  for (const event of HISTORICAL_EVENTS) {
    if (!matchesGeography(event.geographyIds, geographyId)) continue;

    let isMatch = false;
    let eventYear: number | undefined;

    if (event.isRecurringAnnual) {
      const eventMmDd = event.dateStart.length === 5 ? event.dateStart : event.dateStart.slice(5);
      if (eventMmDd === mmDd) {
        isMatch = true;
      }
    } else {
      const eventMmDd = event.dateStart.slice(5);
      if (event.dateStart === isoDate || eventMmDd === mmDd) {
        isMatch = true;
        eventYear = parseInt(event.dateStart.slice(0, 4), 10);
      }
    }

    if (isMatch) {
      const isOfficialHoliday = Boolean(event.isOfficialHoliday || event.type === "holiday");
      const category: CalendarEntry["category"] = isOfficialHoliday
        ? "Holiday"
        : event.type === "festival" || event.type === "cultural" || event.type === "literary"
        ? "Culture"
        : "History";

      let subtitle = "";
      if (isOfficialHoliday) {
        subtitle = "Official Gazetted Public Holiday";
      } else if (eventYear) {
        const anniv = calculateAnniversaryYears(eventYear, currentYear);
        subtitle = anniv
          ? `${eventYear} · ${anniv} Anniversary Milestone`
          : `Historic Milestone (${eventYear})`;
      } else if (event.location) {
        subtitle = event.location;
      }

      entries.push({
        id: `event-${event.id}-${isoDate}`,
        date: isoDate,
        originalDate: event.dateStart,
        type: event.type,
        category,
        title: event.title,
        nativeTitle: event.nativeTitle,
        subtitle,
        summary: event.summary,
        geographyIds: event.geographyIds,
        linkedEvent: event,
        sources: event.sourceIds.map((sid) => getSourceById(sid)).filter(Boolean) as any,
        importance: event.importance || "notable",
        isOfficialHoliday,
      });
    }
  }

  // Prioritize official holidays and major milestones
  entries.sort((a, b) => {
    const aHoliday = a.category === "Holiday" ? 10 : 0;
    const bHoliday = b.category === "Holiday" ? 10 : 0;
    const aMajor = a.importance === "major" ? 2 : 0;
    const bMajor = b.importance === "major" ? 2 : 0;
    return bHoliday + bMajor - (aHoliday + aMajor);
  });

  return entries;
}

export type EntryCategory = "Holiday" | "Born" | "Remembered" | "History" | "Culture";

export interface DayContentSummary {
  entries: CalendarEntry[];
  count: number;
  categories: EntryCategory[];
  isHoliday: boolean;
  holidayTitle?: string;
}

/**
 * Returns comprehensive content summary (categories, holiday flag, title, count) for a date.
 */
export function getDaySummary(
  isoDate: string,
  geographyId: string = "assam"
): DayContentSummary {
  const entries = getEntriesForDate(isoDate, geographyId);
  const count = entries.length;
  const catSet = new Set(entries.map((e) => e.category));
  const categories: EntryCategory[] = [];
  (["Holiday", "Born", "Remembered", "History", "Culture"] as const).forEach((cat) => {
    if (catSet.has(cat)) categories.push(cat);
  });
  const holidayEntry = entries.find((e) => e.category === "Holiday" || e.isOfficialHoliday);
  return {
    entries,
    count,
    categories,
    isHoliday: Boolean(holidayEntry),
    holidayTitle: holidayEntry?.title,
  };
}

/**
 * Returns whether any notable events/anniversaries exist for a given date.
 */
export function hasContentForDate(isoDate: string, geographyId: string = "assam"): boolean {
  return getEntriesForDate(isoDate, geographyId).length > 0;
}

/**
 * Returns the count of entries for a given date and geography.
 */
export function getContentCountForDate(isoDate: string, geographyId: string = "assam"): number {
  return getEntriesForDate(isoDate, geographyId).length;
}

/**
 * Finds the primary flagship date for a selected geography so the calendar can automatically
 * display that state's timeline and events when switched.
 */
export function getFlagshipDateForGeography(
  geographyId: string,
  currentYear: number = 2026
): string {
  const todayIso = getTodayIso();
  if (hasContentForDate(todayIso, geographyId)) {
    return todayIso;
  }

  // Look for dates with content in the current year
  const stateDates: { date: string; isMajor: boolean }[] = [];

  // Check all people associated with this state
  for (const person of PEOPLE) {
    if (matchesGeography(person.geographyIds, geographyId)) {
      const birthMmDd = person.birthDate.slice(5);
      stateDates.push({ date: `${currentYear}-${birthMmDd}`, isMajor: true });
      if (person.deathDate) {
        const deathMmDd = person.deathDate.slice(5);
        stateDates.push({ date: `${currentYear}-${deathMmDd}`, isMajor: false });
      }
    }
  }

  // Check all events associated with this state
  for (const event of HISTORICAL_EVENTS) {
    if (matchesGeography(event.geographyIds, geographyId)) {
      const mmDd = event.dateStart.length === 5 ? event.dateStart : event.dateStart.slice(5);
      stateDates.push({
        date: `${currentYear}-${mmDd}`,
        isMajor: event.importance === "major",
      });
    }
  }

  if (stateDates.length === 0) {
    return todayIso;
  }

  // If there is an entry in the current month (e.g. September), prefer it
  const currentMonthPrefix = todayIso.slice(0, 7);
  const currentMonthEntry = stateDates.find((d) => d.date.startsWith(currentMonthPrefix));
  if (currentMonthEntry) {
    return currentMonthEntry.date;
  }

  // Otherwise, find the next upcoming event from today
  const upcoming = stateDates.filter((d) => d.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date));
  if (upcoming.length > 0) {
    return upcoming[0].date;
  }

  // Fallback to first major date
  const major = stateDates.find((d) => d.isMajor);
  return major ? major.date : stateDates[0].date;
}

export interface StateMilestoneItem {
  id: string;
  isoDate: string;
  title: string;
  nativeTitle?: string;
  category: "History" | "Culture" | "Born" | "Remembered";
  monthDay: string; // e.g. "01-26"
  isMajor: boolean;
}

/**
 * Returns a deduplicated, chronologically ordered list of iconic milestones for a state.
 */
export function getStateMilestones(
  geographyId: string,
  currentYear: number = 2026
): StateMilestoneItem[] {
  const map = new Map<string, StateMilestoneItem>();

  // 1. Check Events
  for (const event of HISTORICAL_EVENTS) {
    if (matchesGeography(event.geographyIds, geographyId)) {
      const mmDd = event.dateStart.length === 5 ? event.dateStart : event.dateStart.slice(5);
      const isoDate = `${currentYear}-${mmDd}`;
      const category =
        event.type === "festival" || event.type === "cultural" || event.type === "literary"
          ? "Culture"
          : "History";

      if (!map.has(isoDate) || event.importance === "major") {
        map.set(isoDate, {
          id: `ms-event-${event.id}`,
          isoDate,
          title: event.title,
          nativeTitle: event.nativeTitle,
          category,
          monthDay: mmDd,
          isMajor: event.importance === "major",
        });
      }
    }
  }

  // 2. Check People
  for (const person of PEOPLE) {
    if (matchesGeography(person.geographyIds, geographyId)) {
      const birthMmDd = person.birthDate.slice(5);
      const isoDate = `${currentYear}-${birthMmDd}`;
      if (!map.has(isoDate)) {
        map.set(isoDate, {
          id: `ms-person-${person.id}`,
          isoDate,
          title: `${person.name} Jayanti`,
          nativeTitle: person.nativeName,
          category: "Born",
          monthDay: birthMmDd,
          isMajor: true,
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.monthDay.localeCompare(b.monthDay));
}

export interface SearchResultItem {
  id: string;
  title: string;
  nativeTitle?: string;
  kind: "Person" | "Historical Event" | "Festival";
  targetIsoDate: string; // ISO date to jump to
  summary: string;
  geography: string;
}

/**
 * Searches across all historical people and events by text query.
 */
export function searchCalendarRecords(
  query: string,
  geographyId: string = "assam",
  currentYear: number = 2026
): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  // Search People
  for (const person of PEOPLE) {
    if (!matchesGeography(person.geographyIds, geographyId)) continue;

    const matches =
      person.name.toLowerCase().includes(q) ||
      (person.nativeName && person.nativeName.toLowerCase().includes(q)) ||
      person.occupations.some((occ) => occ.toLowerCase().includes(q)) ||
      person.shortBio.toLowerCase().includes(q) ||
      person.geographyIds.some((gid) => gid.toLowerCase().includes(q));

    if (matches) {
      const mmDd = person.birthDate.slice(5);
      const targetIsoDate = `${currentYear}-${mmDd}`;
      const primaryGeo = getGeographyById(person.geographyIds[0])?.name || "India";

      results.push({
        id: person.id,
        title: person.name,
        nativeTitle: person.nativeName,
        kind: "Person",
        targetIsoDate,
        summary: person.shortBio,
        geography: primaryGeo,
      });
    }
  }

  // Search Events
  for (const event of HISTORICAL_EVENTS) {
    if (!matchesGeography(event.geographyIds, geographyId)) continue;

    const matches =
      event.title.toLowerCase().includes(q) ||
      (event.nativeTitle && event.nativeTitle.toLowerCase().includes(q)) ||
      event.summary.toLowerCase().includes(q) ||
      (event.location && event.location.toLowerCase().includes(q)) ||
      event.geographyIds.some((gid) => gid.toLowerCase().includes(q));

    if (matches) {
      const mmDd = event.dateStart.length === 5 ? event.dateStart : event.dateStart.slice(5);
      const targetIsoDate = `${currentYear}-${mmDd}`;
      const primaryGeo = getGeographyById(event.geographyIds[0])?.name || "India";

      results.push({
        id: event.id,
        title: event.title,
        nativeTitle: event.nativeTitle,
        kind: event.type === "festival" ? "Festival" : "Historical Event",
        targetIsoDate,
        summary: event.summary,
        geography: primaryGeo,
      });
    }
  }

  return results.slice(0, 15);
}
