# DólarGT 💵

Real-time USD → GTQ (US Dollar to Guatemalan Quetzal) exchange rate tracker. Pulls buy/sell rates from Guatemalan banks, shows a 30-day historic chart from Banco de Guatemala, and includes a currency converter.

Live at: https://dolar.luislocon.dev

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Recharts (historic chart), Framer Motion (animations)
- pnpm

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Command       | Description                  |
| ------------- | ---------------------------- |
| `pnpm dev`    | Start the dev server         |
| `pnpm build`  | Production build             |
| `pnpm start`  | Serve the production build   |
| `pnpm lint`   | Run ESLint                   |

## Project structure

```
src/
├── app/
│   ├── api/exchange/route.ts   # Live bank rates (cached 60s via headers)
│   ├── api/historic/route.ts   # 30-day historic rates (Banco de Guatemala)
│   ├── sitemap.ts              # SEO sitemap
│   └── page.tsx                # Main tracker page
├── components/
│   ├── ModernDollarTracker.tsx # Main page component
│   ├── StructuredData.tsx      # JSON-LD structured data
│   ├── LocalSEO.tsx / SEOFooter.tsx
│   └── ui/                     # shadcn/ui primitives
└── hooks/useFetch.ts           # Data fetching hooks
```

## Notes

- SEO landing paths listed in `sitemap.ts` (e.g. `/dolar-hoy-guatemala`,
  `/tasa-cambio/:bank`) are rewritten to `/` in `next.config.mjs` until
  dedicated pages exist.
- Build script approvals for `sharp` / `unrs-resolver` are recorded in
  `pnpm-workspace.yaml` (`allowBuilds`).
