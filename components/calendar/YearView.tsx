"use client";

import React from "react";
import {
  getMonthGrid,
  MONTH_NAMES,
  WEEKDAY_NAMES_SHORT,
  formatIsoDate,
} from "@/lib/calendar/calendar-utils";

interface YearViewProps {
  year: number;
  selectedDate: string;
  onSelectMonth: (month: number) => void;
  onSelectDate: (isoDate: string) => void;
  className?: string;
}

export function YearView({
  year,
  selectedDate,
  onSelectMonth,
  onSelectDate,
  className = "",
}: YearViewProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const days = getMonthGrid(year, month);
        const monthName = MONTH_NAMES[month - 1];

        return (
          <div
            key={month}
            className="rounded-card border border-border bg-surface p-3.5 shadow-2xs hover:shadow-sm hover:border-text-secondary transition-all duration-150 flex flex-col"
          >
            {/* Month Header Clickable */}
            <button
              type="button"
              onClick={() => onSelectMonth(month)}
              className="text-left font-bold text-sm text-text-primary hover:text-today transition-colors pb-2 border-b border-border-subtle mb-2 flex items-center justify-between group"
            >
              <span>{monthName}</span>
              <span className="text-[10px] font-bold text-today group-hover:underline">
                View →
              </span>
            </button>

            {/* Mini Weekday Headers */}
            <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
              {WEEKDAY_NAMES_SHORT.map((wd) => (
                <span
                  key={wd}
                  className="text-[9px] font-bold text-text-secondary uppercase"
                >
                  {wd[0]}
                </span>
              ))}
            </div>

            {/* Mini Grid Cells */}
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px]">
              {days.map((d, idx) => {
                const isSelected = d.isoDate === selectedDate;
                return (
                  <button
                    key={`${d.isoDate}-${idx}`}
                    type="button"
                    onClick={() => onSelectDate(d.isoDate)}
                    className={`h-6 w-full rounded-[4px] flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-text-primary text-bg font-bold shadow-xs"
                        : d.isToday
                        ? "bg-today text-white font-bold"
                        : d.isCurrentMonth
                        ? "text-text-primary hover:bg-surface-elevated"
                        : "text-text-tertiary/40"
                    }`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
