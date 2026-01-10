# Data Model: Color Token Definitions

**Feature**: 002-orange-black-theme
**Date**: 2026-01-09

## Overview

This document defines the color token structure for the orange and black theme. Since this is a styling-only feature using CSS custom properties, the "data model" consists of token names, their values, and their semantic purposes.

---

## Entity: Color Token

A color token is a named CSS custom property that provides a semantic color value for the theme.

### Token Structure

```
--{semantic-name}: {hue} {saturation}% {lightness}%;
```

Tokens use HSL format without the `hsl()` wrapper, as shadcn/ui applies `hsl(var(--token))` in Tailwind config.

### Token Categories

| Category | Purpose | Example Tokens |
|----------|---------|----------------|
| **Primary** | Main accent color, CTAs | `--primary`, `--primary-foreground` |
| **Secondary** | Supporting backgrounds | `--secondary`, `--secondary-foreground` |
| **Accent** | Highlights, links | `--accent`, `--accent-foreground` |
| **Muted** | Disabled, subtle elements | `--muted`, `--muted-foreground` |
| **Background/Foreground** | Page-level colors | `--background`, `--foreground` |
| **Card/Popover** | Elevated surfaces | `--card`, `--card-foreground` |
| **Border/Input** | Form elements | `--border`, `--input` |
| **Ring** | Focus indicators | `--ring` |
| **Destructive** | Error states | `--destructive`, `--destructive-foreground` |

---

## Light Mode Token Values

| Token | HSL Value | Hex Equivalent | Purpose |
|-------|-----------|----------------|---------|
| `--background` | `30 15% 97%` | #F9F7F5 | Page background (warm off-white) |
| `--foreground` | `20 8% 18%` | #312D2A | Body text (warm near-black) |
| `--card` | `0 0% 100%` | #FFFFFF | Card backgrounds |
| `--card-foreground` | `20 10% 12%` | #221E1C | Card text (darker for headings) |
| `--popover` | `0 0% 100%` | #FFFFFF | Popover backgrounds |
| `--popover-foreground` | `20 10% 12%` | #221E1C | Popover text |
| `--primary` | `25 90% 35%` | #A64E0D | Primary orange (buttons) |
| `--primary-foreground` | `0 0% 100%` | #FFFFFF | White text on primary |
| `--secondary` | `30 12% 94%` | #F2EFEB | Secondary backgrounds |
| `--secondary-foreground` | `20 10% 12%` | #221E1C | Text on secondary |
| `--muted` | `30 10% 92%` | #EDE9E5 | Muted backgrounds |
| `--muted-foreground` | `20 4% 50%` | #857F7A | Muted text |
| `--accent` | `25 85% 40%` | #A65116 | Accent orange (links) |
| `--accent-foreground` | `0 0% 100%` | #FFFFFF | Text on accent |
| `--destructive` | `0 84% 60%` | #EF4444 | Error red |
| `--destructive-foreground` | `0 0% 100%` | #FFFFFF | Text on destructive |
| `--border` | `30 8% 88%` | #E3DFDB | Border color |
| `--input` | `30 8% 88%` | #E3DFDB | Input border |
| `--ring` | `25 90% 35%` | #A64E0D | Focus ring (matches primary) |
| `--radius` | `0.5rem` | - | Border radius (unchanged) |

---

## Dark Mode Token Values

| Token | HSL Value | Hex Equivalent | Purpose |
|-------|-----------|----------------|---------|
| `--background` | `25 8% 8%` | #161413 | Page background (warm dark) |
| `--foreground` | `30 8% 90%` | #E8E5E2 | Body text (warm light) |
| `--card` | `25 6% 14%` | #262321 | Elevated card surfaces |
| `--card-foreground` | `30 8% 90%` | #E8E5E2 | Card text |
| `--popover` | `25 6% 14%` | #262321 | Popover backgrounds |
| `--popover-foreground` | `30 8% 90%` | #E8E5E2 | Popover text |
| `--primary` | `25 65% 55%` | #D9874A | Primary orange (desaturated) |
| `--primary-foreground` | `25 8% 8%` | #161413 | Dark text on primary |
| `--secondary` | `25 6% 14%` | #262321 | Secondary backgrounds |
| `--secondary-foreground` | `30 8% 90%` | #E8E5E2 | Text on secondary |
| `--muted` | `25 5% 20%` | #35312E | Muted backgrounds |
| `--muted-foreground` | `30 5% 70%` | #B5B1AD | Muted text |
| `--accent` | `25 60% 50%` | #CC7A3D | Accent orange |
| `--accent-foreground` | `25 8% 8%` | #161413 | Text on accent |
| `--destructive` | `0 63% 31%` | #812626 | Error red (darker) |
| `--destructive-foreground` | `30 8% 90%` | #E8E5E2 | Text on destructive |
| `--border` | `25 5% 22%` | #3A3633 | Border color |
| `--input` | `25 5% 22%` | #3A3633 | Input border |
| `--ring` | `25 65% 55%` | #D9874A | Focus ring |

---

## State Transitions

### Interactive Elements

| State | Modification | Example |
|-------|--------------|---------|
| Default | Base token value | `--primary`: `25 90% 35%` |
| Hover | Lighten by 7% | Hover: `25 90% 42%` |
| Active/Pressed | Darken by 5% | Active: `25 95% 30%` |
| Focus | Add ring using `--ring` | Focus ring visible |
| Disabled | Use `--muted` | Reduced opacity |

### Button States (Light Mode)

| State | Background HSL | Effect |
|-------|----------------|--------|
| Default | `25 90% 35%` | Burnt orange |
| Hover | `25 90% 42%` | Lighter |
| Active | `25 95% 30%` | Darker |
| Disabled | `30 10% 92%` | Muted gray |

---

## Validation Rules

1. **WCAG AA Contrast**: All foreground/background pairs must maintain 4.5:1 minimum contrast ratio
2. **Hue Consistency**: All orange tokens must use hue 25 (±3 degrees)
3. **Saturation Range**: Primary orange saturation between 60-95%
4. **Lightness Range**: Primary orange lightness between 30-60%
5. **Dark Mode Desaturation**: Dark mode orange saturation ≤ light mode saturation

---

## Relationships

```
--primary ─────────> Buttons, primary CTAs
     │
     └──> --ring (focus states use same color)

--accent ─────────> Links, highlights
     │
     └──> Hover underlines, icon tints

--foreground ─────> Body text
     │
     ├──> --card-foreground (same or darker)
     └──> --popover-foreground (same or darker)

--background ─────> Page background
     │
     ├──> --card (same or lighter/elevated)
     └──> --secondary (same or slightly tinted)
```

---

## CSS Implementation Preview

```css
:root {
  --background: 30 15% 97%;
  --foreground: 20 8% 18%;
  --primary: 25 90% 35%;
  --primary-foreground: 0 0% 100%;
  /* ... remaining tokens */
}

.dark {
  --background: 25 8% 8%;
  --foreground: 30 8% 90%;
  --primary: 25 65% 55%;
  --primary-foreground: 25 8% 8%;
  /* ... remaining tokens */
}
```
