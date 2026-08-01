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
- Mode name used (if multiple modes were present)
- Path to the output CSS file

## Error handling

- If fileKey cannot be extracted from the URL: ask the user to provide a valid Figma design file URL
- If 0 variables and 0 text styles are found: report that the file has no Variables or Text Styles defined
- If no CSS file with `@import "tailwindcss"` is found: warn the user that Tailwind CSS v4 does not appear to be set up in this project, and ask them to provide the output path
- If `use_figma` returns an error: check the error message before retrying (the operation is atomic — no partial writes occur)
