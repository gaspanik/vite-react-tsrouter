# Copilot Instructions for ts-swc

## Project Overview

Minimal React 19 + TypeScript + Vite 7 + Tailwind CSS 4 starter with TanStack Router and pnpm workspace support.

## Tech Stack

- **Framework**: React 19.2 (`react-jsx` transform)
- **Build**: Vite 7 + `@vitejs/plugin-react-swc` (SWC for Fast Refresh)
- **Router**: TanStack Router (file-based routing with auto-generated route tree)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`, applied with `@import "tailwindcss"`)
- **Utilities**: `clsx` + `tailwind-merge` (combined as `cn` function), `class-variance-authority` (for variant APIs), `tailwind-variants` (for slot-based multi-element styling)
- **Icons**: `lucide-react` for consistent icon usage
- **Linter/Formatter**: Biome 2.3 (strict configuration in `biome.json`)
- **Package Manager**: pnpm (required, see `pnpm-workspace.yaml`)

## Key Structure

- **Entry**: `index.html` → `src/main.tsx` → TanStack Router (`src/routes/__root.tsx`)
- **Routes**: `src/routes/` for page components (auto-generates `src/routeTree.gen.ts`)
- **Styles**: `src/index.css` with `@import "tailwindcss"` only (no config file, v4 approach)
- **Components**: `src/components/` for reusable UI components
- **Utilities**: `src/lib/utils.ts` with `cn` function (clsx + tailwind-merge), `src/lib/image.ts` for optimized image handling
- **Path Alias**: `@/` maps to `src/` for cleaner imports (configured in both `vite.config.ts` and `tsconfig.app.json`)
- **TypeScript**: Project references (`tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`)
- **Vite Config**: `vite.config.ts` with `base: './'` (relative path deployment)

## Architecture Overview

This is a React 19 + TypeScript SPA using file-based routing with TanStack Router. The router auto-generates `src/routeTree.gen.ts` from files in `src/routes/` - **never edit this file manually**.

### Key Architectural Decisions

- **SWC over Babel**: Uses `@vitejs/plugin-react-swc` for faster compilation and HMR
- **Tailwind CSS v4**: Uses `@tailwindcss/vite` plugin (not PostCSS). Import with `@import "tailwindcss"` in CSS files
- **Biome over ESLint/Prettier**: Single tool for linting and formatting with stricter defaults
- **pnpm**: Required package manager (see `pnpm-lock.yaml`, not `package-lock.json`)

## Critical Developer Workflows

### Commands
```bash
pnpm dev          # Start dev server (do NOT use npm/yarn)
pnpm build        # TypeScript check + Vite build
pnpm check        # Biome lint + format (auto-fix)
```

### Adding Routes
1. Create files in `src/routes/` following TanStack Router conventions:
   - `index.tsx` → `/`
   - `about.tsx` → `/about`
   - `posts/$postId.tsx` → `/posts/:postId`
2. Use `createFileRoute()` export pattern (see `src/routes/index.tsx`)
3. Router auto-regenerates on file changes

### Testing Changes
- Dev server runs at http://localhost:5173 (not 3000)
- TanStack Router DevTools available at bottom-right in dev mode

## Coding Conventions

### React

- **Omit React Import**: Project uses `react-jsx` transform — **never** write `import React from 'react'`
- **Hook Imports**: Import hooks as named imports: `import { useState, useEffect } from 'react'`
- **Component Structure**:
  - Use semantic HTML tags (`header`, `main`, `footer`, `section`, `article`, `nav`, `aside`)
  - Define props explicitly with TypeScript interfaces
  - Example:
    ```tsx
    interface ButtonProps {
      label: string
      onClick: () => void
    }

    function Button({ label, onClick }: ButtonProps) {
      return <button onClick={onClick}>{label}</button>
    }
    ```

### TypeScript

- **Strict Mode**: `strict: true`, unused variables/parameters error
- **Module**: `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`
- **JSX**: `react-jsx` transform (no `import React` needed)
- **Path Mapping**: `baseUrl: "./src"` with `@/*` alias for absolute imports from `src/`

### Biome Rules

- **Format**: 2 spaces, LF, 80 char width, semicolons as needed, trailing commas
- **Linter**: `recommended` base + strict TypeScript rules (`noExplicitAny: error`, `noUnusedVariables: error`)
- **React**: `useExhaustiveDependencies: warn`, `useHookAtTopLevel: error`
- Run `pnpm check` before committing. Biome auto-fixes most issues.

## Tailwind CSS v4 Guidelines

### Core Principles

- **No Config File Needed**: No `tailwind.config.js`, just `@import "tailwindcss"` in `src/index.css`
- **Vite Plugin**: `@tailwindcss/vite` required (no PostCSS needed)
- **Customization**: Use CSS variables or `@theme` directives (not traditional JS config)

### MCP Tools (When Available)

If Tailwind CSS MCP tools are available in your environment, use them to access the latest documentation and utilities:

- **Search Documentation**: Use `mcp_tailwindcss_m_search_tailwind_docs` to search official Tailwind CSS documentation for specific topics, utilities, or concepts
- **Get Utilities**: Use `mcp_tailwindcss_m_get_tailwind_utilities` to retrieve utility classes by category, property, or search term
- **Configuration Guide**: Use `mcp_tailwindcss_m_get_tailwind_config_guide` for framework-specific setup instructions
- **Component Templates**: Use `mcp_tailwindcss_m_generate_component_template` to generate HTML component templates with Tailwind classes
- **CSS Conversion**: Use `mcp_tailwindcss_m_convert_css_to_tailwind` to convert traditional CSS to Tailwind utility classes
- **Color Palette**: Use `mcp_tailwindcss_m_get_tailwind_colors` to retrieve color palette information

These MCP tools provide always up-to-date information directly from Tailwind CSS documentation, ensuring accuracy for v4-specific features and changes.

### Navigation Structure

- **TanStack Router Link**: Use `Link` component from TanStack Router for navigation:
  ```tsx
  import { Link } from '@tanstack/react-router'
  
  <nav aria-label="Main navigation">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul>
  </nav>
  ```
- **Active State Styling**: TanStack Router's `Link` automatically applies `.active` class to active links:
  ```tsx
  <Link 
    to="/about"
    className="[&.active]:font-bold [&.active]:text-blue-600"
  >
    About
  </Link>
  ```
- **ARIA Labels**: Provide descriptive `aria-label` to `<nav>` elements (e.g., `"Main navigation"`, `"Footer links"`)

### Interactive Elements

- **Mobile Menu Buttons**: Use proper ARIA attributes:
  ```tsx
  <button
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    aria-label="Toggle menu"
  >
    Menu
  </button>
  ```
- **State Indication**: Set `aria-expanded` to `true`/`false` for collapsible sections
- **Control Relationships**: Use `aria-controls` to link buttons with their target elements
- **Focus Management**: Ensure keyboard navigation works for all interactive elements

### Best Practices

- **Alt Text**: Always provide meaningful `alt` attributes for images
- **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text)
- **Keyboard Navigation**: All functionality must be accessible via keyboard
- **Screen Reader Testing**: Test with VoiceOver (macOS) or NVDA/JAWS (Windows)

## *Vite Plugin**: `@tailwindcss/vite` required (no PostCSS needed)
- **Customization**: Use CSS variables or `@theme` directives (not traditional JS config)

### Theme Management

- **Use @theme Block**: Define project-specific design tokens in `src/index.css`:
  ```css
  @import "tailwindcss";

  @theme {
    --color-primary: #294779;
    --color-secondary: #f59e0b;
  }
  ```
- **Reference Custom Classes**: Use theme variables (`text-primary`) instead of arbitrary values (`text-[#294779]`)
- **Avoid Hardcoded Values**: Centralize colors/spacing in `@theme` for consistency

### Spacing and Value Guidelines

- **Prioritize Standard Scale**: Tailwind's spacing scale (1 unit = 4px) should be used first:
  - ✅ Good: `gap-2` (8px), `p-4` (16px), `m-6` (24px), `w-80` (320px)
  - ❌ Avoid: `gap-[8px]`, `p-[16px]`, `w-[320px]`
- **Arbitrary Values as Last Resort**: Use `[...]` syntax **only** when standard scale or theme variables cannot achieve the design:
  - Acceptable: `w-[42px]` (if design requires exact 42px)
  - Better: Add to `@theme` if used multiple times
- **Responsive Design**: Use standard breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)

### V4 Class Name Changes (CRITICAL)

Tailwind CSS v4 has updated class naming conventions. **Always use v4 syntax**:

```tsx
// ❌ WRONG (v3 syntax)
<div className="text-gray-500 bg-gray-50 space-y-4">

// ✅ CORRECT (v4 syntax)
<div className="text-gray-500 bg-gray-50 flex flex-col gap-4">
```

**Key v4 changes:**
- ❌ `space-x-*` / `space-y-*` → ✅ Use `gap-*` with flex/grid
- ❌ `divide-*` → ✅ Use borders on individual children
- ✅ All utility classes remain: `flex`, `grid`, `p-*`, `m-*`, `w-*`, `h-*`, etc.
- ✅ Arbitrary values: Use sparingly (`w-[42px]`). Prefer standard scale (`w-2.5`) or CSS variables (`text-primary`)
- ✅ Responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- ✅ State variants: `hover:`, `focus:`, `active:`, `disabled:`, etc.

**Never generate or suggest v3-specific utilities.** When refactoring, convert deprecated utilities to modern flex/grid patterns.

### Styling Guidelines

- **Tailwind-first**: No CSS modules or styled-components
- **Inline classes**: Keep component styles in `className` props
- **`cn()` for composition**: Merge and dedupe Tailwind classes (uses `clsx` + `tailwind-merge`)
- **Icons**: Use `lucide-react` with consistent sizing (`w-4 h-4` for inline, `w-6 h-6` for headings)
- **Component Overrides**: Accept `className` prop and apply it last in `cn` call

## Component Patterns

### cn Function

The `cn` utility (in `src/lib/utils.ts`) combines `clsx` and `tailwind-merge` to handle conditional class names and resolve Tailwind conflicts:

```tsx
import { cn } from '@/lib/utils'

// Basic usage with conditional classes
<button
  className={cn(
    'base-styles',
    isActive && 'active-styles',
    disabled && 'disabled-styles',
    className  // Allow external override
  )}
>
```

### Button Component Patterns

Three approaches for building components with variant styles:

**1. Simple Conditional Approach (`ButtonCn.tsx`)**:
- Use `cn` function for conditional styling
- Best for simple components with few variations or single DOM elements
- Example:
  ```tsx
  import { cn } from '@/lib/utils'
  import type { ComponentProps } from 'react'

  type ButtonProps = ComponentProps<'button'> & {
    active?: boolean
  }

  export const Button = ({ className, active, disabled, ...props }: ButtonProps) => (
    <button
      className={cn(
        'base-classes',
        active && 'active-classes',
        disabled && 'disabled-classes',
        className
      )}
      {...props}
    />
  )
  ```

**2. Variant API Approach (CVA)**:
- Use `class-variance-authority` (CVA) for complex variants
- Best for single-element components with multiple design system variants
- Type-safe variant props with `VariantProps<typeof variants>`
- Example:
  ```tsx
  import { cva, type VariantProps } from 'class-variance-authority'
  import { cn } from '@/lib/utils'

  const buttonVariants = cva('base-classes', {
    variants: {
      intent: {
        primary: 'primary-classes',
        secondary: 'secondary-classes'
      },
      size: {
        sm: 'small-classes',
        md: 'medium-classes'
      }
    },
    defaultVariants: { intent: 'primary', size: 'md' }
  })

  type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

  export const ButtonCva = ({ intent, size, className, ...props }: ButtonProps) => (
    <button className={cn(buttonVariants({ intent, size }), className )} {...props} />
  )
  ```

**3. Slot-Based Approach (Tailwind Variants)**:
- Use `tailwind-variants` for complex multi-element components
- Best for components with multiple DOM elements requiring coordinated variant styling
- Built-in `twMerge` functionality (no need to wrap with `cn`)
- Type-safe with `VariantProps<typeof config>`
- Example:
  ```tsx
  import { tv, type VariantProps } from 'tailwind-variants'
  import type { ReactNode } from 'react'

  // Define component variants with slots
  const card = tv({
    slots: {
      base: 'rounded-lg overflow-hidden shadow-md',
      image: 'w-full h-48 object-cover',
      content: 'p-6',
      title: 'text-xl font-bold mb-2',
      description: 'text-sm mt-2',
    },
    variants: {
      tone: {
        default: {
          base: 'bg-white',
          title: 'text-gray-900',
          description: 'text-gray-500',
        },
        dark: {
          base: 'bg-slate-900',
          title: 'text-white',
          description: 'text-slate-400',
        },
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  })

  // Extract type-safe props
  type CardVariants = VariantProps<typeof card>

  interface CardProps extends CardVariants {
    title: string
    imageUrl?: string
    children: ReactNode
    className?: string
  }

  // Component implementation
  export const Card = ({ tone, title, imageUrl, children, className }: CardProps) => {
    const { base, image, content, title: titleClass, description } = card({ tone })
    
    return (
      <div className={base({ class: className })}>
        {imageUrl && <img src={imageUrl} alt="Thumbnail" className={image()} />}
        <div className={content()}>
          <h3 className={titleClass()}>{title}</h3>
          <div className={description()}>{children}</div>
        </div>
      </div>
    )
  }
  ```

**When to use each approach:**
- **cn function**: Simple components, few conditionals, single element
- **CVA**: Single-element components with multiple variant combinations (buttons, badges)
- **tailwind-variants**: Multi-element components where variants affect multiple child elements (cards, forms, navigation)

### Icons

```tsx
// lucide-react icon usage example (see src/routes/__root.tsx, src/routes/index.tsx)
import { IconName } from 'lucide-react'

function Component() {
  return <IconName className="w-4 h-4" />
}
```

## Asset Management

### Image Utilities

This project uses Vite's `import.meta.glob` for optimized image handling. All images should be placed in `src/assets/images/`.

**Files**:
- `src/lib/image.ts` - Eager loading (sync functions)
- `src/lib/imageAsync.ts` - Lazy loading (async functions)

**Supported formats**: `jpg`, `jpeg`, `png`, `webp`, `svg`

#### getImage()

Get images with or without file extension. Automatically resolves extension if omitted.

```tsx
import { getImage } from '@/lib/image'

function Component() {
  return (
    <img 
      src={getImage('portrait.jpg')}  // With extension
      alt="Portrait" 
    />
    // or
    <img 
      src={getImage('portrait')}      // Auto-detects portrait.jpg
      alt="Portrait" 
    />
  )
}
```

- Returns empty string if image not found
- Dev mode: Logs console warning for missing images
- Eager loading (all images loaded at build time)

#### getImageAsync()

Lazy-load large images for better performance:

```tsx
import { getImageAsync } from '@/lib/imageAsync'
import { useState, useEffect } from 'react'

function Gallery() {
  const [imageUrl, setImageUrl] = useState('')
  
  useEffect(() => {
    getImageAsync('large-photo.jpg').then(setImageUrl)
  }, [])
  
  return imageUrl ? <img src={imageUrl} alt="Large" /> : <p>Loading...</p>
}
```

#### getAllImages()

Get all images as a key-value map (useful for galleries):

```tsx
import { getAllImages } from '@/lib/image'

function ImageGallery() {
  const images = getAllImages() // { filename: url, ... }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(images).map(([name, url]) => (
        <img key={name} src={url} alt={name} />
      ))}
    </div>
  )
}
```

#### getAllImagesAsync()

Asynchronously get all images as a key-value map:

```tsx
import { getAllImagesAsync } from '@/lib/imageAsync'
import { useState, useEffect } from 'react'

function ImageGallery() {
  const [images, setImages] = useState<Record<string, string>>({})
  
  useEffect(() => {
    getAllImagesAsync().then(setImages)
  }, [])
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(images).map(([name, url]) => (
        <img key={name} src={url} alt={name} />
      ))}
    </div>
  )
}
```

**Best Practices:**
- Place all images in `src/assets/images/`
- Use descriptive filenames (e.g., `hero-banner.jpg`, not `img1.jpg`)
- Prefer `getImage()` for static assets (eager loading, faster initial load)
- Use `getImageAsync()` for large images or conditional loading (lazy loading)
- Import async functions from `@/lib/imageAsync`
- Import sync functions from `@/lib/image`
- Always provide meaningful `alt` text for accessibility

## Troubleshooting

- **Biome LSP Errors**: Reload VSCode (`Developer: Reload Window`), verify workspace trust
- **HMR Stopped**: Restart `pnpm dev`, delete `node_modules/.vite` cache
- **Type Errors**: Pre-check with `pnpm build` (`tsc -b` → `vite build`)
- **Router Not Updating**: Ensure `routeTree.gen.ts` is regenerating (check terminal logs)

## When Adding Features

- **New component**: Create in `src/components/`, use `cn()`, export as named export
- **New route**: Add to `src/routes/`, use `createFileRoute()`, no manual router config needed
- **New utility**: Add to `src/lib/`, keep pure functions, export as named export
- **Dependencies**: Run `pnpm add <package>` (not npm install)
- **Updates**: Use `pnpm update` to upgrade packages
```

### Path Alias

Use `@/` to import from `src/`:
```tsx
import { Button } from '@/components/ButtonCn'
import { cn } from '@/lib/utils'
```

## Integration Points

### Router Setup (`src/main.tsx`)
- Router instance created with `createRouter({ routeTree })`
- `basepath` uses `import.meta.env.BASE_URL` for deployment flexibility
- TypeScript module augmentation for router type safety

### Tailwind Configuration
- **v4 syntax**: No `tailwind.config.js` - use CSS-based config
- Plugin loads via Vite, not PostCSS
- Global styles in `src/index.css` (single `@import "tailwindcss"` line)

### Type Safety
- `tsconfig.json` uses project references (`tsconfig.app.json`, `tsconfig.node.json`)
- Path mapping: `@/*` → `./src/*` (synced in `vite.config.ts` and `tsconfig.app.json`)

## Tool Versions (Mise)

`mise.toml` defines custom tasks:
- `mise run vite:dev` → `pnpm dev`
- `mise run vite:build` → `pnpm build` (with confirmation)
- `mise run vite:preview` → `pnpm preview`

Use mise commands in environments with mise installed, otherwise use pnpm directly.

## Common Pitfalls

1. **Don't edit `routeTree.gen.ts`** - it's auto-generated by `@tanstack/router-plugin`
2. **Don't use npm/yarn** - pnpm is required (workspace config in `pnpm-workspace.yaml`)
3. **Don't create `tailwind.config.js`** - Tailwind v4 uses CSS-based config
4. **Don't skip `cn()` utility** - direct className concatenation breaks Tailwind precedence
5. **Biome ignores `routeTree.gen.ts`** - see `biome.json` includes/excludes

## When Adding Features

- **New component**: Create in `src/components/`, use `cn()`, export as named export
- **New route**: Add to `src/routes/`, use `createFileRoute()`, no manual router config needed
- **New utility**: Add to `src/lib/`, keep pure functions, export as named export
- **Dependencies**: Run `pnpm add <package>` (not npm install)
