"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/themes/ThemeProvider";
import { INDIAN_GEOGRAPHIES, getGeographyById } from "@/data/geographies";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";

interface GeographySelectorProps {
  className?: string;
}

export function GeographySelector({ className = "" }: GeographySelectorProps) {
  const { selectedStateId, setSelectedStateId } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentState = getGeographyById(selectedStateId);

  const filteredStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return INDIAN_GEOGRAPHIES;
    return INDIAN_GEOGRAPHIES.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        (g.nativeName && g.nativeName.toLowerCase().includes(q)) ||
        g.code.toLowerCase().includes(q) ||
        (g.capital && g.capital.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredStates.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredStates.length) % Math.max(1, filteredStates.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredStates[activeIndex]) {
        selectState(filteredStates[activeIndex].id);
      }
    }
  };

  const selectState = (id: string) => {
    setSelectedStateId(id);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        id="geography-selector-btn"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current state: ${currentState.name}. Select Indian State or Territory`}
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-control text-sm font-semibold bg-slate-50 dark:bg-surface border border-border text-text-primary hover:border-text-secondary hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary transition-all duration-150"
      >
        <MapPin className="w-3.5 h-3.5 text-text-secondary opacity-85 transition-transform group-hover:scale-110" />
        <span className="tracking-tight font-medium">{currentState.name}</span>
        {currentState.nativeName && (
          <span className="text-xs text-text-tertiary font-normal hidden sm:inline">
            ({currentState.nativeName})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-text-primary" : ""
          }`}
        />
      </button>

      {/* Popover / Searchable Command Menu */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            role="listbox"
            id="geography-listbox"
            aria-label="Indian States and Union Territories"
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 sm:top-full sm:mt-1.5 w-auto sm:w-80 rounded-card bg-surface border border-border shadow-popover z-50 p-2 animate-in fade-in zoom-in-95 duration-100 max-h-[80vh] flex flex-col"
          >
          {/* Search Header */}
          <div className="relative mb-2 px-2 pt-1 pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2 text-text-tertiary">
              <Search className="w-4 h-4 text-text-tertiary shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                id="geography-search-input"
                placeholder="Search Indian states, UTs, or codes..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(0);
                }}
                className="w-full bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold tracking-wider text-text-tertiary uppercase">
            <span>Select Indian State / Territory</span>
            <span className="font-mono text-[10px]">{filteredStates.length} items</span>
          </div>

          {/* Scrollable State List */}
          <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
            {filteredStates.length === 0 ? (
              <div className="px-3 py-4 text-xs text-text-tertiary text-center">
                No Indian state or territory matches &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredStates.map((geo, index) => {
                const isSelected = geo.id === selectedStateId;
                const isFocused = index === activeIndex;
                return (
                  <button
                    key={geo.id}
                    type="button"
                    role="option"
                    id={`geography-option-${geo.id}`}
                    aria-selected={isSelected}
                    onClick={() => selectState(geo.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-control text-xs transition-colors duration-100 ${
                      isSelected
                        ? "bg-accent-soft text-text-primary font-semibold"
                        : isFocused
                        ? "bg-surface-elevated text-text-primary"
                        : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={isSelected ? "font-semibold" : ""}>{geo.name}</span>
                        {geo.nativeName && (
                          <span className="text-[11px] text-text-tertiary font-normal">
                            {geo.nativeName}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-tertiary">
                        {geo.code}
                        {geo.capital ? ` · Capital: ${geo.capital}` : ""}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-text-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
