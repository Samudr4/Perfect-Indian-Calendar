"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { appearance, toggleAppearance } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-control border border-border bg-surface ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = appearance === "dark";

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleAppearance}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-control border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-text-tertiary transition-all duration-150 active:scale-95 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 text-accent" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 text-text-secondary" />
      )}
    </button>
  );
}
