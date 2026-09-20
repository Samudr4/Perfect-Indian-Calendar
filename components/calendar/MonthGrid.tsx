"use client";

import React, { useMemo } from "react";
import {
  getMonthGrid,
  WEEKDAY_NAMES_SHORT,
  CalendarDayInfo,
} from "@/lib/calendar/calendar-utils";
import { CalendarDay } from "./CalendarDay";
import { useTheme } from "@/lib/themes/ThemeProvider";

interface MonthGridProps {
  year: number;
  month: number;
  selectedDate: string;
  onSelectDate: (isoDate: string) => void;
  className?: string;
}

export function MonthGrid({
  year,
  month,
  selectedDate,
  onSelectDate,
  className = "",
}: MonthGridProps) {
  const { selectedStateId } = useTheme();

  const days: CalendarDayInfo[] = useMemo(() => {
    return getMonthGrid(year, month, undefined, selectedStateId);
  }, [year, month, selectedStateId]);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Weekday Names Header — High Contrast & Crisp Separation */}
      <div
        role="row"
        className="grid grid-cols-7 gap-1 sm:gap-2 mb-2.5 text-center pb-1 border-b border-border-subtle"
      >
        {WEEKDAY_NAMES_SHORT.map((weekday, idx) => (
          <div
            key={weekday}
            role="columnheader"
            aria-label={weekday}
            className={`text-[10px] sm:text-xs font-extrabold py-1 uppercase tracking-wider ${
              idx === 0 || idx === 6 ? "text-text-secondary" : "text-text-primary"
            }`}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* 7-Column Days Grid */}
      <div
        role="grid"
        aria-label="Month days"
        className="grid grid-cols-7 gap-1 sm:gap-2"
      >
        {days.map((dayInfo) => (
          <CalendarDay
            key={dayInfo.isoDate}
            dayInfo={dayInfo}
            isSelected={dayInfo.isoDate === selectedDate}
            onSelect={onSelectDate}
          />
        ))}
      </div>

      {/* Category Color Legend */}
      <div className="mt-3.5 pt-2.5 border-t border-border-subtle flex items-center justify-between flex-wrap gap-2 text-[11px] text-text-secondary select-none">
        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
          <span className="font-bold text-text-primary text-[10px] uppercase tracking-wider">Key:</span>
          <div className="flex items-center gap-1.5" title="Official Public & Gazetted Holidays">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-2xs" />
            <span className="font-medium">Official Holiday</span>
          </div>
          <div className="flex items-center gap-1.5" title="Birth Anniversaries of Notable Figures">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-2xs" />
            <span className="font-medium">Birth Anniversary</span>
          </div>
          <div className="flex items-center gap-1.5" title="Remembrance / Death Anniversaries">
            <span className="w-2 h-2 rounded-full bg-purple-500 shadow-2xs" />
            <span className="font-medium">Remembrance</span>
          </div>
          <div className="flex items-center gap-1.5" title="Historical Milestones & Statehood Days">
            <span className="w-2 h-2 rounded-full bg-sky-500 shadow-2xs" />
            <span className="font-medium">History</span>
          </div>
          <div className="flex items-center gap-1.5" title="Cultural Observances & Festivals">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-2xs" />
            <span className="font-medium">Culture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
