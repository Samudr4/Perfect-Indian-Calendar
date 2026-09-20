"use client";

import React from "react";
import { CalendarViewType } from "@/lib/calendar/calendar-utils";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface CalendarHeaderProps {
  currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onJumpToToday: () => void;
  className?: string;
}

const VIEW_OPTIONS: { id: CalendarViewType; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
  { id: "year", label: "Year" },
];

export function CalendarHeader({
  currentView,
  onViewChange,
  title,
  onPrevious,
  onNext,
  onJumpToToday,
  className = "",
}: CalendarHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-border ${className}`}
    >
      {/* Dynamic View Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-text-primary truncate">
          {title}
        </h1>

        {/* Today Quick Return Button */}
        <button
          type="button"
          id="today-btn"
          onClick={onJumpToToday}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-control border border-today/30 bg-today-soft text-today hover:bg-today hover:text-white active:scale-95 transition-all duration-150 shadow-2xs shrink-0"
          aria-label="Jump to Today"
          title="Jump to Today"
        >
          <RotateCcw className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span className="hidden xs:inline">Today</span>
        </button>
      </div>

      {/* Navigation Controls & View Switcher */}
      <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0">
        {/* Desktop View Switcher (Month, Week, Day, Year) — Mobile uses Bottom Nav */}
        <div
          role="tablist"
          aria-label="Calendar view options"
          className="hidden md:inline-flex items-center p-0.5 rounded-control bg-slate-100/90 dark:bg-zinc-800/80 border border-border text-xs shadow-2xs"
        >
          {VIEW_OPTIONS.map((v) => {
            const isActive = currentView === v.id;
            return (
              <button
                key={v.id}
                role="tab"
                id={`view-btn-${v.id}`}
                aria-selected={isActive}
                type="button"
                onClick={() => onViewChange(v.id)}
                className={`px-3 py-1.5 rounded-[6px] transition-all duration-150 ${
                  isActive
                    ? "bg-accent text-accent-contrast shadow-xs font-bold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface font-semibold"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Previous & Next Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="prev-btn"
            onClick={onPrevious}
            aria-label={`Previous ${currentView}`}
            className="p-1.5 sm:p-2 rounded-control border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-150 shadow-2xs"
            title={`Previous ${currentView}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="next-btn"
            onClick={onNext}
            aria-label={`Next ${currentView}`}
            className="p-1.5 sm:p-2 rounded-control border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-text-secondary hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all duration-150 shadow-2xs"
            title={`Next ${currentView}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
