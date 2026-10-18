# CLAUDE.md

> This file stacks on top of the workspace root at `C:\Code\GitHub\`:
> - Root [`CLAUDE.md`](../../CLAUDE.md) -- voice, rules, routing map, references, skills, slash commands, conventions.
> - Root [`MEMORY.md`](../../MEMORY.md) -- live facts across repos.
> - Root [`STATUS.md`](../../STATUS.md) -- live PR/CI/security dashboard.
> - [`.claude/resources/`](../../.claude/resources/README.md) -- deep reference for collaboration, workflow, git, OSS, debugging, voice.
>
> Read those first. The guidance below only adds **repo-specific context** -- it does not override anything in the root.

## Project

BrainstormVerse -- an idea-sharing platform (Threads-style feed): sign in with Clerk, complete onboarding, post ideas, upvote them (Hot/New/Top feed), reply in threads, browse profiles, activity and search.

No deploy config in the repo (no vercel.json); runs locally only. README has a Deploy with Vercel clone button, but nothing is deployed. CI is `.github/workflows/ci.yml` (`npm ci --ignore-scripts`, lint, build on Node 24) plus CodeQL default setup and Renovate.

## Stack

- **Language**: TypeScript 6.0 (typescript-eslint caps it below 6.1, so no TS 7 yet)
- **Framework**: Next.js 16 (App Router, server actions)
- **Database**: MongoDB via Mongoose 9
- **Styling**: Tailwind CSS v4 (CSS-first config in `app/globals.css`) + shadcn/ui (Radix primitives), tailwind-merge v3
- **Auth**: Clerk (@clerk/nextjs v7)
- **Uploads**: UploadThing v7
- **Package manager**: npm (package-lock.json checked in)
- **Deploy target**: none configured; local-only

## Run

```
npm install
npm run demo       # no keys needed: in-memory MongoDB, seeded, demo mode, http://localhost:3000
npm run dev        # http://localhost:3000, needs .env.local
npm run seed       # load the demo dataset into MONGODB_URL (only touches seed_* users and the demo visitor)
npm run screenshots -- http://localhost:3000   # README screenshots into docs/screenshots/
npm run build
```

## Test

No test suite. `npm run demo` is the way to exercise features at runtime. Quality gates are `npm run lint` (ESLint), `npx tsc --noEmit`, and `npm run build`; `npm run format` runs Prettier.

## Entry points

- `app/(root)/page.tsx` -- home feed
- `app/(root)/create-idea/page.tsx` -- post an idea
- `app/(root)/idea/[id]/page.tsx` -- idea thread with replies
- `app/(root)/profile/[id]/page.tsx`, `profile/edit`, `profile/page.tsx` (redirect to own) -- profiles
- `app/(root)/activity/page.tsx`, `app/(root)/search/page.tsx`
- `app/api/webhook/clerk/route.ts` -- Clerk `user.deleted` webhook, signature checked with `verifyWebhook`
- `app/(auth)/onboarding/page.tsx` -- profile setup after sign-up
- `app/api/uploadthing/route.ts` + `core.ts` -- file-upload endpoint
- `proxy.ts` -- Clerk auth gate (`clerkMiddleware`); Next.js 16 renamed the `middleware` file convention to `proxy`

## Key files

- `lib/actions/idea.action.ts`, `lib/actions/user.action.ts` -- server actions; all DB writes go through these
- `lib/models/idea.model.ts`, `lib/models/user.model.ts`, `lib/models/vote.model.ts` -- Mongoose schemas (source of truth for data shape); Vote has a unique `(idea, user)` index
- `lib/session.ts` -- the only place that reads the session (Clerk `auth()` or the demo visitor); use it instead of calling Clerk directly
- `lib/ranking.ts` -- Hot score, both in TS and as the aggregation expression the feed uses
- `lib/user-cleanup.ts` -- webhook cleanup; deliberately not a `"use server"` file so it is not a public action
- `scripts/seed-data.ts` -- the demo dataset; `scripts/demo.ts` wires it to mongodb-memory-server-core
- `lib/mongoose.ts` -- cached DB connection helper; every action calls it first
- `lib/validations/` -- Zod schemas backing the react-hook-form forms

## Gotchas

- Requires `.env.local` with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URL`, `UPLOADTHING_TOKEN` (see `.env.example`). The build succeeds without them, but auth/DB/uploads fail at runtime.
- `/api/webhook/clerk` needs `CLERK_WEBHOOK_SIGNING_SECRET`; without it every call returns 400.
- Every export of a `"use server"` file is a public endpoint. Keep privileged helpers (like `deleteUserData`) in plain modules.
- Demo mode (`NEXT_PUBLIC_DEMO_MODE=true`) bypasses Clerk entirely; anyone hitting a demo deployment is the shared Demo Visitor.
- `next dev` writes an `AGENTS.md` into the repo root; it is not tracked, delete it.
- Node pinned by `.nvmrc` (24), matching CI.
- `/communities` has no page yet (404); the profile "Tagged" tab is not rendered.
- `.editorconfig` is 2-space to match the code; it was 3-space before 1.4.0, which made Prettier reflow whole files.
- Server actions must `await connectToDB()`; the helper sets an `isConnected` flag only after the connect resolves.

## Repo-specific rules

- Use npm here, not pnpm -- `package-lock.json` is the committed lockfile.

## Routes / Pages

- `/` -- idea feed (public)
- `/?sort=hot|new|top` -- feed order (Hot is the default)
- `/idea/[id]`, `/profile/[id]`, `/search` -- public to read
- `/create-idea`, `/activity`, `/profile`, `/profile/edit` -- auth required
- `/onboarding`, `/sign-in`, `/sign-up` -- Clerk auth flow under `app/(auth)/`

## Auth

- Clerk session auth; `proxy.ts` protects everything except `/`, `/idea/*`, `/profile/*`, `/search`, `/sign-in`, `/sign-up` and `/api/webhook/clerk` (pages and actions re-check through `lib/session.ts`)
- Clerk user is mirrored into MongoDB via `lib/actions/user.action.ts` during onboarding
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
