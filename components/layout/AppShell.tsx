"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { TopBar } from "./TopBar";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { YearView } from "@/components/calendar/YearView";
import { DateDetailsPanel } from "@/components/date-details/DateDetailsPanel";
import {
  PROTOTYPE_TODAY_ISO,
  CalendarViewType,
  parseIsoDate,
  getPreviousMonth,
  getNextMonth,
  getPreviousWeekDate,
  getNextWeekDate,
  getPreviousDay,
  getNextDay,
  formatMonthYear,
  formatEditorialDate,
  formatWeekRange,
  getWeekDays,
} from "@/lib/calendar/calendar-utils";
import {
  Calendar as CalendarIcon,
  Compass,
  History,
  Settings,
  Sparkles,
  Columns,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { getGeographyById } from "@/data/geographies";

const ClockModule = dynamic(
  () => import("@/components/clock/ClockModule").then((mod) => mod.ClockModule),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-card border border-border bg-surface p-4 h-64 flex items-center justify-center animate-pulse">
        <div className="w-32 h-32 rounded-full border border-border-subtle" />
      </div>
    ),
  }
);

export function AppShell() {
  const { selectedStateId } = useTheme();
  const currentState = getGeographyById(selectedStateId);

  // Prototype Anchor: September 2026, today = 2026-09-08
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9);
  const [selectedDate, setSelectedDate] = useState<string>(PROTOTYPE_TODAY_ISO);
  const [currentView, setCurrentView] = useState<CalendarViewType>("month");

  // Mobile drawer state — starts closed, opens on tap or timeline click
  const [isDetailsOpenMobile, setIsDetailsOpenMobile] = useState<boolean>(false);

  // Unified Previous Navigation Handler
  const handlePrevious = () => {
    if (currentView === "month") {
      const prev = getPreviousMonth(currentYear, currentMonth);
      setCurrentYear(prev.year);
      setCurrentMonth(prev.month);
    } else if (currentView === "week") {
      const prevWeekDate = getPreviousWeekDate(selectedDate);
      setSelectedDate(prevWeekDate);
      const parts = parseIsoDate(prevWeekDate);
      setCurrentYear(parts.year);
      setCurrentMonth(parts.month);
    } else if (currentView === "day") {
      const prevDayDate = getPreviousDay(selectedDate);
      setSelectedDate(prevDayDate);
      const parts = parseIsoDate(prevDayDate);
      setCurrentYear(parts.year);
      setCurrentMonth(parts.month);
    } else if (currentView === "year") {
      setCurrentYear((y) => y - 1);
    }
  };

  // Unified Next Navigation Handler
  const handleNext = () => {
    if (currentView === "month") {
      const next = getNextMonth(currentYear, currentMonth);
      setCurrentYear(next.year);
      setCurrentMonth(next.month);
    } else if (currentView === "week") {
      const nextWeekDate = getNextWeekDate(selectedDate);
      setSelectedDate(nextWeekDate);
      const parts = parseIsoDate(nextWeekDate);
      setCurrentYear(parts.year);
      setCurrentMonth(parts.month);
    } else if (currentView === "day") {
      const nextDayDate = getNextDay(selectedDate);
      setSelectedDate(nextDayDate);
      const parts = parseIsoDate(nextDayDate);
      setCurrentYear(parts.year);
      setCurrentMonth(parts.month);
    } else if (currentView === "year") {
      setCurrentYear((y) => y + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate(PROTOTYPE_TODAY_ISO);
  };

  const handleSelectDate = (isoDate: string) => {
    setSelectedDate(isoDate);
    const { year, month } = parseIsoDate(isoDate);
    if (year !== currentYear || month !== currentMonth) {
      setCurrentYear(year);
      setCurrentMonth(month);
    }
    setIsDetailsOpenMobile(true);
  };

  // Header Title calculation according to active view
  let headerTitle = formatMonthYear(currentYear, currentMonth);
  if (currentView === "week") {
    headerTitle = formatWeekRange(getWeekDays(selectedDate));
  } else if (currentView === "day") {
    headerTitle = formatEditorialDate(selectedDate);
  } else if (currentView === "year") {
    headerTitle = `${currentYear}`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary transition-colors duration-200">
      {/* Top Bar Header */}
      <TopBar />

      {/* Primary Expansive Layout Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 lg:p-6 pb-20 md:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Rail (Chrono / Clock Only — Views Card Removed) */}
          <aside
            aria-label="Chronometer"
            className="hidden lg:flex lg:col-span-3 xl:col-span-2 flex-col gap-4 sticky top-20"
          >
            {/* Precision Clock Module */}
            <ClockModule />
          </aside>

          {/* Center Column: Wide Prominent Calendar Workspace */}
          <section
            aria-label="Calendar Workspace"
            className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4"
          >
            <div className="rounded-card border border-border bg-surface p-4 sm:p-6 lg:p-7 shadow-sm">
              <CalendarHeader
                currentView={currentView}
                onViewChange={setCurrentView}
                title={headerTitle}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onJumpToToday={handleJumpToToday}
              />

              {/* Dynamic View Rendering */}
              <div className="mt-5">
                {currentView === "month" && (
                  <MonthGrid
                    year={currentYear}
                    month={currentMonth}
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                  />
                )}

                {currentView === "week" && (
                  <WeekView
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                  />
                )}

                {currentView === "day" && (
                  <DayView selectedDate={selectedDate} />
                )}

                {currentView === "year" && (
                  <YearView
                    year={currentYear}
                    selectedDate={selectedDate}
                    onSelectMonth={(m) => {
                      setCurrentMonth(m);
                      setCurrentView("month");
                    }}
                    onSelectDate={(d) => {
                      handleSelectDate(d);
                      setCurrentView("month");
                    }}
                  />
                )}
              </div>

              {/* Mobile Quick Date Summary Bar with Instant Feedback */}
              <div
                onClick={() => setIsDetailsOpenMobile(true)}
                className="mt-4 sm:hidden flex items-center justify-between p-3 rounded-control bg-slate-100/90 dark:bg-zinc-900/70 border border-border cursor-pointer shadow-2xs active:scale-[0.99] transition-transform"
                role="button"
                tabIndex={0}
                aria-label={`View timeline details for ${formatEditorialDate(selectedDate)}`}
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-today uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {selectedDate === PROTOTYPE_TODAY_ISO ? "Today" : "Selected"} · {currentState.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-text-primary mt-0.5 truncate">
                    {formatEditorialDate(selectedDate)}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-[6px] bg-today text-white shadow-xs">
                  Timeline →
                </span>
              </div>
            </div>

            {/* Mobile / Tablet Clock Module */}
            <div className="block lg:hidden">
              <ClockModule />
            </div>
          </section>

          {/* Right Column: Desktop Date Details Panel */}
          <section
            aria-label="Selected Date Information"
            className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-20"
          >
            <DateDetailsPanel
              selectedDate={selectedDate}
              className="block"
            />
          </section>
        </div>
      </main>

      {/* Mobile Slide-Up Bottom Sheet for Date Details */}
      {isDetailsOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsDetailsOpenMobile(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-h-[85vh] bg-surface rounded-t-[20px] border-t border-border shadow-2xl flex flex-col p-4 pb-8 animate-in slide-in-from-bottom duration-250">
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-3 shrink-0" />
            <DateDetailsPanel
              selectedDate={selectedDate}
              onClose={() => setIsDetailsOpenMobile(false)}
              className="border-none shadow-none p-0 overflow-y-auto"
            />
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar with Safe Area */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border py-1.5 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-lg"
      >
        <button
          type="button"
          onClick={handleJumpToToday}
          className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-text-primary p-1 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-today" />
          <span className="text-[10px] font-semibold">Today</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("month")}
          className={`flex flex-col items-center gap-0.5 p-1 active:scale-95 transition-transform ${
            currentView === "month" ? "text-text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="text-[10px]">Month</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("week")}
          className={`flex flex-col items-center gap-0.5 p-1 active:scale-95 transition-transform ${
            currentView === "week" ? "text-text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <Columns className="w-4 h-4" />
          <span className="text-[10px]">Week</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("day")}
          className={`flex flex-col items-center gap-0.5 p-1 active:scale-95 transition-transform ${
            currentView === "day" ? "text-text-primary font-bold" : "text-text-secondary"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-[10px]">Day</span>
        </button>
        <button
          type="button"
          onClick={() => setIsDetailsOpenMobile(true)}
          className="flex flex-col items-center gap-0.5 text-text-secondary hover:text-text-primary p-1 active:scale-95 transition-transform"
        >
          <BookOpen className="w-4 h-4 text-today" />
          <span className="text-[10px] font-semibold">Timeline</span>
        </button>
      </nav>
    </div>
  );
}
