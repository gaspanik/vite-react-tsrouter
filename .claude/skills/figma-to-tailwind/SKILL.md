---
name: figma-to-tailwind
description: Reads all Variables and local Text Styles from a Figma file URL and writes them as Tailwind CSS v4 @theme tokens into the project's Tailwind CSS entry file (found via grep, or src/index.css if none exists).
argument-hint: <figma-url>
allowed-tools: mcp__plugin_figma_figma__use_figma, Read, Edit, Bash
---

# Import Figma Variables as Tailwind v4 Tokens

Fetch all variables from the Figma file URL provided in `$ARGUMENTS` and write them as Tailwind CSS v4 `@theme` custom properties into the project's Tailwind CSS entry file.

**Output language:** Respond in the same language the user is using in this conversation.

## Step 1: Parse the URL

Extract the fileKey from `$ARGUMENTS`:

- `figma.com/design/:fileKey/...` → take `:fileKey`
- The `?node-id=` query parameter can be ignored (variables belong to the entire file)

## Step 2: Fetch all variables

Use `use_figma` with the Plugin API to retrieve all variables defined in the file, including unused ones:

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();

const result = collections.map(col => ({
  id: col.id,
  name: col.name,
  modes: col.modes,
  defaultModeId: col.defaultModeId,
  variables: col.variableIds.map(varId => {
    const v = variables.find(x => x.id === varId);
    if (!v) return null;
    return {
      id: v.id,
      name: v.name,
      type: v.resolvedType,
      valuesByMode: v.valuesByMode
    };
  }).filter(Boolean)
}));

return result;
```

> **Note:** `get_variable_defs` only returns variables already applied to nodes. Always use `use_figma` + Plugin API to retrieve all variables including unused ones.

## Step 2.5: Fetch local text styles

Figma's Variables API only supports single-value types (`COLOR`, `FLOAT`, `STRING`, `BOOLEAN`). Composite typography properties — font weight, line height, letter spacing bundled with a family/size — can't be represented as one variable, so many design systems define a `font/size/*` FLOAT variable for size alone and leave weight/line-height/letter-spacing on a **Text Style** instead. If Step 2 only reads Variables, this information is silently missed.

Fetch local text styles in the same `use_figma` call (or a follow-up one):

```js
const textStyles = await figma.getLocalTextStylesAsync();

const result = textStyles.map(s => ({
  id: s.id,
  name: s.name,
  fontFamily: s.fontName.family,
  fontStyle: s.fontName.style,
  fontSize: s.fontSize,
  fontWeight: s.fontWeight, // may be undefined depending on the API/version
  lineHeight: s.lineHeight, // { value, unit: 'PIXELS' | 'PERCENT' } or { unit: 'AUTO' }
  letterSpacing: s.letterSpacing // { value, unit: 'PIXELS' | 'PERCENT' }
}));

return result;
```

> Not every file defines meaningful values on every field (e.g. `lineHeight` is often `AUTO`, `letterSpacing` is often `0`). Only emit a token when the value is present and adds information beyond the Tailwind default — partial coverage is still better than silently dropping the data.

### Converting text style fields to tokens

For each text style, convert the name the same way as variables (slash → kebab-case, e.g. `Heading/Hero` → `heading-hero`), then:

- **`fontWeight`** → `--font-weight-<name>: <weight>;` (utility: `font-<name>`)
  - If `fontWeight` is not returned by the API, derive it from `fontStyle` via this table: Thin=100, ExtraLight/UltraLight=200, Light=300, Regular/Normal=400, Medium=500, SemiBold/DemiBold=600, Bold=700, ExtraBold/UltraBold=800, Black/Heavy=900. For combined style names like "Display ExtraLight", match the weight keyword (ExtraLight=200) and ignore the prefix.
- **`lineHeight`** → `--leading-<name>: <ratio>;` (utility: `leading-<name>`)
  - `unit: 'PERCENT'` → `value / 100` (e.g. 150 → `1.5`)
  - `unit: 'PIXELS'` → `value / fontSize` (unitless ratio, matches Tailwind's `leading-*` convention)
  - `unit: 'AUTO'` → skip (no token needed; browser default is fine)
- **`letterSpacing`** → `--tracking-<name>: <em>em;` (utility: `tracking-<name>`)
  - `unit: 'PERCENT'` → `value / 100` em (percent-of-font-size already equals the em value)
  - `unit: 'PIXELS'` → `value / fontSize` em
  - Skip if the resulting value rounds to `0`
- **`fontFamily`** → only emit `--font-<name>: "<fontFamily>", <fallback>;` if no matching `font/family/*` STRING variable was already found in Step 2 for this family. If a variable already covers it, skip to avoid duplicating the same font stack under two token names.
- **`fontSize`** → skip; this is already covered by `font/size/*` FLOAT variables in the common case. Only fall back to emitting `--text-<name>` here if Step 2 found zero font-size variables at all (i.e. sizes live only on text styles, not variables).

Do not attempt to deduplicate weight/leading/tracking values that happen to be identical across multiple text styles — keep one token per style name. The goal is not losing information, not building a minimal/normalized scale; consolidation is a judgment call for whoever reviews the output afterward.

## Step 3: Map variables to CSS custom properties

Convert Figma variables to Tailwind v4 CSS custom properties.

### Name conversion rules

Convert Figma variable names (slash-separated) to kebab-case:
- Collection name is used as a comment
- The last path segment becomes the property name (e.g. `colors/brand/500` → `brand-500`)
- Slash-separated groups are joined with hyphens (e.g. `font/size/xl` → `text-xl`)
- If Figma uses hyphens to represent decimals in names (`0-5`, `1-5`), convert to underscores in CSS (`0_5`, `1_5`)

### Property name prefix by type

| Figma type | Collection/variable name hint | CSS custom property prefix | Example |
|---|---|---|---|
| `COLOR` | `colors/*` | `--color-` | `--color-brand-500` |
| `FLOAT` | `size/*` | `--spacing-` | `--spacing-4` |
| `FLOAT` | `radius/*` | `--radius-` | `--radius-md` |
| `FLOAT` | `border/*` | `--border-` | `--border-2` |
| `FLOAT` | `font/size/*` | `--text-` | `--text-base` |
| `FLOAT` | `font/weight/*` | `--font-weight-` | `--font-weight-bold` |
| `STRING` | `font/family/*` | `--font-` | `--font-base` |
| `STRING` | other | `--` | `--easing-default` |

### COLOR value conversion

- Figma colors are returned as `{ r, g, b, a }` in the 0–1 range
- Convert `r, g, b` to 0–255 integers and format as two-digit hex: `#rrggbb`
- If alpha < 1.0, use `rgba(r, g, b, a)` format (r, g, b as 0–255 integers)
- Example: `{ r: 0.533, g: 0.414, b: 0.347, a: 1 }` → `Math.round(0.533*255) = 136 = 0x88` → `#886a59`

### FLOAT value conversion

- Convert px to rem (÷ 16)
- Exception: value `0` → `0`; value `1` for px-type variable names → `1px`

### Mode handling

- If a collection has multiple modes (light/dark, etc.), use the value from the **`defaultModeId`** mode

## Step 3.5: Check for collisions with Tailwind's reserved namespaces

**Do this before writing anything.** Tailwind v4 reads `@theme` by literal key match — a generated name that happens to match one of Tailwind's own reserved patterns silently overrides real Tailwind behavior *project-wide*, not just in the file this skill touches. This has caused real breakage (an entire page's spacing collapsing/inflating, default gray shades silently replaced) — always run both checks below on every generated property name before Step 4.

**Class 1 — Spacing/sizing scale collision (`--spacing-<N>`)**

Tailwind v4 computes every numeric spacing/sizing utility (`p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `size-*`, `inset-*`, `top-*`, `text-*` line-height shorthand, …) as `calc(var(--spacing) * N)` — **unless** a literal `--spacing-<N>` key exists in `@theme`, in which case that value wins for *every* utility using that number, everywhere in the project, not just spacing-labeled ones.

**Any `--spacing-<N>` where `<N>` is a bare integer or decimal is a *naming* collision by construction** — but whether it's a *problem* depends on whether the value also matches. A Figma spacing variable named by its raw px value (e.g. `spacing/16` = 16px) and Tailwind's multiplier-based utility number (`p-16` = 16 × the base unit) only mean the same thing when Figma's px value happens to equal `N × base unit`. So check the value before deciding what to do:

1. Find the project's effective spacing base unit: look for a `--spacing:` override in the target CSS file's `@theme` block; if absent, Tailwind v4's default is `0.25rem` (4px).
2. Compute what Tailwind's default scale already produces for this exact key: `default_value = N × base_unit`.
3. Compare to the Figma-derived value (in the same unit, allow for rounding):
   - **Identical** → the Figma value already matches Tailwind's own scale at that number. **Do not write this token at all** — writing an identical override adds noise for no benefit, since the plain utility (`p-16`, `gap-16`, …) already produces the correct value with zero setup. Note it in the report as "skipped — already matches Tailwind's default spacing scale."
   - **Different** (the common case — this is what caused a real production break: a `spacing/120` = 120px Figma token colliding with `--spacing-120`, which Tailwind's default scale already means 480px) → rename to avoid silently overriding the utility project-wide: `--spacing-<N>` → `--spacing-fig-<N>` (utilities become `p-fig-4`, `gap-fig-16`, etc. — still readable, zero collision risk). If the collection name gives a more specific, meaningful disambiguator, prefer that instead (e.g. `--spacing-card-16`).

**Class 2 — Default color palette collision (`--color-<family>-<step>`)**

Tailwind v4 ships a default palette under these family names, each with steps `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`:
`slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose`.

If a generated `--color-<name>` splits (on the last hyphen) into a `<family>` from that list **and** a `<step>` from that list — e.g. `--color-neutral-100`, `--color-gray-400` — it silently overrides that one built-in step project-wide, including in files this skill never touched. This is especially easy to trigger because Figma design systems commonly use exactly these words (`neutral`, `gray`, `slate`, …) as semantic color-group names.

Rename only the entries that actually collide (family **and** step both match a Tailwind default): insert a disambiguator before the step, e.g. `--color-neutral-100` → `--color-neutral-fig-100`. Leave non-colliding names alone — e.g. `--color-neutral-110` (110 isn't a standard step) or `--color-brand-primary` (brand isn't a default family) need no change.

Same principle as Class 1 applies in theory (if the Figma color happens to be pixel-identical to Tailwind's default at that family+step, overriding is a harmless no-op) — but skip the value-comparison here: Tailwind's defaults are defined in OKLCH and Figma colors arrive as sRGB, so an exact match is both expensive to verify and astronomically unlikely to occur by coincidence. Treat every family+step match as needing a rename.

**Reporting:** collect every renamed token (old name → new name, and why) — this feeds into the Step 5 report so the user can see what changed.

## Step 4: Write to the Tailwind CSS entry file

### Find the output file

Use the `Bash` tool to locate the CSS file that imports Tailwind:

Search for CSS files containing `@import "tailwindcss"` or `@import 'tailwindcss'` across the project (excluding `node_modules`/`dist`).

- If **one file** is found → use it as the output target
- If **multiple files** are found → ask the user which one to use
- If **no file** is found → warn the user that no Tailwind CSS v4 entry file was detected, and ask them to provide the output path

### Check the existing file

Read the target file and check whether an `@theme` block already exists.

### Write patterns

**Case A: `@theme` block already exists**

Append variables inside the existing `@theme` block. If a key already exists, overwrite (update) it.

**Case B: No `@theme` block exists**

Insert a new `@theme` block immediately after `@import "tailwindcss";`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-brand-500: #886a59;
}
```

### Output format

Separate sections by collection/group with comments:

```css
@theme {
  /* Brand */
  --color-brand-50: #fff2ea;
  --color-brand-500: #886a59;

  /* Spacing (primitives/size) */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-4: 1rem;

  /* Border Radius (primitives/radius) */
  --radius-none: 0;
  --radius-md: 0.375rem;
  --radius-full: 9999px;

  /* Font Size (primitives/font/size) */
  --text-base: 0.9375rem;
  --text-xl: 1.25rem;

  /* Font Family (primitives/font/family) */
  --font-base: "Noto Sans JP", sans-serif;

  /* Font Weight (primitives/font/weight) */
  --font-weight-bold: 700;

  /* Text Styles: weight/leading/tracking not covered by Variables (Step 2.5) */
  --font-weight-heading-hero: 300;
  --leading-heading-hero: 1;
  --tracking-heading-hero: -0.01em;
}
```

## Step 5: Report completion

Report the following:
- Number of collections and total variables imported
- Number of local text styles found, and how many weight/leading/tracking tokens were derived from them (Step 2.5)
- List of added/updated CSS custom properties (count per group)
- **Tokens affected by a Tailwind reserved-namespace collision check (Step 3.5)**: split into two lists — renamed (old name → new name, and which class it was) and skipped (value already matched Tailwind's default scale, so no token was written), or "none" if nothing collided
- Mode name used (if multiple modes were present)
- Path to the output CSS file

## Error handling

- If fileKey cannot be extracted from the URL: ask the user to provide a valid Figma design file URL
- If 0 variables and 0 text styles are found: report that the file has no Variables or Text Styles defined
- If no CSS file with `@import "tailwindcss"` is found: warn the user that Tailwind CSS v4 does not appear to be set up in this project, and ask them to provide the output path
- If `use_figma` returns an error: check the error message before retrying (the operation is atomic — no partial writes occur)
