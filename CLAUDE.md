# Claude Code Guidelines for react19-tailwind4-starter

Minimal React 19 + TypeScript + Vite 8 + Tailwind CSS 4 starter with TanStack Router and pnpm workspace support.

Detailed rules live in `.claude/rules/` and are loaded automatically:

- `.claude/rules/tailwind.md` — Tailwind v4 syntax, design tokens, accessibility
- `.claude/rules/components.md` — component variant patterns (cn / CVA / tailwind-variants)

## Tech Stack

- **React 19.2** with `react-jsx` transform — never write `import React from 'react'`; import hooks as named imports
- **Vite 8** + `@vitejs/plugin-react`; `base: './'` for relative-path deployment
- **TanStack Router** — file-based routing; `src/routeTree.gen.ts` is auto-generated, **never edit it manually** (Biome ignores it too)
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin — CSS-based config, **no `tailwind.config.js`**, no PostCSS
- **Biome 2.3** for lint + format (no ESLint/Prettier)
- **pnpm** (default) — package manager; npm/yarn/bun also work (replace `<pm>` with your package manager)

## Commands

```bash
# Replace <pm> with your package manager (pnpm / bun / yarn / npm)
<pm> run dev    # dev server at http://localhost:5173 (not 3000)
<pm> run build  # tsc -b + vite build — use to pre-check type errors
<pm> run check  # Biome lint + format with auto-fix — run before committing
<pm> add <pkg>  # add dependencies
```

`mise.toml` wraps these as `mise run vite:dev` / `vite:build` / `vite:preview` for environments with mise installed.

## Structure

- Entry: `index.html` → `src/main.tsx` → `src/routes/__root.tsx`
- `src/routes/` — pages. Conventions: `index.tsx` → `/`, `about.tsx` → `/about`, `posts/$postId.tsx` → `/posts/:postId`. Export with `createFileRoute()`; the route tree regenerates automatically — no manual router config needed
- `src/components/` — reusable UI components (named exports)
- `src/lib/` — utilities (pure functions, named exports): `utils.ts` (`cn`), `image.ts` / `imageAsync.ts`
- `src/index.css` — `@import "tailwindcss"` plus `@theme` tokens
- `@/` alias → `src/` (synced in `vite.config.ts` and `tsconfig.app.json`)
- Router `basepath` uses `import.meta.env.BASE_URL` for deployment flexibility

## Conventions

- TypeScript strict mode; unused variables/parameters and `any` are errors
- Define props with explicit TypeScript interfaces; use semantic HTML (`header`, `main`, `nav`, `section`, `article`, `aside`)
- Components accept a `className` prop and merge it last via `cn()`
- Biome format: 2 spaces, LF, 80 chars, semicolons as needed, trailing commas
- Keep changes focused; don't introduce new dependencies without clear necessity

## Images

Place images in `src/assets/images/` with descriptive filenames (e.g. `hero-banner.jpg`, not `img1.jpg`). They are resolved via `import.meta.glob`:

- Eager (static assets): `getImage('hero')` / `getAllImages()` from `@/lib/image`
- Lazy (large or conditional images): `getImageAsync()` / `getAllImagesAsync()` from `@/lib/imageAsync`

`getImage()` resolves the extension automatically (`jpg/jpeg/png/webp/svg`) and returns `''` with a dev-mode console warning if the image is missing. See `src/lib/image.ts` for details.

## Typography

`src/index.css` sets **Gen Interface JP** as the default typeface (`--default-font-family` / `--heading-font-family`, loaded via CDN link in `index.html`). Treat this as the starter's placeholder, not a fixed choice — swap it whenever the prompt names a different typeface, or a referenced Figma design specifies its own fonts. See the README's "Default Typeface" section for the two files to edit.

## Design System

If `DESIGN.md` exists in the project root, read it before implementing any UI change — it defines the design tokens (colors, typography, spacing, radius) and component guidelines.

## Tailwind MCP Tools

When the Tailwind CSS MCP server is available, verify v4 class names and best practices against it instead of guessing — e.g. `search_tailwind_docs`, `get_tailwind_utilities`, `convert_css_to_tailwind`.

## Troubleshooting

- Biome LSP errors → reload the VSCode window, verify workspace trust
- HMR stopped → restart `<pm> run dev`, delete `node_modules/.vite`
- Router not updating → check that `routeTree.gen.ts` regenerates (terminal logs)
- TanStack Router DevTools appear at the bottom-right in dev mode
