# HS Simply — Retailer Performance Dashboard

A production-grade retailer analytics dashboard for HS Simply Italy, built with **Next.js 14**, **Supabase**, and deployed on **Vercel**.

---

## Features

- 🔐 **Role-based auth** — HS-ADMIN, RSM, ASM with branch-scoped access
- 📊 **17 chart types** — KPIs, YoY, calendar overlays, deductions, plan mix, renewal rates
- 🏆 **Homepage leaderboard** — Top retailers by GA activations per branch
- 📄 **PDF export** — Full retailer report with header, footer, tables and charts
- 👥 **User management** — Add/edit/delete users with role + branch assignment
- 📥 **Data import** — CSV/JSON bulk import for retailers and performance data
- 🔑 **Change password** — Available to all users from avatar menu

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Charts | Recharts |
| PDF Export | jsPDF + jsPDF-AutoTable |
| Backend/DB | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Fonts | Outfit + Fraunces (Google Fonts) |

---

## Branches

| Branch ID | Region |
|---|---|
| LMIT-HS-MILAN | North |
| LMIT-HS-BOLOGNA | North |
| LMIT-HS-TORINO | North |
| LMIT-HS-PADOVA | North |
| LMIT-HS-ROME | South |
| LMIT-HS-NAPLES | South |
| LMIT-HS-PALERMO | South |
| LMIT-HS-BARI | South |

---

## Quick Start

### 1. Set up Supabase database

Run the SQL in `supabase-schema.sql` in your **Supabase SQL Editor**:
- Creates `users`, `retailers`, `retailer_performance` tables
- Inserts a default admin user: **username: `admin` / password: `admin123`** (change after first login!)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` (already included — just verify):
```
NEXT_PUBLIC_SUPABASE_URL=https://xpmwkdzoryhipwfmjrrh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run locally

```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

**Option A — Vercel CLI:**
```bash
npm install -g vercel
vercel --prod
```

**Option B — GitHub + Vercel dashboard:**
1. Push this folder to a GitHub repo
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy!

---

## Supabase Schema

### `users`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| username | TEXT | Unique login name |
| name | TEXT | Display name |
| email | TEXT | Optional |
| role | TEXT | HS-ADMIN / RSM / ASM |
| password | TEXT | Plain text (upgrade to hashed in production) |
| branches | TEXT[] | Array of branch IDs |

### `retailers`
| Column | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| retailer_id | TEXT | Unique business ID |
| name | TEXT | Retailer display name |
| branch | TEXT | One of 8 LMIT-HS-* branches |
| zone | TEXT | Sub-branch zone |

### `retailer_performance`
| Column | Type | Notes |
|---|---|---|
| retailer_id | TEXT | FK → retailers.retailer_id |
| year | INT | 2024 / 2025 / 2026 |
| month | INT | 1–12 |
| ga_activations | INT | |
| new_activations | INT | |
| port_in / port_out | INT | |
| plan_pin_699_below/above | INT | P-IN ≤/> €6.99 |
| plan_new_699_below/above | INT | NEW ≤/> €6.99 |
| incentive_amount | DECIMAL | Gross monthly incentive |
| port_in_incentive | DECIMAL | |
| gara_bonus | DECIMAL | |
| deductions_clawback | DECIMAL | |
| deductions_po | DECIMAL | |
| deductions_renewal | DECIMAL | |
| renewal_rate | DECIMAL | Percentage |

---

## Data Import

Go to **Admin → Data Import** to upload:
- **Retailers CSV**: `retailer_id, name, branch, zone`
- **Performance CSV**: all 18 numeric columns

Download the template CSV from the import page for correct column format.

Uses **upsert** so re-importing the same records updates them rather than duplicating.

---

## Color Scheme

| Token | Hex | Usage |
|---|---|---|
| Primary | `#21264e` | Text, nav, headers |
| Background | `#fff7f2` | Page background |
| Blue | `#006ae0` | 2024, charts, links |
| Green | `#08dc7d` | 2025, success |
| Yellow | `#ffd54f` | 2026, highlights |
| Red | `#f04438` | Deductions, alerts |
| Cyan | `#00d7ff` | Accents |
| Peach | `#ffc8b2` | Soft accents |
| Purple | `#46286e` | P-IN plan slab |

---

## Security Notes

> ⚠️ **Passwords** are currently stored as plain text for simplicity. For production:
> 1. Enable Supabase Auth and replace the custom users table with Supabase Auth users
> 2. Or use bcrypt hashing server-side via a Next.js API route

> ⚠️ **Row Level Security** is disabled on all tables. For production:
> 1. Enable RLS in Supabase
> 2. Write policies that restrict reads/writes per role

---

## Folder Structure

```
retailer-dashboard/
├── app/
│   ├── auth/login/         # Login page
│   ├── dashboard/
│   │   ├── page.tsx        # Home + leaderboard
│   │   ├── reports/        # Retailer selector + full report
│   │   ├── users/          # User management (admin)
│   │   └── import/         # Data import (admin)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── RetailerReport.tsx  # Report orchestrator + PDF export
│   ├── charts/             # 17 individual chart components
│   └── ui/                 # Sidebar, Topbar
├── lib/
│   ├── auth-context.tsx    # Auth provider
│   ├── data.ts             # Supabase data fetching
│   └── supabase.ts         # Supabase client
├── types/index.ts          # TypeScript types + constants
├── supabase-schema.sql     # Run in Supabase SQL Editor
├── vercel.json
└── .env.local
```
