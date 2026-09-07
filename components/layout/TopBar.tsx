"use client";

import React from "react";
import Link from "next/link";
import { GeographySelector } from "@/components/geography/GeographySelector";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Search } from "lucide-react";

interface TopBarProps {
  onSearchClick?: () => void;
  className?: string;
}

export function TopBar({ onSearchClick, className = "" }: TopBarProps) {
  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-md transition-colors duration-150 ${className}`}
    >
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/"
            aria-label="Perfect Calendar Home"
            className="flex items-center gap-2 group outline-none"
          >
            <div className="w-7 h-7 rounded-control bg-text-primary flex items-center justify-center text-bg font-serif font-bold text-sm shadow-subtle group-hover:scale-105 transition-transform duration-150 shrink-0">
              P
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-text-primary">
                <span>Perfect</span>
                <span className="hidden xs:inline sm:inline"> Calendar</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-text-tertiary px-1 py-0.5 rounded-[4px] bg-border-subtle hidden md:inline">
                v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Indian State / UT Selector */}
        <div className="flex items-center justify-center min-w-0">
          <GeographySelector />
        </div>

        {/* Right: Search Placeholder & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            type="button"
            id="quick-search-btn"
            onClick={onSearchClick}
            aria-label="Search dates, people, and events (Cmd+K)"
            className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-control border border-border bg-surface-elevated text-xs text-text-tertiary hover:border-text-secondary hover:text-text-primary transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-text-tertiary" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded-[4px] bg-surface border border-border text-text-tertiary">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle (Light/White ↔ Dark) */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
