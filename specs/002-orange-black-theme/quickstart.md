# Quickstart: Orange & Black Theme Implementation

**Feature**: 002-orange-black-theme
**Date**: 2026-01-09

## Overview

This guide provides step-by-step instructions for implementing the orange and black color scheme. The implementation is minimal—only `globals.css` needs modification.

---

## Prerequisites

- Access to the codebase on branch `002-orange-black-theme`
- Understanding of CSS custom properties (CSS variables)
- Basic familiarity with HSL color format

---

## Implementation Steps

### Step 1: Backup Current Theme (Optional)

Before making changes, you may want to note the current values in `src/app/globals.css` for reference.

### Step 2: Update Light Mode Variables

In `src/app/globals.css`, replace the `:root` selector content with the new orange/black values:

```css
:root {
  --background: 30 15% 97%;
  --foreground: 20 8% 18%;
  --card: 0 0% 100%;
  --card-foreground: 20 10% 12%;
  --popover: 0 0% 100%;
  --popover-foreground: 20 10% 12%;
  --primary: 25 90% 35%;
  --primary-foreground: 0 0% 100%;
  --secondary: 30 12% 94%;
  --secondary-foreground: 20 10% 12%;
  --muted: 30 10% 92%;
  --muted-foreground: 20 4% 50%;
  --accent: 25 85% 40%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 30 8% 88%;
  --input: 30 8% 88%;
  --ring: 25 90% 35%;
  --radius: 0.5rem;
}
```

### Step 3: Update Dark Mode Variables

Replace the `.dark` selector content:

```css
.dark {
  --background: 25 8% 8%;
  --foreground: 30 8% 90%;
  --card: 25 6% 14%;
  --card-foreground: 30 8% 90%;
  --popover: 25 6% 14%;
  --popover-foreground: 30 8% 90%;
  --primary: 25 65% 55%;
  --primary-foreground: 25 8% 8%;
  --secondary: 25 6% 14%;
  --secondary-foreground: 30 8% 90%;
  --muted: 25 5% 20%;
  --muted-foreground: 30 5% 70%;
  --accent: 25 60% 50%;
  --accent-foreground: 25 8% 8%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 30 8% 90%;
  --border: 25 5% 22%;
  --input: 25 5% 22%;
  --ring: 25 65% 55%;
}
```

### Step 4: Verify Changes

1. Run the development server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Visually inspect:
   - Buttons should be burnt orange with white text
   - Body text should be warm near-black
   - Background should be slightly warm off-white
   - Toggle dark mode (if available) and verify dark palette

### Step 5: Accessibility Verification

Run a contrast check on key color combinations:

| Combination | Expected Ratio | Tool |
|-------------|----------------|------|
| Primary button text | ≥ 4.5:1 | WebAIM Contrast Checker |
| Body text on background | ≥ 4.5:1 | Browser DevTools |
| Muted text on background | ≥ 4.5:1 | Browser DevTools |

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/app/globals.css` | Modify | Update CSS variable values in `:root` and `.dark` |

**No other files require changes.** The Tailwind configuration (`tailwind.config.ts`) already references these CSS variables and will automatically use the new colors.

---

## Rollback Procedure

To revert changes, restore the original `globals.css` values:

```css
/* Original :root values */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... etc */
}
```

Or use git: `git checkout src/app/globals.css`

---

## Testing Checklist

- [ ] Homepage displays with orange accent colors
- [ ] Buttons have burnt orange background with white text
- [ ] Body text is readable warm near-black
- [ ] Links show orange color
- [ ] Hover states darken/lighten appropriately
- [ ] Focus rings appear in orange
- [ ] Dark mode (if enabled) shows appropriate palette
- [ ] No visual regression on existing components
- [ ] Contrast meets WCAG AA requirements

---

## Common Issues

### Issue: Orange looks too bright
**Solution**: Verify `--primary` uses `25 90% 35%` (35% lightness, not higher)

### Issue: Text hard to read
**Solution**: Ensure `--foreground` is `20 8% 18%` (dark enough for contrast)

### Issue: Colors not applying
**Solution**: Clear browser cache and hard refresh; verify no CSS overrides

### Issue: Dark mode still blue-tinted
**Solution**: Ensure `.dark` selector values are updated, not just `:root`
