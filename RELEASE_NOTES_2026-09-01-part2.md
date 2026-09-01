# Release Notes — 2026-09-01 (part 2)

Covers everything staged for commit on top of the previous `d53fec7` release (catalog cleanup, shared theme kit, Eleven redesign, Stone Age voice pilot). Two workstreams from `plan_diegetic_next_level.md` Phase 1 are completed in this batch: **in-character voice** (item 1, full catalog rollout) and **CC0 textures + ambient flavor animations** (items 2-3, prioritized rollout).

## 1. In-character voice — full catalog rollout complete

Every bot's log/status text has now been either rewritten into its in-fiction narrator voice or explicitly investigated and left untouched with a documented reason (no more silent gaps).

Rewritten this batch (PT + EN, every dynamic value/placeholder preserved, zero game-logic changes):
- **`arknova_arno_bot.html`** — new additive "zoo field log" flavor line above the existing numeric stat readout (which stays untouched, players rely on exact numbers).
- **`utek_bot.html`** — royal-advisor/court-counsel voice ("My lord, …") across all 10 log call sites.
- **`sanctuary_bot.html`** — additive zoo/nature-reserve flavor line, same pattern as Ark Nova (official Ark Nova spinoff, same code shape).
- **`Heroscape_bot.html`** — tactical battle-analyzer/military-uplink voice for all Automated Battle Analyzer roll results.
- **`Mystic_Vale_bot.html`** — additive atmospheric flavor line ("Corruption spreads, twisting growth into decay.") above the unchanged, precise physical-action instructions.
- **`7_wonders_duel_bot.html`** — ancient-rivalry/herald voice for all log events.
- **`lotr_duel_bot.html`** — Middle-earth/duel voice for all log events; also fixed an inconsistent untranslated "Chapter" string in the PT dictionary.
- **`air_land_sea_bot.html`** — atmospheric military-command tone for setup/game-over strings (only narrative surface this bot has).
- **`mistborn_bot.html`** — Allomancy/mist voice across all ~13 inline log call sites.
- **`space_base_bot.html`** — atmospheric suffix added to the 3 most narratively meaningful log events only (kept the technical VP/dice-audit log entries as-is).
- **`lostcities.html`** — rival-explorer/expedition voice for all log actions. **Also fixed two real bugs found along the way**: (1) the REPLACE/RESERVE action types had no dedicated log branch and silently fell through to generic "Discarded" wording; (2) the "End Round" button did not open the score calculator/summary screens (`hidden` class + `!important` CSS rule was permanently overriding the inline `display:block` toggle) — affected both Solo-vs-Automa and standalone Calculator modes.
- **`cafe_baras_bot.html`** — warm capybara-barista café voice for all 5 log events.

Investigated and intentionally left unchanged:
- **`thunder_road_vendetta_bot.html`** — no narrator/log text exists at all (pure card-activation visualizer); inventing one would be new-feature scope, not a copy rewrite.
- **`burgundy_bot.html`** — pure dice/decision-helper tool, no narrative text worth rewriting.

Validation per bot: `node --check` on the extracted inline script, `npm run visual-check <bot>` (0% or below-threshold diff — a few flagged diffs were re-confirmed as a pre-existing random setup-card-shuffle false positive, not a regression), and live interactive passes confirming the new phrasing renders with correct dynamic values in both languages.

## 2. CC0 background textures + ambient flavor animations

Rolled out to the 4 highest-priority remaining bots (Sanctuary, Thunder Road Vendetta, Café Baras, UTEK), in addition to Stone Age and Ark Nova which already had this treatment from an earlier pass:

| Bot | Texture (ambientCG, CC0) | Ambient animation |
|---|---|---|
| `stone_age_bot.html` | cave-ground.jpg (Ground110) | firelight pulse + embers |
| `arknova_arno_bot.html` | cork-board.jpg (Cork001) | canopy glow + fireflies |
| `sanctuary_bot.html` | forest-floor.jpg (ScatteredLeaves009) | canopy glow + fireflies |
| `thunder_road_vendetta_bot.html` | rusted-metal.jpg (Metal063) | wasteland haze + embers/sparks |
| `cafe_baras_bot.html` | dark-walnut.jpg (Wood051) | warm glow + rising coffee steam |
| `utek_bot.html` | old-parchment.jpg (Paper004) | torchlight glow + embers |

All textures are CC0 (no attribution required), resized to 512×512/quality 72 and layered subtly behind panels via each bot's existing `body` background-image stack. All ambient animations are pure CSS (no new JS/libraries), wrapped in `@media (prefers-reduced-motion: no-preference)`, and use `position:fixed; z-index:-1` so they never interfere with layout or interaction.

**`sanctuary_bot.html` also received a full palette retheme**: its previous dark navy/gold/purple "gothic fantasy" look didn't match the real game's bright teal/green/tan nature-photography box art (Sanctuary is Ark Nova's companion game). Recolored to a forest-green/amber/dusty-rose palette grounded in the actual box art, keeping every CSS variable name unchanged (only values changed) to avoid missed references.

**Found and fixed one real pre-existing bug along the way**: `thunder_road_vendetta_bot.html` had a `body::before` background layer referencing a nonexistent `image_df155c.jpg` (silent 404, invisible/wasted layer) — replaced with the new CC0 rusted-metal texture in the same CSS slot.

A systemic `.hero` banner crop bug (portrait box art cropped to an unreadable ~40px sliver by a wide/short hero container) was fixed earlier on Stone Age and Ark Nova, and applied again to Sanctuary. It was correctly assessed as **not applicable** to Thunder Road Vendetta, Café Baras and UTEK — each already shows its box art legibly (an intentional dark decorative wash with a separate title, or, on UTEK, an already-built full-visibility "contain card" layout).

Validation per bot: `get_errors` clean, computed-style checks (`animationName`, `zIndex:-1`) confirming the animations are wired correctly, and live screenshots confirming no layout regressions or console errors.

## 3. Space Base — custom "stellar" 3D dice theme

Added `assets/dice-box/themes/stellar/` (custom `@3d-dice/dice-box` theme: diffuse/normal/specular maps + config), wired into `space_base_bot.html`'s dice tray via `externalThemes`, replacing the default theme with one matching the bot's space palette.

## 4. Docs

`plan_diegetic_next_level.md` updated with completion status for Phase 1 items 1 (voice, full catalog), 2 (textures) and 3 (ambient animations), including per-bot notes and links to the reusable patterns now logged in repo memory.

## Validation summary

- `node --check` clean on every modified bot's extracted inline script.
- Visual regression (`npm run visual-check`) at 0% or below-threshold diff for every touched bot; a couple of flagged diffs were confirmed as a pre-existing random card-shuffle-on-load false positive, not a regression.
- Live interactive passes (desktop + mobile) confirmed zero console/page errors and correct rendering across languages for every touched bot.
- Existing game logic, state persistence and solo-mode behavior unchanged everywhere — this batch is text/visual/asset only.

## Next steps

1. Push to `staging` for real-device testing.
2. Promote to `main` only on explicit request (per the `deploy-to-prod` skill).
3. Continue Phase 1 items 2-4 (textures/ambiance) rollout to the rest of the bot catalog if desired, or move to Phase 2 (real sampled SFX).
