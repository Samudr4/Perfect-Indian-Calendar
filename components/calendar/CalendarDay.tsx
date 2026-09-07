"use client";

import React from "react";
import { CalendarDayInfo, formatEditorialDate } from "@/lib/calendar/calendar-utils";

interface CalendarDayProps {
  dayInfo: CalendarDayInfo;
  isSelected: boolean;
  onSelect: (isoDate: string) => void;
}

export function CalendarDay({ dayInfo, isSelected, onSelect }: CalendarDayProps) {
  const { isoDate, day, isCurrentMonth, isToday, hasContent } = dayInfo;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(isoDate);
    }
  };

  const fullLabel = `${formatEditorialDate(isoDate)}${isToday ? ", Today" : ""}${
    isSelected ? ", Selected" : ""
  }`;

  return (
    <button
      type="button"
      role="gridcell"
      id={`date-cell-${isoDate}`}
      tabIndex={isCurrentMonth ? 0 : -1}
      aria-label={fullLabel}
      aria-selected={isSelected}
      onClick={() => onSelect(isoDate)}
      onKeyDown={handleKeyDown}
      className={`group relative min-h-[56px] xs:min-h-[64px] sm:min-h-[96px] md:min-h-[110px] lg:min-h-[120px] p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-control flex flex-col justify-between text-left transition-all duration-150 outline-none select-none border ${
        isSelected
          ? "bg-surface border-2 border-text-primary shadow-md ring-2 ring-text-primary/10 z-10"
          : isToday
          ? "bg-today-soft border-2 border-today shadow-xs z-10"
          : isCurrentMonth
          ? "bg-surface border-border hover:border-text-secondary hover:shadow-sm shadow-2xs"
          : "bg-slate-100/80 dark:bg-zinc-900/50 border-border-subtle hover:bg-slate-200/50 dark:hover:bg-zinc-800/50"
      }`}
    >
      {/* Top Header inside day: Number and Today Badge */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`inline-flex items-center justify-center text-xs xs:text-sm sm:text-base font-bold transition-colors ${
            isSelected
              ? "text-text-primary"
              : isToday
              ? "text-today"
              : isCurrentMonth
              ? "text-text-primary"
              : "text-text-tertiary opacity-70"
          }`}
        >
          {day}
        </span>

        {/* High-visibility "Today" badge — Dot on mobile, pill on sm+ */}
        {isToday && (
          <>
            <span className="sm:hidden w-2 h-2 rounded-full bg-today shadow-xs" title="Today" />
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] bg-today text-white shadow-xs">
              Today
            </span>
          </>
        )}
      </div>

      {/* Bottom Indicator for Content presence */}
      <div className="flex items-center justify-between w-full mt-auto pt-2">
        {hasContent ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                isSelected ? "bg-text-primary" : "bg-today"
              }`}
              title="Has recorded entries"
            />
            <span className="text-[10px] font-medium text-text-secondary hidden md:inline font-mono">
              entry
            </span>
          </div>
        ) : (
          <span className="w-2 h-2 opacity-0" />
        )}

        {/* Selected date indicator marker */}
        {isSelected && (
          <span className="w-3.5 h-1 rounded-full bg-text-primary ml-auto" />
        )}
      </div>
    </button>
  );
}
