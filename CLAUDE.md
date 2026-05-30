# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # http://localhost:5173
npm run typecheck  # react-router typegen && tsc
npm run build
npm run start      # serve production build
```

No test runner or linter is configured.

## Architecture

React Router 7 in **framework mode** (SSR enabled). Tailwind CSS 4 via Vite plugin — no `tailwind.config.js`, config is done in CSS or via the Vite plugin.

**Routes** (`app/routes.ts`):
- `/` → `routes/home.tsx` — area selection page
- `/reservation/:id` → `routes/reservation.tsx` — checkout/form page with a Route `action`. Accepts `?people=N` for the table reservation (area 3).
- `/minha-reserva/:token` → `routes/my-reservation.tsx` — view, edit (redirect) and cancel a reservation

**Data layer**: There is no backend or database. Area data lives in `mockAreas` inside `reservation.tsx`. When the form is submitted, the `action` POSTs JSON to `WEBHOOK_URL` (an n8n webhook, configured in `.env`). The `WEBHOOK_URL` env var must be set for form submission to work.

## Reservation business logic

`mockAreas` drives everything in the checkout:
- `basePrice` — the reservation fee (400 BRL for areas 1–2, 0 for area 3)
- `calendarId` — Google Calendar ID for the area, sent to n8n to create the event in the correct calendar
- `hasDiscountProducts` — whether the area shows a pre-sale cart that can offset the fee
- `applyExcessToProducts` — if `true`, discount that exceeds `basePrice` carries over and reduces product costs too
- `UPFRONT_FEE` — hardcoded R$50 for all areas **except** "Reserva de Mesa" (id=3, which has `basePrice: 0`)

Discount calculation order: cart products generate a `discountValue`; this is capped at `basePrice` to get `actualDiscountValue`; if `applyExcessToProducts`, the remainder reduces `productsTotal`.

## Design tokens

| Token | Value | Role |
|---|---|---|
| `#1a261e` | dark green | page background |
| `#283e31` | medium green | cards |
| `#006b3e` | forest green | header |
| `#ffcc29` | yellow | accent, CTAs |

Glassmorphism (backdrop-blur + transparency) and scroll-driven header effects are used on the home page. All styling is via inline Tailwind classes.

## Types

Route types are auto-generated into `.react-router/types/` by `react-router typegen`. Import them as `import type { Route } from "./+types/<route-name>"`.

## Deployment

Multi-stage Dockerfile is the expected production deployment path. Build output is self-contained in `build/`; the runtime stage runs `npm start` which calls `react-router-serve`.
