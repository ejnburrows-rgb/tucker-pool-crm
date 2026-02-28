# R&D Pool Services – Tucker Pool CRM Landing Page

A premium, animated landing page for **Tucker Pool CRM** — the bilingual CRM built for pool service teams. Manage clients, schedules, payments, and reminders — all in English y Español.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## ✨ Features

- **Scroll-driven GSAP animations** — pinned hero, parallax feature cards, staggered reveals
- **8 feature showcase sections** — Bilingual, Schedule, Work Orders, Payments, Overdue, Backups, Reminders, Reports
- **Pricing tiers** with interactive dialog modals
- **FAQ accordion** powered by Radix UI
- **Contact/Demo form** with success state
- **Fully responsive** — mobile-first design with glassmorphism cards
- **Dark mode design** with custom scrollbar, vignette, and grain effects
- **shadcn/ui component library** — 40+ pre-built components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 7 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Animation | GSAP + ScrollTrigger |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

## 📁 Project Structure

```
src/
├── components/       # Navigation + 40+ shadcn/ui components
│   ├── Navigation.tsx
│   └── ui/           # shadcn/ui primitives
├── sections/         # Page sections
│   ├── HeroSection.tsx
│   ├── FeatureSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── PricingSection.tsx
│   ├── FAQSection.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
├── hooks/            # Custom React hooks
├── lib/              # Utilities (cn helper)
├── App.tsx           # Root component
├── App.css           # App-specific styles
├── index.css         # Global styles + design tokens
└── main.tsx          # Entry point
```

## 📄 License

© 2026 R&D Pool Services. All rights reserved.

Powered by **NBO**.
