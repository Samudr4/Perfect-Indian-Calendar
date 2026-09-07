"use client";

import React, { useMemo } from "react";
import {
  getMonthGrid,
  WEEKDAY_NAMES_SHORT,
  CalendarDayInfo,
} from "@/lib/calendar/calendar-utils";
import { CalendarDay } from "./CalendarDay";

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
  const days: CalendarDayInfo[] = useMemo(() => {
    return getMonthGrid(year, month);
  }, [year, month]);

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
    </div>
  );
}
