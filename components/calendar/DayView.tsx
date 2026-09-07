"use client";

import React from "react";
import { formatEditorialDate, PROTOTYPE_TODAY_ISO } from "@/lib/calendar/calendar-utils";
import { Clock, Sparkles } from "lucide-react";

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
  const isToday = selectedDate === PROTOTYPE_TODAY_ISO;
  const formattedDate = formatEditorialDate(selectedDate);

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

      {/* Hourly Timeline Rows */}
      <div className="divide-y divide-border-subtle">
        {DAY_HOURS.map((hour) => {
          const isSampleHour = isToday && hour === "10:00";
          return (
            <div
              key={hour}
              className="flex items-start gap-4 py-3 px-2 group hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors rounded-control"
            >
              <div className="w-14 text-xs font-mono font-bold text-text-secondary shrink-0 pt-0.5">
                {hour}
              </div>
              <div className="flex-1 min-h-[38px] p-2 rounded-control border border-border group-hover:border-text-secondary bg-surface transition-colors">
                {isSampleHour ? (
                  <div className="flex items-center gap-2 p-2 rounded-control bg-today-soft border border-today/30 text-xs font-medium text-today">
                    <Sparkles className="w-3.5 h-3.5 text-today" />
                    <span>Historical event and anniversary records loaded here</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-text-secondary/70 italic">
                    No scheduled entries
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
