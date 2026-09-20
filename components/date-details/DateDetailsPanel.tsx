"use client";

import React, { useState } from "react";
import { formatEditorialDate, getTodayIso } from "@/lib/calendar/calendar-utils";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { getGeographyById } from "@/data/geographies";
import { getEntriesForDate, getStateMilestones } from "@/lib/calendar/entry-resolver";
import { CalendarEntry } from "@/data/types";
import { exportEntriesToIcs } from "@/lib/calendar/ics-export";
import {
  Sparkles,
  X,
  ExternalLink,
  Download,
  BookOpen,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

interface DateDetailsPanelProps {
  selectedDate: string;
  onSelectDate?: (isoDate: string) => void;
  onClose?: () => void;
  className?: string;
}

const CATEGORY_META = {
  Holiday: {
    label: "Official Public Holidays",
    icon: "🏖️",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25",
  },
  Born: {
    label: "Birth Anniversaries",
    icon: "🎂",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
  },
  Remembered: {
    label: "In Remembrance",
    icon: "🕯️",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25",
  },
  History: {
    label: "Historical Milestones",
    icon: "🏛️",
    badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/25",
  },
  Culture: {
    label: "Cultural Observances",
    icon: "🪔",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  },
} as const;

export function DateDetailsPanel({
  selectedDate,
  onSelectDate,
  onClose,
  className = "",
}: DateDetailsPanelProps) {
  const { selectedStateId } = useTheme();
  const currentState = getGeographyById(selectedStateId);

  const formattedDate = formatEditorialDate(selectedDate);
  const isToday = selectedDate === getTodayIso();

  // Resolve real entries for this date and geography
  const entries: CalendarEntry[] = getEntriesForDate(selectedDate, selectedStateId);

  // Group entries by category (with Official Holidays prioritized)
  const groupedEntries: Record<string, CalendarEntry[]> = {
    Holiday: entries.filter((e) => e.category === "Holiday" || e.isOfficialHoliday),
    Born: entries.filter((e) => e.category === "Born"),
    Remembered: entries.filter((e) => e.category === "Remembered"),
    History: entries.filter((e) => e.category === "History" && !e.isOfficialHoliday),
    Culture: entries.filter((e) => e.category === "Culture" && !e.isOfficialHoliday),
  };

  const hasAnyEntries = entries.length > 0;
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});

  const toggleEntry = (entryId: string) => {
    setExpandedEntries((prev) => ({ ...prev, [entryId]: !prev[entryId] }));
  };

  const handleExportIcs = () => {
    if (entries.length > 0) {
      exportEntriesToIcs(entries, `calendar-events-${selectedDate}.ics`);
    }
  };

  return (
    <aside
      id="date-details-panel"
      aria-label={`Details for ${formattedDate}`}
      className={`flex flex-col h-full rounded-card border border-border bg-surface p-4 sm:p-5 shadow-sm transition-colors duration-150 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-today">
              {isToday ? "Today" : "Selected Date"}
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-[11px] text-text-secondary font-semibold">
              {currentState.name} {currentState.nativeName && `(${currentState.nativeName})`}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            {formattedDate}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {hasAnyEntries && (
            <button
              type="button"
              onClick={handleExportIcs}
              title="Export date events to .ics (Apple / Google Calendar)"
              className="p-1.5 rounded-control text-text-tertiary hover:text-text-primary hover:bg-bg border border-border-subtle transition-colors flex items-center gap-1 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-today" />
              <span className="hidden sm:inline text-[11px] font-medium">ICS</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close date details"
              className="p-1.5 rounded-control text-text-tertiary hover:text-text-primary hover:bg-bg md:hidden transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Sections Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        {/* State Banner */}
        <div className="rounded-control bg-today-soft border border-today/30 p-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary mb-1">
            <Sparkles className="w-4 h-4 text-today shrink-0" />
            <span>
              {isToday ? `Today in ${currentState.name}` : `This Date in ${currentState.name}`}
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            {currentState.description ||
              `Exploring historical milestones, anniversaries, and cultural events for ${currentState.name}.`}
          </p>
        </div>

        {/* Categories / Entries list */}
        {hasAnyEntries ? (
          <div className="space-y-4">
            {(["Holiday", "Born", "Remembered", "History", "Culture"] as const).map((categoryKey) => {
              const categoryItems = groupedEntries[categoryKey] || [];
              if (categoryItems.length === 0) return null;

              const meta = CATEGORY_META[categoryKey];

              return (
                <section key={categoryKey} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-zinc-800 text-text-primary">
                      {categoryItems.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {categoryItems.map((entry) => {
                      const isExpanded = expandedEntries[entry.id] ?? false;

                      return (
                        <article
                          key={entry.id}
                          className="p-3 rounded-control border border-border bg-slate-50/90 dark:bg-zinc-900/60 shadow-2xs hover:border-text-secondary/50 transition-all flex flex-col"
                        >
                          {/* Title & Native Title */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <h3 className="text-sm font-bold text-text-primary leading-snug">
                                {entry.title}
                              </h3>
                              {entry.nativeTitle && (
                                <span className="inline-block mt-0.5 text-xs text-today font-medium">
                                  {entry.nativeTitle}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-[4px] border shrink-0 ${meta.badgeClass}`}
                            >
                              {entry.category}
                            </span>
                          </div>

                          {/* Subtitle / Milestone Years */}
                          {entry.subtitle && (
                            <div className="text-[11px] font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
                              <CalendarIcon className="w-3 h-3 text-today shrink-0" />
                              <span>{entry.subtitle}</span>
                            </div>
                          )}

                          {/* Editorial Summary - Minimal 2-line preview when collapsed, full text when expanded */}
                          <p
                            className={`text-xs text-text-secondary leading-relaxed ${
                              isExpanded ? "mb-2" : "line-clamp-2 mb-1.5"
                            }`}
                          >
                            {entry.summary}
                          </p>

                          {/* Expanded Details: Occupations (if any) */}
                          {isExpanded && entry.linkedPerson?.occupations && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {entry.linkedPerson.occupations.map((occ) => (
                                <span
                                  key={occ}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-text-secondary font-medium"
                                >
                                  {occ}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Verified Sources: One-Liner with Hyperlink (Only visible on Show more click) */}
                          {isExpanded && entry.sources && entry.sources.length > 0 && (
                            <div className="text-[11px] text-text-tertiary flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-border-subtle/80 mt-1 mb-1 animate-in fade-in duration-150">
                              <span className="font-semibold text-text-primary flex items-center gap-1 shrink-0">
                                <BookOpen className="w-3 h-3 text-today shrink-0" />
                                <span>{entry.sources.length === 1 ? "Source:" : "Sources:"}</span>
                              </span>
                              {entry.sources.map((src, idx) => (
                                <span key={src.id} className="inline-flex items-center gap-1">
                                  {idx > 0 && <span className="text-text-tertiary">·</span>}
                                  {src.url ? (
                                    <a
                                      href={src.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-0.5 text-today hover:underline font-medium"
                                      title={src.publisher ? `${src.title} (${src.publisher})` : src.title}
                                    >
                                      <span>{src.title}</span>
                                      <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-80" />
                                    </a>
                                  ) : (
                                    <span className="text-text-secondary font-medium" title={src.publisher}>
                                      {src.title}
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Show more / Show less Button */}
                          <div className="pt-2 border-t border-border-subtle mt-auto flex items-center justify-between">
                            <button
                              type="button"
                              id={`show-more-btn-${entry.id}`}
                              onClick={() => toggleEntry(entry.id)}
                              aria-expanded={isExpanded}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-today hover:text-today-hover hover:underline transition-colors py-0.5"
                            >
                              <span>{isExpanded ? "Show less" : "Show more"}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 transition-transform" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 transition-transform" />
                              )}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* Editorial Tranquil Empty State */
          <div className="p-5 rounded-control border border-border bg-slate-50/70 dark:bg-zinc-900/40 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-zinc-800 flex items-center justify-center mx-auto text-text-secondary">
              <CalendarIcon className="w-5 h-5 opacity-70" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Quiet Day in the Archives
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto mt-1">
                No statehood milestones, canonical anniversaries, or festivals are recorded for this date in the {currentState.name} timeline.
              </p>
            </div>

            {/* Quick Milestones in Current State */}
            {onSelectDate && (
              <div className="pt-2 border-t border-border-subtle text-left">
                <div className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-today" />
                  <span>Key Dates in {currentState.name}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getStateMilestones(selectedStateId, parseInt(selectedDate.slice(0, 4), 10))
                    .slice(0, 5)
                    .map((item) => {
                      const [m, d] = item.monthDay.split("-");
                      const monthNames = [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                      ];
                      const mStr = monthNames[parseInt(m, 10) - 1] || m;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onSelectDate(item.isoDate)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] text-[11px] bg-surface hover:bg-slate-100 dark:hover:bg-zinc-800 border border-border text-text-primary transition-colors font-medium hover:border-text-secondary"
                        >
                          <span className="font-mono text-[10px] text-today font-bold">
                            {mStr} {parseInt(d, 10)}
                          </span>
                          <span className="truncate max-w-[120px]">{item.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="pt-1 text-[11px] text-text-tertiary">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border font-mono text-[10px]">Ctrl+K</kbd> to search all dates and figures.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
