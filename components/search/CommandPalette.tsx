"use client";

import React, { useState, useEffect, useRef } from "react";
import { searchCalendarRecords, SearchResultItem } from "@/lib/calendar/entry-resolver";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { Search, X, Calendar as CalendarIcon, ArrowRight, User, Landmark, Sparkles } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (isoDate: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectDate }: CommandPaletteProps) {
  const { selectedStateId } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults(searchCalendarRecords("", selectedStateId));
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, selectedStateId]);

  // Update results as query changes
  useEffect(() => {
    if (!isOpen) return;
    const res = searchCalendarRecords(query, selectedStateId);
    setResults(res);
    setSelectedIndex(0);
  }, [query, isOpen, selectedStateId]);

  // Global keydown listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent if wired, or handled here
        }
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Palette navigation key handler
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        onSelectDate(selected.targetIsoDate);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Calendar Records"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-slate-50 dark:bg-zinc-900/60">
          <Search className="w-5 h-5 text-today shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search personalities, battles, anniversaries, festivals... (e.g. Bhupen, Bihu, Saraighat)"
            className="w-full bg-transparent text-sm sm:text-base font-medium text-text-primary placeholder:text-text-tertiary outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded text-text-tertiary hover:text-text-primary ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-mono text-text-secondary">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-border-subtle max-h-[60vh]">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isCurrent = idx === selectedIndex;
              return (
                <div
                  key={`${item.id}-${item.targetIsoDate}`}
                  onClick={() => {
                    onSelectDate(item.targetIsoDate);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-control cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                    isCurrent
                      ? "bg-today-soft border border-today/40"
                      : "hover:bg-slate-50 dark:hover:bg-zinc-800/40 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 p-2 rounded-control bg-surface border border-border-subtle shrink-0">
                      {item.kind === "Person" ? (
                        <User className="w-4 h-4 text-today" />
                      ) : item.kind === "Festival" ? (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Landmark className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary truncate">
                          {item.title}
                        </span>
                        {item.nativeTitle && (
                          <span className="text-xs text-today font-medium hidden sm:inline">
                            {item.nativeTitle}
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-surface border border-border-subtle text-text-secondary">
                          {item.kind}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono font-semibold text-text-secondary">
                    <CalendarIcon className="w-3.5 h-3.5 text-today" />
                    <span>{item.targetIsoDate}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary ml-1" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-text-secondary">
              <p className="text-sm font-semibold text-text-primary">No records found</p>
              <p className="text-xs text-text-tertiary mt-1">
                Try searching for personal names like &quot;Bhupen&quot;, &quot;Lachit&quot;, &quot;Tagore&quot;, or events like &quot;Bihu&quot;, &quot;Saraighat&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-border bg-slate-50 dark:bg-zinc-900/60 flex items-center justify-between text-[11px] text-text-secondary">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="font-mono px-1 border rounded bg-surface">↑</kbd> <kbd className="font-mono px-1 border rounded bg-surface">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono px-1 border rounded bg-surface">Enter</kbd> to jump
            </span>
          </div>
          <span>{results.length} records available</span>
        </div>
      </div>
    </div>
  );
}
