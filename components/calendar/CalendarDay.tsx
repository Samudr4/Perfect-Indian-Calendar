"use client";

import React from "react";
import { CalendarDayInfo, formatEditorialDate, EntryCategory } from "@/lib/calendar/calendar-utils";

interface CalendarDayProps {
  dayInfo: CalendarDayInfo;
  isSelected: boolean;
  onSelect: (isoDate: string) => void;
}

export const CATEGORY_COLORS: Record<
  EntryCategory,
  { dotClass: string; textClass: string; label: string }
> = {
  Holiday: {
    dotClass: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400",
    label: "Official Public Holiday",
  },
  Born: {
    dotClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    label: "Birth Anniversary",
  },
  Remembered: {
    dotClass: "bg-purple-500",
    textClass: "text-purple-600 dark:text-purple-400",
    label: "Remembrance / Death Anniversary",
  },
  History: {
    dotClass: "bg-sky-500",
    textClass: "text-sky-600 dark:text-sky-400",
    label: "Historical Milestone",
  },
  Culture: {
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    label: "Cultural Observance",
  },
};

export function CalendarDay({ dayInfo, isSelected, onSelect }: CalendarDayProps) {
  const { isoDate, day, isCurrentMonth, isToday, hasContent, isHoliday, holidayTitle, categories = [] } = dayInfo;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(isoDate);
    }
  };

  const fullLabel = `${formatEditorialDate(isoDate)}${isHoliday ? `, Official Holiday: ${holidayTitle || "Holiday"}` : ""}${
    isToday ? ", Today" : ""
  }${isSelected ? ", Selected" : ""}`;

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
          : isHoliday && isCurrentMonth
          ? "bg-rose-50/40 dark:bg-rose-950/15 border-rose-200/80 dark:border-rose-900/40 hover:border-rose-400 shadow-2xs"
          : isCurrentMonth
          ? "bg-surface border-border hover:border-text-secondary hover:shadow-sm shadow-2xs"
          : "bg-slate-100/80 dark:bg-zinc-900/50 border-border-subtle hover:bg-slate-200/50 dark:hover:bg-zinc-800/50"
      }`}
    >
      {/* Top Header inside day: Number and Today/Holiday Badge */}
      <div className="flex items-center justify-between w-full">
        <span
          className={`inline-flex items-center justify-center text-xs xs:text-sm sm:text-base font-bold transition-colors ${
            isSelected
              ? "text-text-primary"
              : isToday
              ? "text-today"
              : isHoliday
              ? "text-rose-600 dark:text-rose-400 font-extrabold"
              : isCurrentMonth
              ? "text-text-primary"
              : "text-text-tertiary opacity-70"
          }`}
        >
          {day}
        </span>

        {/* High-visibility "Today" or "Holiday" badge */}
        {isToday ? (
          <>
            <span className="sm:hidden w-2 h-2 rounded-full bg-today shadow-xs" title="Today" />
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] bg-today text-white shadow-xs">
              Today
            </span>
          </>
        ) : isHoliday ? (
          <>
            <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-rose-500 shadow-xs" title={holidayTitle || "Official Holiday"} />
            <span className="hidden sm:inline-block text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              Holiday
            </span>
          </>
        ) : null}
      </div>

      {/* Middle Preview: Holiday Title on larger viewports */}
      {isHoliday && holidayTitle && (
        <div
          className="hidden sm:block text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded truncate w-full my-auto mt-1"
          title={holidayTitle}
        >
          🏖️ {holidayTitle}
        </div>
      )}

      {/* Bottom Indicator: Category Colored Dots */}
      <div className="flex items-center justify-between w-full mt-auto pt-1.5">
        {hasContent ? (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {categories.map((cat) => {
              const meta = CATEGORY_COLORS[cat];
              if (!meta) return null;
              return (
                <span
                  key={cat}
                  className={`w-2 h-2 rounded-full ${meta.dotClass} ring-1 ring-surface transition-transform group-hover:scale-125`}
                  title={meta.label}
                />
              );
            })}
            <span className="text-[10px] font-medium text-text-secondary hidden md:inline font-mono">
              {dayInfo.contentCount && dayInfo.contentCount > 1 ? `${dayInfo.contentCount}` : ""}
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
