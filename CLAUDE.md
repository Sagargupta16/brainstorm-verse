# CLAUDE.md

> This file stacks on top of the workspace root at `C:\Code\GitHub\`:
> - Root [`CLAUDE.md`](../../CLAUDE.md) -- voice, rules, routing map, references, skills, slash commands, conventions.
> - Root [`MEMORY.md`](../../MEMORY.md) -- live facts across repos.
> - Root [`STATUS.md`](../../STATUS.md) -- live PR/CI/security dashboard.
> - [`.claude/resources/`](../../.claude/resources/README.md) -- deep reference for collaboration, workflow, git, OSS, debugging, voice.
>
> Read those first. The guidance below only adds **repo-specific context** -- it does not override anything in the root.

## Project

BrainstormVerse -- an idea-sharing platform (Threads-style feed): sign in with Clerk, complete onboarding, post ideas, browse the community feed.

No deploy config in the repo (no vercel.json, no CI workflows); runs locally only.

## Stack

- **Language**: TypeScript 5.9
- **Framework**: Next.js 16 (App Router, server actions)
- **Database**: MongoDB via Mongoose 8
- **Styling**: TailwindCSS 3.4 + shadcn/ui (Radix primitives)
- **Auth**: Clerk (@clerk/nextjs v5)
- **Uploads**: UploadThing v6
- **Package manager**: npm (package-lock.json checked in)
- **Deploy target**: none configured; local-only

## Run

```
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Test

No test suite. Quality gates are `npm run lint` (ESLint) and `npm run format` (Prettier).

## Entry points

- `app/(root)/page.tsx` -- home feed
- `app/(root)/create-idea/page.tsx` -- post an idea
- `app/(auth)/onboarding/page.tsx` -- profile setup after sign-up
- `app/api/uploadthing/route.ts` + `core.ts` -- file-upload endpoint
- `middleware.ts` -- Clerk auth gate for all routes

## Key files

- `lib/actions/idea.action.ts`, `lib/actions/user.action.ts` -- server actions; all DB writes go through these
- `lib/models/idea.model.ts`, `lib/models/user.model.ts` -- Mongoose schemas (source of truth for data shape)
- `lib/mongoose.ts` -- cached DB connection helper; every action calls it first
- `lib/validations/` -- Zod schemas backing the react-hook-form forms

## Gotchas

- Requires `.env.local` with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URL`, `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` (see `.env.example`). Dev server starts without them but auth/DB/uploads fail at runtime.
- `middleware.ts` uses Clerk's legacy `authMiddleware` API (deprecated in v5, removed in v6) -- migrate to `clerkMiddleware` before any Clerk upgrade.
- Middleware whitelists `/api/webhook/clerk`, but no such route exists in `app/api/` -- the `svix` dependency is for that unbuilt webhook handler.
- Node pinned by `.nvmrc` (19); README requires 20.9+ -- the pin lags the documented requirement.

## Repo-specific rules

- Use npm here, not pnpm -- `package-lock.json` is the committed lockfile.

## Routes / Pages

- `/` -- idea feed (public)
- `/create-idea` -- new idea form (auth required)
- `/onboarding`, `/sign-in`, `/sign-up` -- Clerk auth flow under `app/(auth)/`

## Auth

- Clerk session auth; `middleware.ts` protects everything except `/` and `/api/webhook/clerk`
- Clerk user is mirrored into MongoDB via `lib/actions/user.action.ts` during onboarding
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
