# Copilot / AI Assistant Instructions

Short, targeted guidance to help an AI contribute productively to this Next.js (App Router) portfolio-blog repo.

- Project type: Next.js 14 using the app/ router, TypeScript, Tailwind (v4 alpha), MDX for posts, and pnpm as package manager.
- Key commands (run from repo root):
  - Development: `pnpm dev` (runs `next dev`)
  - Build: `pnpm build` (runs `next build`) and `pnpm start` to run the built app
  - Typecheck: `pnpm exec tsc --noEmit` (project uses local TypeScript)

High-level architecture
- app/ is the authoritative source for routes and layouts (Next.js app router). See `app/layout.tsx` for global layout, fonts, and top-level metadata.
- Blog posts are plain MDX files in `app/blog/posts/*.mdx`. They are parsed server-side by `app/blog/utils.ts` via a small frontmatter parser (note: it expects simple `key: value` pairs inside `---` blocks).
- MDX rendering uses `next-mdx-remote/rsc` and a custom component map in `app/components/mdx.tsx` (heading anchors, table component, code highlighting with `sugar-high`, and a `CustomLink` that uses `next/link` for internal paths).
- Dynamic assets and server routes: `app/og/route.tsx` (dynamic OG images) and `app/rss/route.ts` (RSS feed) generate runtime assets — look at these when working on sharing/SEO features.
- Client components (interactive UI) live where `"use client"` is present. Example: `public/startups/StartupsClient.tsx` — a small searchable table UI that expects props { headers, rows } and reads data from `public/startups/data-in-use.csv` elsewhere.

Conventions & gotchas (explicit, discoverable patterns)
- Frontmatter parsing: `app/blog/utils.ts` strips a `---` block and expects `key: value` lines (no complex YAML structures, arrays, or nested objects). When adding post frontmatter, follow the simple format: `title: My Post` `publishedAt: 2024-01-01` `summary: Short summary`.
- Dates: `formatDate` in `app/blog/utils.ts` accepts dates like `YYYY-MM-DD` or an ISO string; sometimes the code appends `T00:00:00` if time is missing. Prefer consistent `YYYY-MM-DD`.
- MDX components: Use `CustomMDX` exported from `app/components/mdx.tsx` when server-rendering MDX. Inline MDX-custom components are merged via `components` prop.
- Links: `a` tags in MDX are wrapped by `CustomLink`; prefer absolute `https://` for external links or `/relative` for internal links so they use Next's Link.
- Client vs Server: By default files in `app/` are server components. Add `"use client"` only when necessary. Client components cannot use Node APIs or server-only helpers (e.g., `fs`).
- File reads: `getBlogPosts()` in `app/blog/utils.ts` synchronously reads the filesystem (`fs.readFileSync`) from `process.cwd()` — changes to posts require rebuild or server restart in dev to pick up.

Key files to inspect when changing behavior
- `app/layout.tsx` — global layout, fonts, metadata and Analytics/SpeedInsights wiring
- `app/blog/utils.ts` — MDX frontmatter parsing, `getBlogPosts()`, `formatDate`
- `app/components/mdx.tsx` — MDXRemote usage and component mapping (Code highlighting, Table, CustomLink)
- `app/blog/posts/*.mdx` — example posts and expected frontmatter keys
- `app/og/route.tsx`, `app/rss/route.ts` — runtime routes that generate OG images and RSS
- `public/startups/StartupsClient.tsx` and `public/startups/data-in-use.csv` — example of client component + CSV-backed data

When editing or adding code
- Keep server APIs (fs, path, process) inside server components or route handlers. Avoid them inside files with `"use client"`.
- If you add interactive UI, mark the file `"use client"` and keep data fetching server-side or via route handlers.
- For MDX frontmatter, keep the simple `key: value` shape. If you need richer metadata, update `app/blog/utils.ts` to use a YAML parser and update usages accordingly.

Examples (copyable snippets from this repo)
- Simple post frontmatter (place at top of `app/blog/posts/my-post.mdx`):

  ---
  title: My Post
  publishedAt: 2024-01-01
  summary: Short summary here
  ---

- Client component header (see `public/startups/StartupsClient.tsx`):

  'use client'

  import { useState } from 'react'

  // interactive state + useMemo for filtered rows

Notes and follow-ups
- No existing `.github/copilot-instructions.md` was found; this file was created to capture immediate, discoverable patterns.
- If you want more detail, I can:
  - Add a short section with examples of common PR tasks (add post, add route, add client component).
  - Add recommended tests or a `pnpm` script for typechecking/linting.

Please tell me which areas need more detail or if you'd like the PR-style checklist added.
