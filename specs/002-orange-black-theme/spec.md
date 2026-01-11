# Feature Specification: Subtle Orange & Black Color Scheme

**Feature Branch**: `002-orange-black-theme`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Change color scheme to orange and black in a subtle, pleasing way that avoids looking like a Bengal tiger"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Brand Consistency (Priority: P1)

A site visitor browses the Hometown Services website and immediately recognizes the brand through its distinctive orange and black color palette. The colors are applied subtly—orange used as an accent color for calls-to-action and highlights, while black (or near-black) provides grounding in text and structural elements. The overall impression is professional and inviting, not overwhelming or garish.

**Why this priority**: Brand identity is the core purpose of this change. The customer specifically requested orange and black, making visual brand consistency the primary deliverable.

**Independent Test**: Can be fully tested by viewing any page on the site and verifying that orange appears as an accent color and black/near-black appears in text and structural elements, while the overall palette feels balanced and professional.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** they view the page, **Then** they see orange used sparingly as an accent color (buttons, links, icons) and black/near-black in text and headers
2. **Given** a visitor views any page, **When** they assess the overall color balance, **Then** the page does not feel dominated by orange (no "Bengal tiger" effect)
3. **Given** a visitor views the site on both light and dark modes (if applicable), **When** comparing the two modes, **Then** the orange and black theme is consistently applied in both contexts

---

### User Story 2 - Readable and Accessible Content (Priority: P2)

A site visitor reads content on any page without eye strain. The contrast between text and backgrounds meets accessibility standards. Orange is never used as a background for large text blocks, and sufficient contrast exists between all color combinations used.

**Why this priority**: Accessibility and readability are essential for user experience and legal compliance. A beautiful color scheme that's hard to read fails its purpose.

**Independent Test**: Can be tested by running accessibility contrast checkers on the site and verifying all text meets WCAG AA contrast requirements.

**Acceptance Scenarios**:

1. **Given** any page with body text, **When** checking contrast ratios, **Then** the text-to-background contrast meets WCAG AA standards (minimum 4.5:1 for normal text)
2. **Given** a call-to-action button with orange styling, **When** checking the button text contrast, **Then** the text is clearly readable against the orange background
3. **Given** a visitor with color vision deficiency views the site, **When** they interact with the site, **Then** they can distinguish interactive elements (not relying solely on color)

---

### User Story 3 - Consistent Interactive Feedback (Priority: P3)

A visitor interacting with buttons, links, and form elements receives clear visual feedback. Hover states, focus states, and active states use variations of the orange/black palette to indicate interactivity without jarring color shifts.

**Why this priority**: Interactive feedback completes the user experience by making the site feel responsive and polished.

**Independent Test**: Can be tested by hovering over buttons, focusing on form fields, and clicking links to verify visual state changes are present and use the color palette consistently.

**Acceptance Scenarios**:

1. **Given** a visitor hovers over a primary button, **When** the hover state activates, **Then** the button color shifts to a darker or lighter orange variant
2. **Given** a visitor tabs through the page, **When** an element receives focus, **Then** a visible focus indicator appears using the brand colors
3. **Given** a visitor clicks a link, **When** viewing visited vs unvisited links, **Then** the difference is subtle but distinguishable within the color palette

---

### Edge Cases

- What happens when orange is displayed on a monitor with poor color calibration? (Fallback: colors should still be distinguishable even if hue shifts)
- How does the palette perform in high-contrast mode or forced colors mode? (System should respect user accessibility preferences)
- What happens with user-generated content that includes colored elements? (Should not clash with site palette)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use orange as the primary accent color for interactive elements (buttons, links, highlights)
- **FR-002**: System MUST use black or near-black (dark charcoal) as the primary color for text, headers, and structural elements
- **FR-003**: System MUST maintain a neutral background (white, off-white, or light gray in light mode; dark gray or near-black in dark mode) to prevent orange overload
- **FR-004**: System MUST limit orange usage to no more than 20-30% of any given page's visible color area to avoid the "Bengal tiger" effect
- **FR-005**: System MUST provide appropriate hover, focus, and active states using variations of the orange/black palette
- **FR-006**: System MUST ensure all text meets WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- **FR-007**: System MUST apply the color scheme consistently across all pages and components
- **FR-008**: System MUST support both light and dark modes with appropriate orange/black variations for each

### Key Entities

- **Color Token**: Represents a named color value used throughout the site (e.g., primary, accent, background). Each token has a light mode value and a dark mode value.
- **Interactive State**: Represents the visual appearance of an element in different states (default, hover, focus, active, disabled). States reference color tokens.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of pages display the orange/black color scheme consistently when visually audited
- **SC-002**: All text elements achieve WCAG AA contrast compliance (verified via automated accessibility testing)
- **SC-003**: No page displays more than 30% orange in its visible color area (verified via visual inspection or design review)
- **SC-004**: Users describe the site as "professional" or "clean" rather than "loud" or "overwhelming" when surveyed about first impressions
- **SC-005**: The color scheme is recognizable as the customer's brand by stakeholders upon visual review

## Assumptions

- The site currently uses CSS custom properties (CSS variables) for theming, allowing centralized color changes
- The customer does not have a formal brand guide with specific hex values—reasonable orange and black shades will be selected for aesthetic appeal
- "Subtle" means orange is used as an accent (10-20% of visual area) rather than a dominant color
- Both light mode and dark mode should be updated (if dark mode exists)
- The change applies site-wide, not to specific sections only
- No new functionality is being added—this is purely a visual/styling change

## Out of Scope

- Logo redesign or branding assets beyond the website colors
- Creation of a formal brand guide document
- Changes to layout, typography, or component structure
- Marketing materials or external assets
