# Memoir '44 Bot Layout Fix

## Diagnosis

The current deliverable is [bots/memoir44_bot.html](bots/memoir44_bot.html).

The card data and rendering loop append cards to `#bot-hand` in the existing `hand` array order, so the JavaScript is not reordering the cards. The layout regression is in the `v3` desktop CSS:

- A `@media (min-width: 900px)` rule applies `display: grid !important` to both `#view-setup` and `#view-game`.
- `#view-game` is structurally a vertical flow containing status, scenario intelligence, `#bot-hand`, the control panel, and the log.
- Turning that parent into a two-column grid makes those sibling blocks become grid items, which causes the hand and controls to spread across the page instead of letting the hand own the card layout.
- The hand's DOM order remains the source order, but the unexpected parent grid makes the visual arrangement appear incorrectly ordered/spaced.

`v2` kept `#view-game` as a column flex container and does not contain this desktop rule, which is the confirming regression comparison.

## Implementation Plan

1. Apply the fix directly to `bots/memoir44_bot.html`; do not create or bump a versioned file.
2. Scope the desktop layout rule so it does not turn `#view-game` into a grid. Keep `#view-game` as a vertical flex container at every viewport width, including its scrolling behavior.
3. Keep any desktop two-column treatment limited to setup content only if it is still needed after visual inspection. Do not use a broad selector that changes the display mode of both views.
4. Make `#bot-hand` the sole owner of card placement:
   - preserve DOM insertion order;
   - use centered, stable card tracks sized around `--card-w`;
   - prevent cards from stretching into oversized fractional columns;
   - keep the grid responsive on narrow screens;
   - use top alignment for a predictable hand rather than vertically centering rows in the available panel.
5. Confirm that the decision-state and executed-card states still render correctly inside the restored vertical flow, including the active-card highlight and controls.

## Validation

- Run `node --check` against the extracted inline script from `bots/memoir44_bot.html`.
- Serve the repository with a local static server and open the new bot in a browser.
- At a desktop viewport, start a game and verify that status, hand, controls, and log are stacked vertically; verify cards form a centered, evenly spaced hand.
- Compare each card's DOM index with its rendered `getBoundingClientRect()` position to ensure visual row/column order follows insertion order.
- At mobile and narrow desktop widths, verify cards remain within the panel, do not overlap, and remain scrollable.
- Exercise `ANALYZE BOT DECISION`, `YES`, `NO`, section choice, and new-turn flows to ensure layout changes do not break state transitions.
- Check the browser console for errors and capture desktop/mobile screenshots for visual comparison.

## Implementation Status

Implemented directly in `bots/memoir44_bot.html`:

- Removed the desktop rule that converted `#view-game` into a two-column grid.
- Changed hand columns to centered tracks capped at `--card-w`.
- Changed hand row alignment to start at the top of the hand area.
- Added `box-sizing: border-box` to cards so padding does not expand their rendered width.
- Added Hoth-style section ratings before card evaluation.
- Combined card urgency (40%) with section priority (60%) and preserved hand order on ties.
- Added fixed-section badges and rating context during evaluation.
- Made the analyzed result panel non-shrinking so the executed card stays contained.

## Completion Criteria

- Cards appear in the same order as the `hand` array and DOM.
- Cards no longer spread into the parent view's unrelated columns.
- The hand remains readable and centered at desktop widths and usable on mobile.
- `v3` is the corrected implementation; no new version file is required.