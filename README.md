# StockFlow — 6-Hour MVP

A minimal multi-tenant inventory management app: sign up, add products, see
a dashboard with low-stock alerts. Built with Next.js (App Router), Prisma,
and PostgreSQL.

## Stack
- Next.js 14 (App Router, Server Actions)
- PostgreSQL + Prisma
- Session auth via signed JWT in an httpOnly cookie (bcrypt for password hashing)
- Tailwind CSS

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — a Postgres connection string (see step 2 for a free one)
- `SESSION_SECRET` — any long random string, e.g. generate with `openssl rand -base64 32`

Push the schema to your database (no migration files needed for an MVP):

```bash
npm run db:push
```

Run it:

```bash
npm run dev
```

Visit http://localhost:3000 — it'll redirect you to `/signup`.

## 2. Get a free Postgres database (Neon)

1. Go to https://neon.tech → sign up (free tier is enough)
2. Create a project
3. Copy the connection string it gives you (starts with `postgresql://...`,
   make sure `?sslmode=require` is included)
4. Paste it into `.env` as `DATABASE_URL`

Neon integrates natively with Vercel too — when you import the project on
Vercel you can add the Neon integration from the marketplace and it fills
in `DATABASE_URL` for you automatically.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: StockFlow MVP scaffold"
```

Create a **public** repo on GitHub (required by the assessment instructions),
then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

From here on, commit as you go (after each feature/fix) rather than in one
final commit — the assessment explicitly says commit history is reviewed.

## 4. Deploy to Vercel

1. Go to https://vercel.com → "Add New Project" → import your GitHub repo
2. Add environment variables in the Vercel project settings:
   - `DATABASE_URL`
   - `SESSION_SECRET`
3. Deploy. Vercel auto-detects Next.js — no extra config needed.
4. After the first deploy, if you haven't already run `db:push` against
   that same database, run it once locally (pointed at the same
   `DATABASE_URL`) so the tables exist:
   ```bash
   npm run db:push
   ```

You'll get a live URL like `https://your-project.vercel.app`.

## 5. What to send back

Per the assessment instructions:
- **Before starting:** email your confirmed start time + your public GitHub repo link
- **After finishing:** email the final GitHub link + the live Vercel URL

## Project structure

```
app/
  actions/          Server actions (auth, products, settings — all mutations)
  login/, signup/   Auth pages
  dashboard/        Summary + low-stock table
  products/         List (search, inline +/- stock, delete), new, [id]/edit
  settings/         Default low-stock threshold
components/         Shared NavBar, ProductForm
lib/
  auth.ts           Session (JWT cookie) + password hashing
  prisma.ts         Prisma client singleton
middleware.ts       Route protection (redirects unauth'd users to /login)
prisma/schema.prisma
```

## Notes on scope

This intentionally matches the PRD's reduced MVP scope: single-role user per
org, no invites/RBAC, no CSV import, no billing, no movement history beyond
`lastUpdatedBy`. All data is scoped by `organizationId` so there's no
cross-tenant leakage.
