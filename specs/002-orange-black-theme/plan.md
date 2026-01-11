# Implementation Plan: Subtle Orange & Black Color Scheme

**Branch**: `002-orange-black-theme` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-orange-black-theme/spec.md`

## Summary

Update the Hometown Services website color scheme to use orange as the primary accent color and black/near-black for text and structural elements. The implementation focuses on modifying CSS custom properties in `globals.css` to achieve a subtle, professional appearance that avoids the "Bengal tiger" effect by using orange sparingly (20-30% of visible color area) while maintaining WCAG AA contrast compliance.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
**Storage**: N/A (styling change only)
**Testing**: Vitest + React Testing Library (visual regression optional)
**Target Platform**: Web (Vercel hosting)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: No impact on page load time (CSS variable changes only)
**Constraints**: WCAG AA contrast compliance (4.5:1 normal text, 3:1 large text)
**Scale/Scope**: Site-wide color update affecting ~15 CSS variables in globals.css

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Type Safety | N/A | No TypeScript changes; CSS variables only |
| II. Simplicity First | PASS | Modifying existing CSS variables, no new abstractions |
| III. Security by Default | N/A | Styling change has no security implications |
| IV. Performance Awareness | PASS | CSS variables have no performance impact |
| V. Accessibility | PASS | WCAG AA contrast compliance is a core requirement |

**Technology Standards**: Using existing Tailwind CSS + shadcn/ui stack. No new dependencies required.

**Gate Status**: PASS - No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-orange-black-theme/
├── plan.md              # This file
├── research.md          # Phase 0 output - color palette research
├── data-model.md        # Phase 1 output - color token definitions
├── quickstart.md        # Phase 1 output - implementation guide
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── globals.css      # PRIMARY: CSS custom properties to modify
├── components/          # Uses Tailwind classes referencing CSS vars
└── lib/

tailwind.config.ts       # Already configured to use CSS variables
```

**Structure Decision**: This is a styling-only change. All modifications will be in `src/app/globals.css` where the CSS custom properties (`:root` and `.dark` selectors) define the color tokens. No new files needed; the existing shadcn/ui architecture already supports this pattern.

## Complexity Tracking

No violations to justify. This is a minimal change to existing infrastructure.
