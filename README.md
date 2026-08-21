# React + TypeScript + Vite + TanStack Router + Tailwind CSS

A React application template built on a modern tech stack.

## 🚀 Tech Stack

- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - type-safe development
- **[Vite 8](https://vite.dev/)** - fast build tool
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)** - Fast Refresh
- **[TanStack Router](https://tanstack.com/router)** - type-safe routing
- **[Tailwind CSS v4](https://tailwindcss.com/)** - utility-first CSS
- **[Biome](https://biomejs.dev/)** - fast linter/formatter

## 📁 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   │   └── images/     # Image files (jpg, png, webp, svg)
│   ├── components/     # Reusable components
│   │   ├── ButtonCn.tsx     # Simple button using cn()
│   │   ├── ButtonCva.tsx    # Variant button using CVA
│   │   └── CardTv.tsx       # Card using tailwind-variants
│   ├── lib/            # Utility functions
│   │   ├── image.ts         # Image asset management (eager loading)
│   │   ├── imageAsync.ts    # Image asset management (lazy loading)
│   │   └── utils.ts         # Class name merging (cn function)
│   ├── routes/         # TanStack Router route definitions
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── about.tsx
│   ├── index.css       # Global styles / theme settings
│   ├── main.tsx        # Entry point
│   └── routeTree.gen.ts # TanStack Router auto-generated file
├── biome.json          # Biome config
├── mise.toml           # Mise config (tool version management)
├── package.json        # Dependencies
├── pnpm-workspace.yaml # pnpm workspace config (build script permissions)
├── tsconfig.json       # TypeScript config
├── tsconfig.app.json   # TypeScript config for the app
├── tsconfig.node.json  # TypeScript config for Node
└── vite.config.ts      # Vite config
```

## 🛠️ Setup

Replace `<pm>` with your package manager (e.g. `npm`, `yarn`, `pnpm`).

### Install dependencies

```bash
<pm> install
```

### Start the dev server

```bash
<pm> run dev
```

The dev server starts and is usually available at http://localhost:5173.

## 📝 Available Commands

```bash
# Start dev server
<pm> run dev

# Production build
<pm> run build

# Preview the production build
<pm> run preview

# Lint code
<pm> run lint

# Format code
<pm> run format

# Lint + format
<pm> run check
```

## 🔤 Default Typeface: Gen Interface JP

This template uses **[Gen Interface JP](https://github.com/yamatoiizuka/gen-interface-jp)** as the default typeface.

### Changing the typeface

To change the typeface, edit these two files.

**1. `index.html` — loading the font**

```html
<!-- Current setting (Gen Interface JP) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/all.css" />

<!-- To use the display typeface -->
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gen-interface-jp@latest/display-all.css" /> -->
```

**2. `src/index.css` — applying the default font**

```css
/* Uncomment the @import at the top of the file to use Google Fonts */
/* @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap"); */
@import "tailwindcss";

@theme {
  /* Current setting (Gen Interface JP) */
  --default-font-family: "Gen Interface JP", sans-serif;

  /* To use the display typeface */
  /* --default-font-family: "Gen Interface JP Display", sans-serif; */

  /* Example: switching to Google Fonts */
  /* --default-font-family: "Noto Sans JP", sans-serif; */
}
```

## 🎨 Tailwind CSS v4

This project uses Tailwind CSS v4, configured via the [@tailwindcss/vite](https://tailwindcss.com/docs/guides/vite) plugin.

## 🧭 TanStack Router

TanStack Router automatically generates route definitions. Add a file under `src/routes/` and routing is configured automatically.

- `__root.tsx` - root layout
- `index.tsx` - home page (`/`)
- `about.tsx` - About page (`/about`)

[TanStack Router DevTools](https://tanstack.com/router/latest/docs/framework/react/devtools) is available in development.

## 📦 Key Features

- **Type-safe routing** - full type inference via TanStack Router
- **Fast HMR** - Vite's fast Fast Refresh
- **Automatic code splitting** - TanStack Router's automatic code splitting
- **Optimized image management** - efficient asset loading via Vite's `import.meta.glob`
- **Path alias** - access `src/` via `@/`
- **Biome integration** - a faster toolchain than ESLint + Prettier

---

## 🎨 Figma Integration Commands

Slash commands for converting Figma designs into code inside Claude Code.
Requires the Figma MCP server to already be connected.

| Command | Description |
|---|---|
| `/figma:setup-env` | Remove the starter's demo content — run once before starting implementation |
| `/figma:implement-figma <URL>` | Implement a design from a Figma URL |
| `/figma:review-figma <URL>` | Compare the implementation against the Figma URL and fix discrepancies |
| `/figma:code-optim` | Refactor the implemented components in `src/components/` |
| `/figma-workflow <URL>` | All-in-one command running implementation, review, and optimization together |

### Typical workflow

Running each command individually:

```bash
# 1. Run once first to clear the demo content
/figma:setup-env

# 2. Implement the design from a Figma URL
/figma:implement-figma https://www.figma.com/design/...

# 3. Compare the implementation against the design and fix it
/figma:review-figma https://www.figma.com/design/...

# 4. Refactor components
/figma:code-optim
```

`/figma-workflow` runs steps 2–4 above in one go:

```bash
# After setup-env, run implementation, review, and optimization in a single command
/figma-workflow https://www.figma.com/design/...
```

## 🎨 Tailwind Utility Commands

Skills for reviewing, optimizing, and setting up typography for Tailwind CSS v4.

| Command | Description |
|---|---|
| `/tailwind-review` | Review and optimize Tailwind classes, migrate to v4, and check HTML accessibility |
| `/tailwind-typescale [base-size] [scale-name]` | Set a type scale using a ratio from typescale.com |

### `/tailwind-review` triggers

This skill fires automatically in cases like:

- You say "review", "clean up", or "check" Tailwind classes
- v3-era classes are present, such as `space-y-*`, `space-x-*`, `flex-shrink`, `bg-opacity-*`
- Hardcoded arbitrary values are used, like `text-[#1e40af]` or `w-[320px]`
- You're migrating from v3 to v4

### Using `/tailwind-typescale`

```bash
# Interactively choose a base size and scale
/tailwind-typescale

# Specify base size and scale name directly
/tailwind-typescale 16px minor-third
```

`--text-xs` through `--text-9xl` are set in `src/index.css`'s `@theme`, and `h1`–`h6` font sizes are auto-mapped in `@layer base`.

---

## 📐 Design Token Management Commands

| Command | Description |
|---|---|
| `/create-design-md` | Generate `DESIGN.md` summarizing the project's design tokens and component guidelines |
| `/create-design-md <Figma URL>` | Reverse-engineer a design system from a Figma design into `DESIGN.md` |
| `/create-design-md <design-md URL>` | Reference and update/validate an existing `DESIGN.md` |

Claude Code automatically reads the generated `DESIGN.md` and consistently applies its color, spacing, and typography tokens in subsequent UI implementation.

---

## 🔧 Customization

### Adding path aliases

Define additional aliases in the `resolve.alias` section of [vite.config.ts](vite.config.ts).

### Component library

This project includes utilities for working with Tailwind CSS:

- `class-variance-authority` - variant management
- `clsx` & `tailwind-merge` - class name merging
- `tailwind-variants` - variant definitions
- `lucide-react` - icon library
