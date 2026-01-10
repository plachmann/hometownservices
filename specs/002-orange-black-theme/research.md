# Research: Subtle Orange & Black Color Scheme

**Feature**: 002-orange-black-theme
**Date**: 2026-01-09

## Research Summary

This document captures color palette research and decisions for implementing a professional orange and black theme that avoids the "Bengal tiger" effect.

---

## Decision 1: Primary Orange Shade

**Decision**: Use burnt orange/rust tones with HSL hue of 25 degrees

**Rationale**: Burnt orange (hue ~25) is warmer and more professional than bright orange (hue ~30-35). At 85% saturation and 40% lightness, it provides a rich accent without being aggressive. This shade has earthy, sophisticated associations versus the "construction cone" look of pure orange.

**Alternatives Considered**:
- Pure orange (hue 30, 100% saturation): Too bright, neon-like appearance
- Amber (hue 38-45): Too golden, loses the "orange" identity
- Terracotta (hue 18): Too red, shifts toward coral

**Selected Values**:
- Primary accent: `hsl(25, 85%, 40%)` (#A65116)
- Button color (AA safe for white text): `hsl(25, 90%, 35%)` (#A64E0D) - contrast ratio ~5.5:1

---

## Decision 2: WCAG-Compliant Button Colors

**Decision**: Darken orange to 35% lightness for white text buttons

**Rationale**: Standard bright oranges fail WCAG AA contrast requirements when paired with white text. Testing shows that orange must be darkened to approximately 35% lightness in HSL to achieve the required 4.5:1 contrast ratio for normal text.

**Alternatives Considered**:
- Black text on orange buttons: Achieves AA but looks less premium
- Light orange buttons with dark text: Works but loses CTA impact
- Bright orange with AA exception for large text only: Inconsistent UX

**Selected Values**:
- Button default: `hsl(25, 90%, 35%)` - 5.5:1 contrast with white
- Button hover: `hsl(25, 90%, 42%)` - slight lightening on hover
- Button active: `hsl(25, 95%, 30%)` - darker on press

---

## Decision 3: Near-Black Text Colors

**Decision**: Use warm near-black with slight orange undertone

**Rationale**: Pure black (#000000) on white creates harsh contrast that can cause eye strain. A warm near-black with HSL hue of 20-25 degrees creates softer, more inviting typography while maintaining excellent readability. This also creates subtle cohesion with the orange accent.

**Alternatives Considered**:
- Pure black (#000000): Too harsh, clinical feel
- Blue-tinted black (hue ~220): Conflicts with warm orange palette
- Neutral gray-black (hue 0): Works but lacks warmth

**Selected Values**:
- Headings: `hsl(20, 10%, 12%)` (#221E1C)
- Body text: `hsl(20, 8%, 18%)` (#312D2A)
- Secondary text: `hsl(20, 5%, 35%)` (#5C5755)
- Muted text: `hsl(20, 4%, 50%)` (#857F7A)

---

## Decision 4: Neutral Backgrounds

**Decision**: Use warm off-white with subtle orange tint for light mode

**Rationale**: Pure white (#FFFFFF) is acceptable for cards and content areas, but a slightly warm off-white for page backgrounds creates a more inviting feel and subtle visual hierarchy. The warmth complements the orange accent without competing.

**Alternatives Considered**:
- Pure white everywhere: Acceptable but cold
- Cool gray backgrounds: Conflicts with warm palette
- Strongly tinted cream: Too yellow, looks dated

**Selected Values**:
- Page background: `hsl(30, 15%, 97%)` (#F9F7F5)
- Cards/content: `hsl(0, 0%, 100%)` (#FFFFFF)
- Borders: `hsl(30, 8%, 88%)` (#E3DFDB)
- Input backgrounds: `hsl(30, 12%, 94%)` (#F2EFEB)

---

## Decision 5: Orange Usage Limits (60-30-10 Rule)

**Decision**: Apply the 60-30-10 color distribution rule

**Rationale**: The 60-30-10 rule is a proven interior design and UI principle that prevents any single accent color from overwhelming the design. With orange limited to 10% of visible area, it serves as a clear signal for interactivity without creating visual fatigue.

**Application**:
- 60% - Neutral backgrounds (white, off-white)
- 30% - Secondary colors (near-black text, warm grays)
- 10% - Orange accent (buttons, links, highlights, icons)

**Orange Placement Guidelines**:
- DO use for: Primary CTA buttons, important links, active nav states, key icons
- DON'T use for: Large backgrounds, body text, navigation bars, headers/footers

---

## Decision 6: Dark Mode Adaptation

**Decision**: Desaturate orange by 20% and increase lightness for dark mode

**Rationale**: Saturated colors on dark backgrounds cause "visual vibration" and eye strain. Reducing saturation while increasing lightness maintains visibility and brand recognition without overwhelming dark mode users.

**Dark Mode Surface Strategy**:
- Use warm dark gray (#161413) as base, not pure black
- Elevate cards/modals with lighter grays for depth
- Maintain orange hue identity while adjusting saturation/lightness

**Selected Values** (Dark Mode):
- Primary orange: `hsl(25, 65%, 55%)` (#D9874A)
- Base surface: `hsl(25, 8%, 8%)` (#161413)
- Elevated surface: `hsl(25, 6%, 14%)` (#262321)
- Text primary: `hsl(30, 8%, 90%)` (#E8E5E2)
- Text secondary: `hsl(30, 5%, 70%)` (#B5B1AD)

---

## Complete Palette Reference

### Light Mode

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| primary | `hsl(25, 90%, 35%)` | #A64E0D | Buttons, primary accent |
| primary-foreground | `hsl(0, 0%, 100%)` | #FFFFFF | Text on primary |
| secondary | `hsl(30, 12%, 94%)` | #F2EFEB | Secondary backgrounds |
| secondary-foreground | `hsl(20, 10%, 12%)` | #221E1C | Text on secondary |
| accent | `hsl(25, 85%, 40%)` | #A65116 | Links, highlights |
| accent-foreground | `hsl(0, 0%, 100%)` | #FFFFFF | Text on accent |
| background | `hsl(30, 15%, 97%)` | #F9F7F5 | Page background |
| foreground | `hsl(20, 8%, 18%)` | #312D2A | Body text |
| card | `hsl(0, 0%, 100%)` | #FFFFFF | Card backgrounds |
| card-foreground | `hsl(20, 10%, 12%)` | #221E1C | Card text |
| muted | `hsl(30, 10%, 92%)` | #EDE9E5 | Muted backgrounds |
| muted-foreground | `hsl(20, 4%, 50%)` | #857F7A | Muted text |
| border | `hsl(30, 8%, 88%)` | #E3DFDB | Borders |
| input | `hsl(30, 8%, 88%)` | #E3DFDB | Input borders |
| ring | `hsl(25, 90%, 35%)` | #A64E0D | Focus rings |
| destructive | `hsl(0, 84%, 60%)` | #EF4444 | Error states |
| destructive-foreground | `hsl(0, 0%, 100%)` | #FFFFFF | Text on destructive |

### Dark Mode

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| primary | `hsl(25, 65%, 55%)` | #D9874A | Buttons, primary accent |
| primary-foreground | `hsl(25, 8%, 8%)` | #161413 | Text on primary |
| secondary | `hsl(25, 6%, 14%)` | #262321 | Secondary backgrounds |
| secondary-foreground | `hsl(30, 8%, 90%)` | #E8E5E2 | Text on secondary |
| accent | `hsl(25, 60%, 50%)` | #CC7A3D | Links, highlights |
| accent-foreground | `hsl(25, 8%, 8%)` | #161413 | Text on accent |
| background | `hsl(25, 8%, 8%)` | #161413 | Page background |
| foreground | `hsl(30, 8%, 90%)` | #E8E5E2 | Body text |
| card | `hsl(25, 6%, 14%)` | #262321 | Card backgrounds |
| card-foreground | `hsl(30, 8%, 90%)` | #E8E5E2 | Card text |
| muted | `hsl(25, 5%, 20%)` | #35312E | Muted backgrounds |
| muted-foreground | `hsl(30, 5%, 70%)` | #B5B1AD | Muted text |
| border | `hsl(25, 5%, 22%)` | #3A3633 | Borders |
| input | `hsl(25, 5%, 22%)` | #3A3633 | Input borders |
| ring | `hsl(25, 65%, 55%)` | #D9874A | Focus rings |
| destructive | `hsl(0, 63%, 31%)` | #812626 | Error states |
| destructive-foreground | `hsl(30, 8%, 90%)` | #E8E5E2 | Text on destructive |

---

## Sources

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WCAG 2.1 Contrast Requirements: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Material Design Dark Theme: https://m2.material.io/design/color/dark-theme.html
- 60-30-10 Color Rule: https://uxplanet.org/the-60-30-10-rule-a-foolproof-way-to-choose-colors-for-your-ui-design-d15625e56d25
- shadcn/ui Themes: https://ui.shadcn.com/themes
