"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "./theme-config";
import { DEFAULT_GEOGRAPHY_ID } from "@/data/geographies";

interface ThemeContextType {
  appearance: Appearance;
  selectedStateId: string;
  toggleAppearance: () => void;
  setAppearance: (mode: Appearance) => void;
  setSelectedStateId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const APPEARANCE_KEY = "perfect-calendar-appearance";
const STATE_KEY = "perfect-calendar-state";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>("light");
  const [selectedStateId, setSelectedStateIdState] = useState<string>(DEFAULT_GEOGRAPHY_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted or system preference
    const savedAppearance = localStorage.getItem(APPEARANCE_KEY) as Appearance | null;
    const savedState = localStorage.getItem(STATE_KEY);

    let initialAppearance: Appearance = "light";
    if (savedAppearance === "light" || savedAppearance === "dark") {
      initialAppearance = savedAppearance;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialAppearance = "dark";
    }

    const initialState = savedState || DEFAULT_GEOGRAPHY_ID;

    setAppearanceState(initialAppearance);
    setSelectedStateIdState(initialState);

    // Apply attributes immediately to document element
    document.documentElement.setAttribute("data-theme", initialAppearance);
    if (initialAppearance === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  const setAppearance = (mode: Appearance) => {
    setAppearanceState(mode);
    try {
      localStorage.setItem(APPEARANCE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.setAttribute("data-theme", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleAppearance = () => {
    setAppearance(appearance === "light" ? "dark" : "light");
  };

  const setSelectedStateId = (id: string) => {
    setSelectedStateIdState(id);
    try {
      localStorage.setItem(STATE_KEY, id);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        selectedStateId,
        toggleAppearance,
        setAppearance,
        setSelectedStateId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
