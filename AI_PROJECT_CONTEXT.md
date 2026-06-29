# ScholarEdge AI Project Context

Last checked: 2026-06-15, Australia/Sydney

This file is a handoff document for future AI agents. It summarises the current project state, structure, recent updates, deployment notes, and known caveats so an agent can resume work without doing a full project review first.

## Project Identity

- Project name: ScholarEdge
- Local path: `C:\Users\asimb\OneDrive - Deakin University\Antigravity\Codex updated 180526\ScholarEdge`
- Git remote: `https://github.com/abai49850/ScholarEdge.git`
- Main branch: `main`
- Latest known pushed commit when this context file was first created: `1159ba0 Align bottom CTA with hero`
- Always run `git log --oneline -6` for the latest commit because this handoff file may be updated alongside feature work.
- Live site previously discussed: `https://ScholarEdge.vercel.app/`
- Current Supabase project ref discussed in this thread: `sqktobxffnfqjmxwywpr`
- Current Supabase URL discussed in this thread: `https://sqktobxffnfqjmxwywpr.supabase.co`

## High-Level Purpose

ScholarEdge is a Next.js education web app for Australian students and parents. It supports practice, diagnostics, admin question management, AI question generation, AI coaching, student dashboards, parent reporting, tutor sharing, gamification, and exam-specific landing pages.

Primary exam/practice pathways now include:

- NAPLAN
- ICAS
- NSW selective entry
- VIC selective entry / ACER-style selective entry
- ACER scholarship
- EduTest scholarship and achievement tests
- HSC English skills
- VCE English skills
- General subject practice

## Technology Stack

- Framework: Next.js 16 App Router
- React: 18
- Styling: Tailwind CSS, local UI components in `src/components/ui`
- Animation: Framer Motion
- Icons: Lucide React
- Backend/data: Supabase
- Auth: Supabase Auth
- AI: Gemini via Supabase Edge Functions
- Package manager currently used in commands: npm

Key scripts:

```powershell
npm.cmd run build
npm.cmd run dev
npm.cmd run lint
npm.cmd run test
```

Use `npm.cmd` on this Windows machine because PowerShell may block `npm.ps1`.

## Important Environment Variables

Client-side app:

```text
NEXT_PUBLIC_SUPABASE_PROJECT_ID
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL
```

Supabase Edge Functions:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
GEMINI_MODEL
GEMINI_QUESTION_MODEL
```

Notes:

- Do not commit `.env` or secrets.
- `GEMINI_API_KEY` must be set in Supabase secrets for the deployed `coach` and `generate-questions` functions.
- `GEMINI_QUESTION_MODEL` is optional. If unset, `generate-questions` falls back to `GEMINI_MODEL`, then `gemini-flash-lite-latest`.

## Current Git Status at Last Check

At the last check, `main` was aligned with `origin/main`, but these local files were dirty/untracked and should not be reverted unless the user explicitly asks:

```text
 M .gitignore
 M supabase/functions/coach/index.ts
?? dz_full_data.sql
?? old_project_data.sql
```

Interpretation:

- `.gitignore` had unrelated local edits.
- `supabase/functions/coach/index.ts` had an unrelated local formatting-looking change from earlier work.
- `dz_full_data.sql` and `old_project_data.sql` are local database dump/import artifacts.
- Future agents should run `git status --short` before editing and avoid staging these unless the task is specifically about them.

## Source Structure

```text
src/
  app/                 Next.js app router routes and page wrappers
  components/          Shared UI, landing page, dashboard, auth, practice, coach components
  contexts/            Auth, user profile, feature flag providers
  data/                Static app data, exam catalogue, landing page data, sample/generated question packs
  hooks/               Shared React hooks
  integrations/        Supabase client and generated/typed integration files
  lib/                 API wrappers, router helpers, stats, free access, users, utilities
  modules/             Domain modules such as AI coach and curriculum/assessment helpers
  test/                Vitest tests
  views/               Larger route-level view components

supabase/
  functions/
    coach/             AI coach Edge Function, Gemini-backed
    generate-questions/ Admin AI question generator Edge Function, Gemini-backed
    save-questions/    Admin question-save Edge Function
  migrations/          Database schema/RPC/policy migrations
  .temp/               Local Supabase CLI artifacts; do not treat as source of truth

public/
  logo.png             Main app logo
  favicon.ico          Browser tab icon
  images/
    landing-students-hero.webp  Compressed generated hero image for the homepage
```

## Main Routes

Public and marketing:

- `/` - main landing page
- `/lp/[slug]` - specialist landing page template
- `/info/[slug]` - info/legal/content pages

Auth and app:

- `/auth`
- `/dashboard`
- `/practice`
- `/journey`
- `/coach`
- `/naplan`
- `/naplan/simulator`

Admin:

- `/admin`
- `/admin/questions`
- `/admin/questions/new`
- `/admin/questions/[id]`
- `/admin/questions/[id]/test`
- `/admin/generate`
- `/admin/users`
- `/admin/free-sets`

## Recent Commit History and Meaning

Recent known commits:

```text
1159ba0 Align bottom CTA with hero
f2ac128 Update landing hero practice messaging
8054aa9 Refresh landing page visuals
d6d0818 Refine landing page CTAs and exam links
f042e5f Expand admin exam generation pathways
30ddadf Add exam pathways to dashboard practice
fba5634 Activate dashboard engagement features
9550e71 Fix signup profile trigger
f9d0965 Update ScholarEdge browser tab icon
98dee69 Fix admin user management actions
```

Summary of recent work:

- Homepage hero was redesigned visually with a student study image and product snapshot.
- Hero copy now says:
  - Headline: "Fix your child's learning gaps automatically"
  - CTA: "Start Free Practice"
  - Secondary CTA: "See How It Works"
- Bottom CTA was aligned to "Start Free Practice".
- `/practice` was converted from an auth-gated route into a public no-signup practice entry with subject/year/exam choices.
- Homepage hero was simplified to one primary CTA and three micro-trust signals.
- The "how it works" product loop was moved directly after the homepage hero.
- Exam category cards were redesigned with distinct accents and visible year-range tags.
- FAQ sections now show the first answer open by default.
- Session summaries now prioritise the AI coach next-step recommendation.
- Dashboard now has a first-session empty state instead of blank charts for new users.
- Gamification leaderboard examples were anonymised by default.
- FAQ and testimonials were expanded with AI tutor, app feature and localised messaging.
- Footer links were updated to route to content-rich landing pages.
- New VIC selective entry landing page was added.
- Admin dashboard and AI generator now understand exam pathways beyond the four DB enum buckets.
- Student dashboard practice cards now use an expanded exam catalogue.
- Dashboard engagement features were activated earlier: live event/XP style, daily quests, journey and parent portal work.
- Admin user management and signup profile trigger were fixed earlier.

## Key Data Files

### `src/data/examCatalog.ts`

Source of truth for the expanded exam pathway cards used by student-facing practice and admin generation.

Important idea:

- The database still stores `question_exam_type` as one of:
  - `naplan`
  - `selective`
  - `scholarship`
  - `general`
- Richer pathways such as ICAS, VCE, HSC, ACER, EduTest and VIC selective are mapped onto those database enum values through `dbExamType`.

Do not add new UI-only exam names directly to the database enum unless also migrating Supabase and all dependent app code.

### `src/data/landingPages.ts`

Data source for `/lp/[slug]` landing pages. Includes pages such as:

- `naplan-practice-tests`
- `scholarship-exam-prep`
- `selective-school-test-prep`
- `vic-selective-entry-prep`
- `year-5-maths-practice`
- `icas-english-practice`
- `vce-english-exam-prep`

### `src/lib/questionsApi.ts`

Client-side question CRUD/list/stats helpers. Important implementation detail:

- Uses paginated fetching with page size 1000 to avoid the old hard 1000-row limit.
- `getQuestionStats()` includes `byExamSubject`, used by admin overview to show pathway coverage.

### `src/lib/statsApi.ts`

User performance and dashboard stats logic. Useful if working on dashboard, journey, parent portal, AI coach context or reports.

### `src/lib/usersApi.ts`

Admin user management API wrapper. Calls Supabase RPCs for user listing, tier updates, block/admin toggles, password reset and delete.

## Supabase Functions

### `supabase/functions/coach/index.ts`

AI coach function. It:

- Requires an authenticated user.
- Reads `GEMINI_API_KEY`.
- Uses `GEMINI_MODEL` or `gemini-flash-lite-latest`.
- Calls Gemini directly.
- Returns coach response content plus XP metadata.

Known caveat:

- This file was locally modified at last check but not staged or committed. Treat it carefully.

### `supabase/functions/generate-questions/index.ts`

Admin-only AI question generation. It:

- Requires authenticated admin.
- Uses `GEMINI_API_KEY`.
- Supports `GEMINI_QUESTION_MODEL`.
- Accepts `examPathway` metadata from the admin generator UI.
- Instructs Gemini to generate original questions only, using official/sample sources as format guidance and not copying copyrighted material.
- Returns structured JSON questions.

Important deployment note:

- Vercel deploys the Next.js app only.
- Supabase Edge Function changes require separate Supabase deployment, for example:

```powershell
npx supabase@latest functions deploy generate-questions --project-ref sqktobxffnfqjmxwywpr
npx supabase@latest functions deploy coach --project-ref sqktobxffnfqjmxwywpr
```

### `supabase/functions/save-questions/index.ts`

Admin-only function to validate and insert generated/imported questions using service role credentials.

## Supabase Migrations

Known migration files:

```text
20240515_australian_curriculum.sql
20260430045616_d9cb3d34-c442-4cff-bcb8-47abafcc106b.sql
20260430045636_cb2e1c56-1a9a-4129-9210-25d3b3d930ad.sql
20260501122117_7241ca42-eb07-49a9-9218-1652c50d5b93.sql
20260501122138_a9f1911f-8c98-4f43-a389-e758dd5a2123.sql
20260505062808_67567c61-d83c-4e30-9c9d-896377587e4f.sql
20260511050947_b04cd4e4-fafa-4373-af60-29b659b70530.sql
20260518000000_next_app_feature_tables.sql
20260529000000_auth_user_admin_consistency.sql
20260529002000_admin_user_management_rpcs.sql
20260529003000_fix_signup_profile_trigger.sql
```

Notable database/RPC areas:

- `profiles`
- `user_roles`
- `questions`
- practice/session/stat tables
- admin user management RPCs
- signup profile trigger consistency

When writing SQL for this project, verify the live schema first. Earlier errors showed mismatches such as missing `user_id`, missing `region`, and `email` not-null requirements in `profiles`.

## Question Library and Imports

Earlier work involved locating/importing questions from old Supabase projects:

- Old project ref discussed: `dzcrnpnkidnnwpjznxon`
- Other project investigated: `mxtbkbltimwfoomhnoce`
- Current project: `sqktobxffnfqjmxwywpr`

Local artifacts:

- `dz_full_data.sql`
- `old_project_data.sql`

These are untracked local data artifacts. Do not delete or commit without user approval.

Known library notes:

- Earlier duplicated-answer issues were found in imported questions where options could repeat.
- Generally each MCQ should have exactly 4 distinct options.
- New generated questions should always have exactly 4 options and one correct answer.

## Landing Page Status

Main homepage files:

- `src/views/Index.tsx`
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/TrustBar.tsx`
- `src/components/landing/TestCategories.tsx`
- `src/components/landing/ParentDashboardPreview.tsx`
- `src/components/landing/StudentGamificationSection.tsx`
- `src/components/landing/SocialProofSection.tsx`
- `src/components/landing/FAQSection.tsx`
- `src/components/landing/CTASection.tsx`
- `src/components/landing/FooterSection.tsx`

Current hero:

- Headline: "Fix your child's learning gaps automatically"
- Subheading focuses on choosing a subject, identifying struggle areas, generating targeted questions and explanations.
- Primary CTA: "Start Free Practice"
- Secondary CTA was removed from the hero to reduce above-the-fold competition.
- Mini preview pills:
  - Takes less than 30 seconds to start
  - Works for maths, science, and more
  - No setup required

Hero asset:

- `public/images/landing-students-hero.webp`
- Generated with built-in image generation, then converted to WebP for smaller page load.

## Admin Status

Admin overview:

- Shows total, approved, draft and exam pathway coverage.
- Uses `examCards` from `src/data/examCatalog.ts`.

Admin generator:

- Lets admin choose an exam pathway.
- Maps pathway to existing `question_exam_type`.
- Sends pathway metadata to `generate-questions`.
- Saves generated questions through `save-questions`.

Admin users:

- Earlier fixes added/expected RPCs including admin user listing and management actions.
- If user page errors mention missing RPCs, inspect migrations and live Supabase schema/RPC cache.

## Practice Conversion Flow

`/practice` is intentionally public. Do not wrap it in `ProtectedPage` unless the product direction changes.

Current `/practice` behaviour:

- Anonymous users see a start page with subject, year and exam-style choices.
- Anonymous users can answer questions and see explanations without signing up.
- Attempts are only persisted when Supabase Auth has a signed-in user.
- Guests see a "save progress" prompt in the session summary.
- Signed-in free users still respect the free daily practice limit.
- If a selected combination has no questions, the page shows a friendly "choose another practice set" state instead of an endless loader.

## Known Deployment Notes

Vercel:

- App builds with `next build`.
- `vercel.json` contains security headers and project name.
- Vercel environment variables must match current Supabase project:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_SUPABASE_PROJECT_ID`

Supabase:

- Edge Functions must be deployed separately from Vercel.
- Function secrets must be set in Supabase dashboard/CLI.
- If Gemini works locally but not on Vercel, check Supabase function secrets, not GitHub.

## Recommended Agent Workflow

Before making changes:

```powershell
git status --short
git branch -vv
git log --oneline -6
```

For code edits:

- Keep changes scoped.
- Do not revert unrelated local files.
- Do not stage `.env`, SQL dumps, or unrelated dirty files.
- Prefer existing patterns and shared data sources (`examCatalog`, `landingPages`, `questionsApi`) over creating parallel structures.

Before finalising:

```powershell
npm.cmd run build
git diff --check
git status --short
```

When pushing:

```powershell
git add <only relevant files>
git commit -m "<clear message>"
git push
```

## Open Caveats and Future Work

- Confirm Supabase Edge Functions `coach` and `generate-questions` are deployed to the active project after any function edits.
- Keep the app's exam pathway layer and database enum mapping in sync.
- If adding true new exam types to the database enum, plan migrations, types regeneration and UI updates together.
- Continue reviewing imported questions for duplicate options, invalid correct option IDs, and overly generic source references.
- Consider adding tests for `questionsApi` pagination and question option validation.
- Consider adding a dedicated data-quality admin tool for duplicate answer detection.
