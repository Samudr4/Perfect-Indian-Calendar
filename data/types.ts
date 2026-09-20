/**
 * Core Domain Models and Types for Perfect Calendar
 * Conforms to specifications in docs/03-DATA-MODEL.md
 */

export type GeographyType = "country" | "state" | "union-territory";

export type EventType =
  | "birth-anniversary"
  | "death-anniversary"
  | "historical"
  | "festival"
  | "cultural"
  | "literary"
  | "science"
  | "national"
  | "sports"
  | "holiday"
  | "other";

export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  accessedAt?: string;
  note?: string;
}

export interface Person {
  id: string;
  name: string;
  nativeName?: string;
  nativeScript?: string;
  aliases?: string[];
  birthDate: string; // ISO "YYYY-MM-DD"
  deathDate?: string; // ISO "YYYY-MM-DD"
  birthPlace?: string;
  deathPlace?: string;
  occupations: string[];
  shortBio: string;
  biography?: string;
  geographyIds: string[];
  imageUrl?: string;
  sourceIds: string[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  nativeTitle?: string;
  dateStart: string; // ISO "YYYY-MM-DD" or recurring "MM-DD"
  dateEnd?: string;
  isRecurringAnnual?: boolean; // e.g. Independence Day, Rongali Bihu
  type: EventType;
  summary: string;
  description?: string;
  geographyIds: string[];
  location?: string;
  personIds?: string[];
  sourceIds: string[];
  importance?: "notable" | "major";
  isOfficialHoliday?: boolean;
}

export interface CalendarEntry {
  id: string;
  date: string; // ISO "YYYY-MM-DD" for the current year representation
  originalDate?: string; // Original historical date if applicable e.g. "1861-05-07"
  type: EventType;
  category: "Holiday" | "Born" | "Remembered" | "History" | "Culture";
  title: string;
  nativeTitle?: string;
  subtitle?: string;
  summary: string;
  geographyIds: string[];
  linkedPerson?: Person;
  linkedEvent?: HistoricalEvent;
  sources: SourceCitation[];
  importance?: "notable" | "major";
  isOfficialHoliday?: boolean;
}
