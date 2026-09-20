import { CalendarEntry } from "@/data/types";

/**
 * Generates and triggers download of an RFC 5545 iCalendar (.ics) file
 * containing entries for a date or selected events.
 */
export function exportEntriesToIcs(
  entries: CalendarEntry[],
  filename: string = "perfect-calendar-events.ics"
): void {
  if (entries.length === 0) return;

  const formatDateToIcs = (dateStr: string): string => {
    // dateStr is "YYYY-MM-DD"
    return dateStr.replace(/-/g, "");
  };

  const escapeIcsText = (str: string): string => {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Perfect Calendar//India Editorial Historical Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Perfect Calendar Observances",
    "X-WR-TIMEZONE:Asia/Kolkata",
  ];

  for (const entry of entries) {
    const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dtStart = formatDateToIcs(entry.date);
    const summary = escapeIcsText(
      entry.nativeTitle ? `${entry.title} (${entry.nativeTitle})` : entry.title
    );
    const description = escapeIcsText(
      `${entry.subtitle ? entry.subtitle + "\n\n" : ""}${entry.summary}\n\nCategory: ${
        entry.category
      }\nSource: Perfect Indian Calendar`
    );

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${entry.id}@perfect-calendar.in`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${description}`);
    lines.push(`CATEGORIES:${entry.category},Indian Heritage`);
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:TRANSPARENT");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const icsContent = lines.join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
