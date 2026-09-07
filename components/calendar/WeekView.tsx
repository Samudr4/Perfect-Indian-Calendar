"use client";

import React, { useMemo } from "react";
import {
  CalendarDayInfo,
  getWeekDays,
  WEEKDAY_NAMES_SHORT,
  formatEditorialDate,
} from "@/lib/calendar/calendar-utils";

interface WeekViewProps {
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
  className?: string;
}

const HOURS = [
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
];

export function WeekView({
  selectedDate,
  onSelectDate,
  className = "",
}: WeekViewProps) {
  const weekDays: CalendarDayInfo[] = useMemo(() => {
    return getWeekDays(selectedDate);
  }, [selectedDate]);

  return (
    <div className={`flex flex-col w-full overflow-x-auto ${className}`}>
      {/* 7-Column Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 pb-3 border-b border-border text-center">
        {weekDays.map((day) => {
          const isSelected = day.isoDate === selectedDate;
          return (
            <button
              key={day.isoDate}
              type="button"
              onClick={() => onSelectDate(day.isoDate)}
              className={`flex flex-col items-center py-2 px-1 rounded-control transition-all ${
                isSelected
                  ? "bg-surface border-2 border-text-primary shadow-xs"
                  : day.isToday
                  ? "bg-today-soft border border-today/40"
                  : "hover:bg-surface border border-border-subtle"
              }`}
            >
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                {WEEKDAY_NAMES_SHORT[day.dayOfWeek]}
              </span>
              <span
                className={`text-base sm:text-lg font-bold mt-0.5 ${
                  isSelected
                    ? "text-text-primary"
                    : day.isToday
                    ? "text-today"
                    : "text-text-primary"
                }`}
              >
                {day.day}
              </span>
              {day.isToday && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded-[4px] bg-today text-white mt-1">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hourly Schedule Matrix */}
      <div className="divide-y divide-border-subtle mt-2 min-w-[560px]">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-7 gap-1 sm:gap-2 py-3">
            {weekDays.map((day) => {
              const isSelected = day.isoDate === selectedDate;
              // Sample demonstration entry on today at 10:00
              const hasSampleEvent = day.isToday && hour === "10:00";

              return (
                <div
                  key={`${day.isoDate}-${hour}`}
                  onClick={() => onSelectDate(day.isoDate)}
                  className={`min-h-[46px] p-1.5 rounded-control cursor-pointer transition-colors border ${
                    isSelected
                      ? "bg-slate-100/90 dark:bg-zinc-800/80 border-border shadow-2xs"
                      : "border-border-subtle hover:bg-slate-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="text-[10px] font-mono text-text-tertiary">
                    {hour}
                  </div>
                  {hasSampleEvent && (
                    <div className="mt-1 p-1 rounded-[4px] bg-today-soft border border-today/30 text-[10px] font-medium text-today leading-tight">
                      Anniversary Observance
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
