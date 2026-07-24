# AGENTS.md

This document contains guidelines for agentic coding assistants working in this repository.

## Project Overview

One Blog is a minimal React-based blog writing application using:

- React 19.2.4 + TypeScript 5.8.3
- Vite+ (vite-plus) as unified toolchain: build, lint (Oxlint), format (Oxfmt)
- Tailwind CSS 4.1.18 for styling
- Shadcn/ui (Radix UI) for components
- TipTap 3.18.0 for rich text editing
- pnpm as package manager

## Development Commands

```bash
pnpm dev              # Start development server (vp dev)
pnpm build            # Build for production (tsc + vp build)
pnpm lint             # Run Oxlint on all files (vp lint)
pnpm format           # Format all files (vp fmt)
pnpm preview          # Preview production build (vp preview)
vp check              # Run format check + lint + typecheck together
```

**Testing:** No test framework is currently configured. To add tests, first set up a framework (e.g., Vitest).

## Code Style Guidelines

### Formatting (Oxfmt, configured in `vite.config.ts`)

- **Quotes:** Single quotes (`'`) — explicit override; Oxfmt default is double quotes
- **Tailwind classes:** Auto-sorted (`sortTailwindcss`) — explicit override, not on by default
- Everything else (semicolons, trailing commas, 2-space indent, **100-char line width**, `package.json` key sorting) uses Oxfmt's own defaults — don't restate a default in `vite.config.ts`.

### Lint Configuration (Oxlint, configured in `vite.config.ts`)

- `react`, `typescript`, `oxc` plugins with type-aware linting enabled
- Only project-specific rule deltas are listed explicitly (e.g. `react/rules-of-hooks`); everything else relies on Oxlint's own built-in recommended defaults — don't restate a default in `vite.config.ts`.

### TypeScript

- **Path alias:** Use `@/` prefix for imports from `src/` directory
  - Example: `import { cn } from '@/lib/utils'`
- Always use explicit types for function parameters
- Use `type` for simple unions/intersections, `interface` for object shapes
- Avoid `any` - use `unknown` for truly unknown types

### Imports Order

```typescript
// 1. External libraries (3rd party)
import { useState } from 'react';
import { EditorContent } from '@tiptap/react';

// 2. Internal modules with @/ alias
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

### Naming Conventions

- **Components:** PascalCase (`Button`, `SettingsMenu`, `Tiptap`)
- **Functions/Hooks:** camelCase (`cn`, `toggleFocus`, `useEditor`)
- **Constants:** PascalCase (`buttonVariants`, `fillerWordPatterns`)
- **Variables:** camelCase (`editor`, `wordCount`, `exportDialogOpen`)
- **Files:** kebab-case (`settings-menu.tsx`, `filler-word-highlight.ts`)

### Component Guidelines

- Use default export for components: `export default function ComponentName() {}`
- Props typed as inline object for simple components:
  ```typescript
  export default function Component({ prop1, prop2 }: { prop1: string; prop2: number });
  ```
- For reusable components with variant props, use `class-variance-authority`:
  ```typescript
  const buttonVariants = cva("base-classes", {
    variants: { variant: {...}, size: {...} }
  });
  ```
- Always use `cn()` utility for merging Tailwind classes

### React Hooks

- Use `React.useState()` for local state (import React explicitly)
- Prefer `React.useState(initialValue)` over `React.useState(() => initialValue)` unless initial value is expensive
- Use functional updates when new state depends on old state: `setPrev(prev => !prev)`

### Type Imports

- Use `import type` for type-only imports when possible
- Example: `import type { JSONContent } from '@tiptap/react'`

### Styling

- Use Tailwind CSS for all styling
- Dark mode support via `dark:` prefix (e.g., `dark:prose-invert`)
- Use Shadcn/ui components as building blocks
- Custom classes should use the `cn()` helper for merging with existing classes

### Error Handling

- The project currently has minimal error handling conventions
- When adding error boundaries or error handling, follow React patterns

### Git Hooks

- Vite+ manages git hooks via `.vite-hooks/` (`core.hooksPath`)
- Pre-commit runs `vp staged`, which formats staged files per the `staged` config in `vite.config.ts`

## File Structure

```
src/
├── app.tsx                 # Root App component
├── main.tsx                # Entry point
├── components/
│   ├── ui/                 # Shadcn/ui components
│   └── theme-provider.tsx  # Theme context provider
├── features/               # Feature-based modules
│   └── writer/
├── lib/
│   └── utils.ts            # Shared utilities (cn helper)
```

## Notes

- No tests currently exist - adding a test framework (Vitest recommended) would be beneficial
- The project uses pnpm lockfile - always use pnpm for dependency management
- TypeScript path alias `@/*` resolves to `./src/*`
