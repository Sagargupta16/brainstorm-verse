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

No deploy config in the repo (no vercel.json); runs locally only. CI is `.github/workflows/ci.yml` (`npm ci --ignore-scripts`, lint, build on Node 24) plus CodeQL default setup and Renovate.

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
npm run dev        # http://localhost:3000
npm run build
```

## Test

No test suite. Quality gates are `npm run lint` (ESLint), `npx tsc --noEmit`, and `npm run build`; `npm run format` runs Prettier.

## Entry points

- `app/(root)/page.tsx` -- home feed
- `app/(root)/create-idea/page.tsx` -- post an idea
- `app/(auth)/onboarding/page.tsx` -- profile setup after sign-up
- `app/api/uploadthing/route.ts` + `core.ts` -- file-upload endpoint
- `proxy.ts` -- Clerk auth gate (`clerkMiddleware`); Next.js 16 renamed the `middleware` file convention to `proxy`

## Key files

- `lib/actions/idea.action.ts`, `lib/actions/user.action.ts` -- server actions; all DB writes go through these
- `lib/models/idea.model.ts`, `lib/models/user.model.ts` -- Mongoose schemas (source of truth for data shape)
- `lib/mongoose.ts` -- cached DB connection helper; every action calls it first
- `lib/validations/` -- Zod schemas backing the react-hook-form forms

## Gotchas

- Requires `.env.local` with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `MONGODB_URL`, `UPLOADTHING_TOKEN` (see `.env.example`). The build succeeds without them, but auth/DB/uploads fail at runtime.
- `proxy.ts` whitelists `/api/webhook/clerk`, but no such route exists in `app/api/`; `svix` was removed in 1.4.0 since nothing used it.
- Node pinned by `.nvmrc` (24), matching CI.
- Sidebar and bottom-bar links to `/search`, `/activity`, `/communities`, `/profile` and the card links to `/idea/[id]` and `/profile/[id]` have no pages yet (404).
- `.editorconfig` is 2-space to match the code; it was 3-space before 1.4.0, which made Prettier reflow whole files.
- Server actions must `await connectToDB()`; the helper sets an `isConnected` flag only after the connect resolves.

## Repo-specific rules

- Use npm here, not pnpm -- `package-lock.json` is the committed lockfile.

## Routes / Pages

- `/` -- idea feed (public)
- `/create-idea` -- new idea form (auth required)
- `/onboarding`, `/sign-in`, `/sign-up` -- Clerk auth flow under `app/(auth)/`

## Auth

- Clerk session auth; `proxy.ts` protects everything except `/`, `/sign-in`, `/sign-up` and `/api/webhook/clerk`
- Clerk user is mirrored into MongoDB via `lib/actions/user.action.ts` during onboarding
- Required env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
