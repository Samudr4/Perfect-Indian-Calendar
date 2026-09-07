<div align="center">

# 🗓️ Perfect Calendar

**Every date has a story.**

A precision Indian calendar web application engineered with restraint, clarity, and modern luxury aesthetics — bridging daily productivity with India's rich historical, cultural, and regional heritage.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

</div>

---

## ✨ Overview

Traditional Indian calendar and panchang websites are often cluttered, advertisement-heavy, and visually dated. **Perfect Calendar** reimagines the experience from first principles: a calm, spacious, and editorially trustworthy software product inspired by the minimalism of Apple and Linear, paired with an authentic Haute Horlogerie chronometer.

Whether exploring historical milestones in Assam, browsing birth/death anniversaries across 36 Indian states and union territories, or scheduling across dynamic month, week, day, and year timelines — **Perfect Calendar** provides an unmatched personal calendaring experience.

---

## 🌟 Key Features

### 📅 Multi-Scale Calendar Engine
- **Month Grid**: Wide central canvas with crisp delineation, bold typography, content indicators, and prominent prototype date highlighting.
- **Week Matrix**: 7-column hourly schedule matrix with time markers and anniversary observances.
- **Day Timeline**: 24-hour detailed breakdown for single-date focus.
- **Year Matrix**: 12-month bird's-eye overview with 1-click month navigation and date drill-down.

### 🧭 36 Indian States & Union Territories
- Instant geography switcher supporting all 28 Indian States and 8 Union Territories (defaulting to **Assam**).
- Dynamic local-language script representation (e.g., *Assam (অসম)*, *Punjab (ਪੰਜਾਬ)*, *Odisha (ଓଡ଼ିଶା)*).
- Searchable command palette with keyboard navigation support (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`).

### ⌚ Precision Chronometer & Haute Horlogerie Analog Dial
- **IST Synchronization**: Real-time India Standard Time (UTC+5:30) with pulse live indicator.
- **Haute Horlogerie Analog Dial**: Crafted with SVG precision featuring a stepped fluted bezel, *chemin de fer* (railway minute track), applied Roman numerals, signature Mercedes hour hand, syringe minute hand, and a lollipop sweeping seconds hand.
- **High-Visibility Digital Clock**: Crisp monospace display with 12-hour AM/PM badge and uppercase calendar day badge.

### 📖 Editorial Timeline Categories
Every date panel is organized into clean, structured editorial cards:
- 🎂 **Born**: Notable births across literature, science, art, statesmanship, and public life.
- 🕯️ **Remembered**: Death anniversaries and lasting legacies.
- 🏛️ **History**: Regional and national milestones, statehood days, and historical turning points.
- 🎭 **Culture**: Regional festivals, folk celebrations, and literary observances.

### 🌓 High-Visibility Theming & Native Mobile UX
- **High-Contrast Light Mode**: Cool slate canvas (`#eef1f5`) paired with pure white cards and razor-sharp borders (`#cbd5e1`) to eliminate washed-out screens.
- **Midnight Dark Mode**: Deep obsidian surfaces (`#131416`) with subtle metallic accents.
- **Mobile First**:
  - Touch-tuned cells (`min-h-[56px]`) with compact indicator dots.
  - Native slide-up bottom sheet for seamless date inspection on mobile.
  - Fixed bottom navigation bar with iOS safe-area support (`env(safe-area-inset-bottom)`).
  - Responsive analog clock toggle to keep mobile views fast and compact.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Inter & Classic Serif Display

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 18.18.0` (Node 20+ or 22+ recommended)
- [npm](https://www.npmjs.com/) `>= 9.0.0`

### Installation

```bash
# Clone the repository
git clone https://github.com/Samudr4/Perfect-Indian-Calendar.git
cd Perfect-Indian-Calendar/V1

# Install dependencies
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Quality Verification

```bash
# Run TypeScript type verification
npm run typecheck

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## 📂 Project Architecture

```
perfect-calendar/
├── app/                                 # Next.js App Router root layout & page
├── components/                          # Reusable modular UI components
│   ├── calendar/                        # MonthGrid, CalendarDay, WeekView, DayView, YearView
│   ├── clock/                           # AnalogClock, ClockModule (Digital + Analog Chrono)
│   ├── date-details/                    # DateDetailsPanel & Category Cards
│   ├── geography/                       # GeographySelector (36 Indian States/UTs)
│   ├── layout/                          # AppShell, TopBar, Header
│   └── theme/                           # ThemeToggle (Light/Dark mode)
├── data/                                # Indian geography dataset (States & UTs)
├── lib/                                 # Calendar algorithms, math utilities & theme context
└── styles/                              # Tailwind base & CSS token definitions
```

---

## 🗺️ Product Roadmap

- [x] **Phase 1: Foundation & Visual Shell** (Wide calendar, IST chronometer, 36 Indian states/UTs, 4 views)
- [x] **Phase 2: High-Visibility Theming & Mobile UX** (Crisp white mode, touch bottom sheet, safe-area navigation)
- [ ] **Phase 3: Curated Assam & All-India Historical Dataset** (Verified historical records, birth/death milestones)
- [ ] **Phase 4: Instant Search (Cmd+K)** (Fuzzy lookup across dates, personalities, and historical events)
- [ ] **Phase 5: Dedicated Person & Event Dossiers** (Deep dive editorial pages with source citations)
- [ ] **Phase 6: ICS Export & `webcal://` Subscriptions** (Syncing curated Indian anniversaries to Apple/Google calendars)

---

## 📜 Editorial Principles

1. **Factual Neutrality**: Historical and cultural entries are sourced from verified state archives, gazettes, and academic literature.
2. **Restraint Over Clutter**: No popups, no distracting advertisements, and no sensationalism.
3. **Regional Respect**: Accurate native typography and cultural celebration timings for all Indian states and communities.

---

## 📄 License

This project is licensed under the MIT License. Built with pride for India's rich history and timeless stories.
