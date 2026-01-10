# Tasks: Subtle Orange & Black Color Scheme

**Input**: Design documents from `/specs/002-orange-black-theme/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in specification. Visual verification only.

**Organization**: Tasks are organized by user story priority (P1, P2, P3) to enable incremental delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No setup required - modifying existing infrastructure only

*This feature requires no project initialization. The CSS variable architecture is already in place.*

**Checkpoint**: Ready to proceed directly to implementation.

---

## Phase 2: Foundational

**Purpose**: No foundational work required

*All color tokens are defined in existing `globals.css`. No new files, dependencies, or database changes needed.*

**Checkpoint**: Ready to proceed to user story implementation.

---

## Phase 3: User Story 1 - Visual Brand Consistency (Priority: P1) MVP

**Goal**: Apply orange and black color palette to the site, establishing brand identity through CSS variable updates.

**Independent Test**: Load any page and visually verify:
- Orange appears as accent color on buttons, links, icons
- Black/near-black appears in text and headers
- Background is warm off-white
- No "Bengal tiger" effect (orange feels balanced, not overwhelming)

### Implementation for User Story 1

- [x] T001 [US1] Update light mode `:root` color variables in src/app/globals.css
- [x] T002 [US1] Update dark mode `.dark` color variables in src/app/globals.css
- [x] T003 [US1] Verify visual appearance by running dev server (`npm run dev`)

**Checkpoint**: Site displays with orange/black brand colors. US1 complete.

---

## Phase 4: User Story 2 - Readable and Accessible Content (Priority: P2)

**Goal**: Ensure all color combinations meet WCAG AA contrast requirements.

**Independent Test**: Run contrast checker on key combinations:
- Body text on background (expect ≥4.5:1)
- Button text on orange (expect ≥4.5:1)
- Muted text on background (expect ≥4.5:1)

### Implementation for User Story 2

- [x] T004 [US2] Verify primary button contrast using WebAIM Contrast Checker
- [x] T005 [US2] Verify body text contrast on background
- [x] T006 [US2] Verify muted/secondary text contrast
- [x] T007 [US2] Adjust any failing contrast values in src/app/globals.css (if needed)

**Checkpoint**: All text meets WCAG AA contrast. US2 complete.

---

## Phase 5: User Story 3 - Consistent Interactive Feedback (Priority: P3)

**Goal**: Verify hover, focus, and active states work correctly with the new palette.

**Independent Test**: Interact with buttons, links, and form elements:
- Hover states change color appropriately
- Focus rings appear in orange
- Active states provide feedback

### Implementation for User Story 3

- [x] T008 [US3] Test button hover states across the site
- [x] T009 [US3] Test focus ring visibility on interactive elements
- [x] T010 [US3] Test link hover states and visited link differentiation
- [x] T011 [US3] Add hover state CSS variables if Tailwind defaults insufficient (optional, in src/app/globals.css)

**Checkpoint**: Interactive feedback works consistently. US3 complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T012 Test dark mode toggle (if implemented) to verify palette switches correctly
- [x] T013 Verify all pages display consistently (homepage, services, contact, etc.)
- [x] T014 Run `npm run build` to ensure no CSS compilation errors
- [x] T015 Perform final visual review against quickstart.md testing checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A - no setup required
- **Foundational (Phase 2)**: N/A - no foundational work required
- **User Story 1 (Phase 3)**: Can start immediately - CSS changes only
- **User Story 2 (Phase 4)**: Depends on US1 completion (need colors applied to test contrast)
- **User Story 3 (Phase 5)**: Depends on US1 completion (need colors applied to test interactions)
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - start immediately
- **User Story 2 (P2)**: Requires US1 complete (colors must be applied to verify contrast)
- **User Story 3 (P3)**: Requires US1 complete (colors must be applied to verify interactions)

### Within Each User Story

- US1: Sequential execution (T001 → T002 → T003)
- US2: T004-T006 can run in parallel; T007 depends on findings
- US3: T008-T010 can run in parallel; T011 only if needed

### Parallel Opportunities

Tasks marked [P] are not applicable for this feature since:
- US1 tasks modify the same file sequentially
- US2 verification tasks don't modify files
- US3 verification tasks don't modify files

However, **US2 and US3 can be worked in parallel** after US1 completes.

---

## Parallel Example: After US1 Completes

```bash
# After T001-T003 complete, both verification stories can run in parallel:

# Team Member A - Accessibility (US2):
Task: "Verify primary button contrast using WebAIM Contrast Checker"
Task: "Verify body text contrast on background"
Task: "Verify muted/secondary text contrast"

# Team Member B - Interactive Feedback (US3):
Task: "Test button hover states across the site"
Task: "Test focus ring visibility on interactive elements"
Task: "Test link hover states and visited link differentiation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1 (T001-T003)
2. **STOP and VALIDATE**: Visual inspection confirms brand colors applied
3. Deploy preview to Vercel for stakeholder review

### Incremental Delivery

1. US1: Apply colors → Visual review → Deploy preview
2. US2: Verify accessibility → Fix any issues → Confirm AA compliance
3. US3: Verify interactions → Polish if needed → Final review
4. Polish: Cross-page consistency check → Build verification → Done

### Single Developer Strategy

Since this is a styling-only change:
1. Complete T001-T003 (apply colors) - ~10 minutes
2. Complete T004-T007 (verify accessibility) - ~15 minutes
3. Complete T008-T011 (verify interactions) - ~10 minutes
4. Complete T012-T015 (polish) - ~10 minutes

**Total estimated effort**: ~45 minutes

---

## Notes

- All changes confined to `src/app/globals.css`
- No TypeScript, no database, no new dependencies
- Existing shadcn/ui components automatically pick up new colors via CSS variables
- If contrast fails verification, refer to data-model.md for adjusted HSL values
- Rollback: `git checkout src/app/globals.css`
