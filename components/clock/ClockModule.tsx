"use client";

import React, { useEffect, useState } from "react";
import { AnalogClock } from "./AnalogClock";
import { Clock } from "lucide-react";

interface ClockModuleProps {
  className?: string;
}

export function ClockModule({ className = "" }: ClockModuleProps) {
  const [digitalTime, setDigitalTime] = useState<string>("00:00:00");
  const [digitalPeriod, setDigitalPeriod] = useState<string>("AM");
  const [digitalDate, setDigitalDate] = useState<string>("--- · 00 ---");
  const [mounted, setMounted] = useState(false);
  const [isDialVisibleOnMobile, setIsDialVisibleOnMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      const rawHours = now.getHours();
      const period = rawHours >= 12 ? "PM" : "AM";
      const h12 = (rawHours % 12 || 12).toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");

      setDigitalTime(`${h12}:${m}:${s}`);
      setDigitalPeriod(period);

      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      setDigitalDate(
        `${days[now.getDay()]} · ${now.getDate().toString().padStart(2, "0")} ${
          months[now.getMonth()]
        }`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`rounded-card border border-border bg-surface p-4 sm:p-5 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-sm transition-colors duration-150 ${className}`}
    >
      {/* Header with IST · UTC+5:30 in primary position */}
      <div className="w-full flex items-center justify-between text-xs text-text-tertiary px-1 border-b border-border-subtle pb-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-text-primary uppercase">
          <Clock className="w-4 h-4 text-today" />
          <span>IST · UTC+5:30</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Watch Dial Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDialVisibleOnMobile(!isDialVisibleOnMobile)}
            className="lg:hidden text-[10px] font-bold text-today hover:underline px-1.5 py-0.5 rounded bg-today-soft border border-today/30"
          >
            {isDialVisibleOnMobile ? "Hide Analog" : "Analog Clock"}
          </button>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">LIVE</span>
          </span>
        </div>
      </div>

      {/* Rolex-Inspired Analog Clock: Always visible on lg+, toggleable on mobile */}
      <div className={`py-1 flex items-center justify-center ${isDialVisibleOnMobile ? "block" : "hidden lg:flex"}`}>
        <AnalogClock size={184} />
      </div>

      {/* Large High-Visibility Digital Clock with AM/PM */}
      <div className="w-full rounded-control border border-border bg-slate-100/80 dark:bg-zinc-900/70 p-3 sm:p-3.5 flex flex-col items-center justify-center text-center shadow-inner">
        <div className="flex items-baseline justify-center gap-2 font-mono leading-none py-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-wider tabular-nums">
            {mounted ? digitalTime : "00:00:00"}
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-today tracking-widest px-1.5 py-0.5 rounded-[4px] bg-today-soft border border-today/40 shadow-xs">
            {mounted ? digitalPeriod : "AM"}
          </span>
        </div>
        <div className="font-mono text-xs font-bold text-text-secondary tracking-widest mt-1.5 uppercase">
          {mounted ? digitalDate : "--- · -- ---"}
        </div>
      </div>
    </div>
  );
}
