"use client";

import React from "react";
import { formatEditorialDate, PROTOTYPE_TODAY_ISO } from "@/lib/calendar/calendar-utils";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { getGeographyById } from "@/data/geographies";
import { Info, Sparkles, X } from "lucide-react";

interface DateDetailsPanelProps {
  selectedDate: string;
  onClose?: () => void;
  className?: string;
}

export function DateDetailsPanel({
  selectedDate,
  onClose,
  className = "",
}: DateDetailsPanelProps) {
  const { selectedStateId } = useTheme();
  const currentState = getGeographyById(selectedStateId);

  const formattedDate = formatEditorialDate(selectedDate);
  const isToday = selectedDate === PROTOTYPE_TODAY_ISO;

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
              {currentState.name}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            {formattedDate}
          </h2>
        </div>

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

        {/* Categories (Structured hierarchy for Phase 4) */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Timeline Categories
          </div>

          <div className="space-y-2.5">
            {["Born", "Remembered", "History", "Culture"].map((category) => (
              <div
                key={category}
                className="p-3 rounded-control border border-border bg-slate-50/90 dark:bg-zinc-900/50 shadow-2xs hover:border-text-secondary transition-colors"
              >
                <div className="text-xs font-bold text-text-primary mb-0.5">
                  {category}
                </div>
                <div className="text-xs text-text-secondary/90 italic leading-relaxed">
                  Nothing notable is recorded for this date in the selected calendar.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prototype Phase Notice */}
        <div className="rounded-control border border-border bg-slate-50/90 dark:bg-zinc-900/50 p-3 flex items-start gap-2.5 text-text-secondary shadow-2xs">
          <Info className="w-4 h-4 text-today shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold text-text-primary">Foundation Shell Active: </span>
            Verified historical entries, birth/death anniversaries, and source citations will be linked in upcoming build phases without modifying the shell architecture.
          </div>
        </div>
      </div>
    </aside>
  );
}
