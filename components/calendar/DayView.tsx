"use client";

import React from "react";
import { formatEditorialDate, getTodayIso } from "@/lib/calendar/calendar-utils";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { getEntriesForDate } from "@/lib/calendar/entry-resolver";
import { Clock, Sparkles, BookOpen, Calendar as CalendarIcon } from "lucide-react";

interface DayViewProps {
  selectedDate: string;
  className?: string;
}

const DAY_HOURS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export function DayView({ selectedDate, className = "" }: DayViewProps) {
  const { selectedStateId } = useTheme();
  const isToday = selectedDate === getTodayIso();
  const formattedDate = formatEditorialDate(selectedDate);
  const entries = getEntriesForDate(selectedDate, selectedStateId);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Day Headline Card */}
      <div className="flex items-center justify-between p-4 rounded-control bg-slate-50 dark:bg-zinc-900/60 border border-border mb-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isToday ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-today text-white shadow-xs">
                Today
              </span>
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                Day Schedule
              </span>
            )}
            <span className="text-xs text-text-secondary font-semibold">· 24h Timeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
            {formattedDate}
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-secondary font-semibold">
          <Clock className="w-4 h-4 text-today" />
          <span>Full Day View</span>
        </div>
      </div>

      {/* Featured Observances Banner if entries exist */}
      {entries.length > 0 && (
        <div className="mb-5 p-3.5 rounded-control bg-today-soft border border-today/30 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-today mb-2">
            <Sparkles className="w-4 h-4 text-today" />
            <span>Recorded Observances for {formattedDate}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 rounded-control bg-surface border border-border shadow-2xs flex flex-col"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-text-primary">
                    {entry.title}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[4px] bg-bg border border-border-subtle text-text-secondary">
                    {entry.category}
                  </span>
                </div>
                {entry.subtitle && (
                  <div className="text-[11px] font-medium text-today mb-1">
                    {entry.subtitle}
                  </div>
                )}
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Timeline Rows */}
      <div className="divide-y divide-border-subtle">
        {DAY_HOURS.map((hour, idx) => {
          // Map entries across morning & afternoon slots (e.g., 09:00, 11:00, 15:00)
          const matchedEntry =
            hour === "09:00" && entries[0]
              ? entries[0]
              : hour === "11:00" && entries[1]
              ? entries[1]
              : hour === "15:00" && entries[2]
              ? entries[2]
              : undefined;

          return (
            <div
              key={hour}
              className="flex items-start gap-4 py-3 px-2 group hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-control"
            >
              <div className="w-14 text-xs font-mono font-bold text-text-secondary shrink-0 pt-0.5">
                {hour}
              </div>
              <div className="flex-1 min-h-[38px] p-2 rounded-control border border-border group-hover:border-text-secondary bg-surface transition-colors">
                {matchedEntry ? (
                  <div className="flex items-start gap-2 p-2 rounded-control bg-today-soft border border-today/30 text-xs font-medium text-text-primary">
                    <Sparkles className="w-3.5 h-3.5 text-today shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-text-primary">
                        {matchedEntry.title}
                      </div>
                      <div className="text-[11px] text-today font-medium">
                        {matchedEntry.subtitle || matchedEntry.category}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-text-secondary/70 italic">
                    No scheduled event
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
