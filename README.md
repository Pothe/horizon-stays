# Horizon Stays — Hotel & Resort Booking App

A guest-facing hotel/resort booking site built with **Next.js (App Router)** and
**Supabase** (auth + Postgres database). Guests reserve a room online and pay
**in person at check-in** — there's no online payment processor in this flow.

## Features

- Browse multiple properties (hotels/resorts), each with multiple room types
- Date-range booking with live availability checking (no overbooking)
- Reservations confirm immediately — payment is collected at check-in by staff
- Magic-link (passwordless) authentication via Supabase
- "My Bookings" page showing reservation + payment status
- Guest reviews & ratings per property
- Row Level Security so users can only see/manage their own data

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, go to **SQL Editor** and run the two files in
   `supabase/migrations/` **in order**:
   - `0001_init.sql` — creates all tables, RLS policies, and functions
   - `0002_seed.sql` — adds 3 demo properties with rooms (optional but recommended for testing)
3. Go to **Project Settings > API** and copy:
   - `Project URL`
   - `anon public` key

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the two Supabase values from step 1.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Project structure

```
src/
  app/
    page.tsx                     Home page — property listings
    properties/[slug]/page.tsx   Property detail, room types, reviews
    login/page.tsx               Magic-link sign in
    auth/callback/route.ts       Supabase auth callback
    bookings/page.tsx            "My Bookings" (auth required)
    booking/success/page.tsx     Post-reservation confirmation
    api/bookings/route.ts        Creates a confirmed reservation (checks availability)
  components/                    UI components
  lib/supabase/                  Browser, server & middleware clients
  types/database.ts              TypeScript types matching the DB schema
supabase/migrations/             SQL schema + seed data
```

## How booking works

1. Guest picks dates + guest count and submits the form.
2. `/api/bookings` checks live availability via the `rooms_booked_count`
   Postgres function, then inserts a `bookings` row with
   `status = 'confirmed'` and `payment_status = 'unpaid'`.
3. The room is held from that point on — nobody else can double-book it for
   overlapping dates.
4. At check-in, staff collect payment and update `payment_status` to `'paid'`
   (e.g. from an admin dashboard you build, or directly in the Supabase
   Table Editor for now).

## Next steps / ideas to extend

- Add a staff/admin view to manage bookings and mark `payment_status = 'paid'`
  at check-in — restrict via a `role` column on `profiles`.
- Add a cancellation flow.
- Add search/filter by city, date range, and price on the home page.
- Add email confirmations (Supabase + Resend).
- Swap demo Unsplash images for your real property photos (use Supabase Storage).
- If you want online payment later, Stripe Checkout integrates cleanly with
  this same `bookings` table — add back a payment step before the row is
  marked `confirmed`.

## Deploying

This app deploys cleanly to **Vercel**:

1. Push this project to a GitHub repo.
2. Import it in Vercel, add the same environment variables from `.env.local`.
