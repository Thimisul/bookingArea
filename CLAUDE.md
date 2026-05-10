# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server with HMR
npm run build      # Production build (outputs to build/client/ and build/server/)
npm start          # Run production server (react-router-serve)
npm run typecheck  # Type-check without emitting files
```

No test runner or linter is configured.

## Architecture

**React Router v7 (SSR)** — full-stack framework with server-side rendering enabled. Routes are declared in `app/routes.ts` and map to files in `app/routes/`.

### Routes

- `/` (`home.tsx`) — Landing page listing the three bookable venues (two BBQ areas + table reservation). Drives navigation to the reservation flow.
- `/reservation/:id` (`reservation.tsx`) — Checkout page. Accepts `?people=N` for the table reservation (area 3). Handles cart state, pricing/discount logic, and form submission via a React Router server action.

### Key data flow

The reservation route's **server action** POSTs form data to `process.env.WEBHOOK_URL`. This is the only backend integration point — there is no local database or API layer. The `WEBHOOK_URL` env var must be set for form submission to work.

### Pricing / discount logic

Lives entirely in `reservation.tsx`. Each area has:
- A base reservation fee (400 BRL for areas 1–2, 0 for area 3)
- A configurable upfront deposit (`upfrontFee`, 50 BRL for areas 1–2)
- A list of pre-sold products with individual discount percentages
- An "excess discount" that cascades leftover discounts across products

A product with 100% discount means its full price is credited against the reservation fee; partial discounts apply proportionally. This logic is tightly coupled to the hardcoded area data in the same file.

### Styling

TailwindCSS v4 with a custom brand palette used throughout:
- `#1a261e` — primary dark green (backgrounds)
- `#283e31` — secondary dark green
- `#006b3e` — medium green (accents)
- `#ffcc29` — yellow/gold (highlights, CTAs)

Glassmorphism (backdrop-blur + transparency) and scroll-driven header effects are used on the home page. All styling is via inline Tailwind classes — no separate CSS modules or styled-components.

## Deployment

Multi-stage Dockerfile is the expected production deployment path. Build output is self-contained in `build/`; the runtime stage runs `npm start` which calls `react-router-serve`.
