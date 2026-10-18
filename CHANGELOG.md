# Changelog

## [1.5.0] - 2026-10-18

- Upvotes: new `Vote` model with a unique `(idea, user)` index, an idempotent `setVote` server action that moves `Idea.upvotes` with `$inc` only when a vote is inserted or deleted, and an optimistic `VoteButton` on every card
- Feed sorts: Hot (default; `(upvotes + 1) / (ageHours + 2) ^ 1.8`, scored and sorted inside a MongoDB aggregation), New and Top, switched with `?sort=`; compound indexes on `Idea` for the feed, Top and profile queries
- New pages: `/idea/[id]` (thread with replies and a reply form), `/profile/[id]` (Ideas and Replies tabs with idea, reply and upvote counts), `/profile` (redirects to your own), `/profile/edit`, `/activity` (replies to and upvotes on your ideas) and `/search` (people and ideas, regex input escaped)
- Right sidebar "Suggested Users" now lists the most upvoted authors
- Clerk webhook at `/api/webhook/clerk`: verifies the signature with `verifyWebhook` and, on `user.deleted`, removes the user, their ideas, the replies under them and the related votes, with upvote counters corrected
- Demo mode (`NEXT_PUBLIC_DEMO_MODE=true`) runs the app without Clerk as a seeded Demo Visitor; `npm run demo` starts an in-memory MongoDB, seeds it and runs `next dev`
- `npm run seed` loads the demo dataset (9 users, 12 ideas, 16 replies, 53 upvotes) into `MONGODB_URL`, replacing the seed-owned users and their ideas (replies and votes under those ideas go with them)
- `npm run screenshots` captures desktop and phone screenshots with Playwright into `docs/screenshots/` as WebP; README now shows them
- Pages and actions read the session through `lib/session.ts`; `proxy.ts` makes idea, profile and search pages public to read
- Fix `/create-idea` passing a Mongo ObjectId to a client component (React rejected it); it now passes the id string
- Profile photo validation also accepts site-relative image paths, so seeded profiles can be edited
- IdeaCard: reply count with reply avatars, timestamp, "Replying to" link, wrapped long text and tighter padding on phones
- README: demo quick start, screenshots, Deploy with Vercel button, voting and ranking design, demo mode notes, updated architecture diagram and data model
- Dev dependencies: tsx, mongodb-memory-server-core, playwright, sharp

## [1.4.0] - 2026-10-18

- Fix a stray `;` rendered under the home feed and pass the real `parentID` field to `IdeaCard`
- Await `connectToDB()` in every server action so queries never race the first connection
- Onboarding now prefills from the saved Mongo profile (it used an empty placeholder) and uses tighter padding on phones
- Rename `middleware.ts` to `proxy.ts` (Next.js 16 file convention; removes the build deprecation warning)
- Bump next 16.4.2, react/react-dom 19.3.1, @clerk/nextjs 7.9, mongoose 9.11, zod 4.6, react-hook-form 7.90, eslint 10.13, prettier 3.9.10
- Majors: TypeScript 6.0 (tsconfig target es5 to ES2017, which TS 6 requires), @hookform/resolvers 5, tailwind-merge 3 (the v2 line targets Tailwind v3), @types/react and @types/react-dom 19, @types/node 24
- Remove unused `svix` and `lucide-react`
- CI: Node 24, `permissions: contents: read`, `npm ci --ignore-scripts` (targets both open code scanning alerts); `.nvmrc` 19 to 24
- `.editorconfig` indent 3 to 2 to match the code
- README: architecture diagram, data model, request flow, tech decisions, project status, CI and license badges; drop the yarn/pnpm and Lucide claims
- CLAUDE.md: correct stack versions, env var names, CI and proxy notes

## [1.3.3] - 2026-10-13

- Override sharp (^0.35.5), source-map-js (^1.2.2) and brace-expansion (1.1.21 and 5.0.12) to fix 4 Dependabot alerts raised by the rescan after 1.3.2 (#130, #131, #133, #134)

## [1.3.2] - 2026-10-13

- Bump next to 16.4.0 (and eslint-config-next to match) to fix the critical remote code execution advisory in next/og ImageResponse (Dependabot alert #127)

## [1.3.1] - 2026-09-02

- Override nanoid (^3.3.18), sharp (^0.35.0), and effect (^3.20.0) to fix 3 high-severity Dependabot alerts
- Align package.json version with changelog
- Record recent merged work: Clerk v7 / Mongoose v9 / UploadThing v7 / Tailwind v4 upgrades, profile edit cache revalidation fix, CI build workflow, MIT license switch, routine dependency updates

## [1.3.0] - 2026-03-14

- Add .env.example and update .gitignore

## [1.2.0] - 2026-03-07

- Fix security vulnerabilities via npm audit fix

## [1.1.0] - 2025-08-21

- Update README with project details and setup instructions
- Upgrade to Next.js 16

## [1.0.0] - 2023-08-07

- Community idea-sharing platform
- Next.js with React, TypeScript, App Router
- MongoDB + Mongoose with Clerk authentication
- UploadThing for image uploads
- Threaded comments via self-referencing Idea model
- Server Actions for CRUD operations
