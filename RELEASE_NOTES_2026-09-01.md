# Release Notes — 2026-09-01

Status: **everything below is done locally, in the working tree — nothing has been committed or pushed yet.** Nothing has reached `staging` or `main`. This file is a summary for review before committing.

## 1. Bot catalog cleanup: dropped versioned filenames

All 19 bots in `bots/*.html` were renamed to drop version suffixes (`_v1`, `_v2`, `RC2`, etc.), since `staging`/`main` + git history already provide the safety net a versioned filename used to provide.

- Examples: `stone_age_bot_v2.html` → `stone_age_bot.html`, `hoth_bot_v1.html` → `hoth_bot.html`, `mick_bot_RC3.html` → `mick_bot.html`, `utek_bot_v2.html` → `utek_bot.html`.
- Old/superseded duplicate versions deleted (e.g. `Colletes-hoth_bot_RC3.html` through `RC8.html`, `mistborn_bot_v2.html`, `memoir44_bot_v1.html`/`v2.html`).
- Updated every internal reference to the old filenames: `index.html`, `README.md`, `assets/bot-view.js` (analytics bot-ID map), `plan.md`, `plan_utek.md`.
- **Mistborn edge case caught and fixed**: `bots/mistborn_bot_v3.html` had already been committed to `staging`/`origin/staging` in a separate, since-paused task (see `plan_mistborn_fix.md`) — it wasn't a duplicate to discard. Renamed `mistborn_bot_v3.html` → `mistborn_bot.html` (keeping that real content) and removed the orphaned older `mistborn_bot.html` duplicate. `plan_mistborn_fix.md` updated so the paused task's notes stay accurate.
- Validated: `node --check` passed on all 18 renamed bots' extracted inline scripts; `git status` confirmed only the intended renames/deletions/reference updates.

## 2. Phase 0 — Shared theme kit + visual regression safety net

Goal: stop the recurring "redesign broke the layout again" bugs by (a) sharing genuinely-duplicated UI code instead of copy-pasting it per bot, and (b) adding an automated screenshot-diff check that would have caught those regressions immediately.

- **New `tools/visual-regression.mjs`** (Playwright + pixelmatch): captures desktop (1440px) and mobile (390px) screenshots of every bot and diffs them against committed baselines.
  - `npm run visual-check [file...]` — compare current render vs. baseline (all bots if no args).
  - `npm run visual-update [file...]` — (re)write baselines after a confirmed-intentional visual change.
  - New devDependencies: `playwright`, `pixelmatch`, `pngjs`.
- **New `tools/visual-baselines/`**: 38 baseline PNGs (19 bots × 2 viewports), captured from the current (post-rename) state of every bot. `.gitignore` updated with an explicit override so these aren't swept up by the repo's blanket `*.png` ignore rule.
- **New `assets/theme-kit.css`**: only the pieces confirmed genuinely identical across bots — `fadeSlideUp`/`popIn` keyframes, the `.icon-inline` em-relative icon utility, and the `.credits` (box-art thumbnail + credit text) component, customizable per-bot via `--tk-credits-*` CSS variables.
  - **Scope note**: investigation found `.hero`, `.lang-switch`, and `.btn-help-float` are NOT safely unifiable — the catalog actually uses 3 different, deliberately distinct nav/help-button layouts across bots. Forcing them into one shared component would be a real visual redesign, not a mechanical extraction, so they were intentionally left out of the shared kit.
- **New `assets/theme-kit.js`**: `ThemeKit.setAmbientIcon(active, labelText)` helper for the ambient-sound button's icon-swap pattern (currently duplicated in `hoth_bot.html` and `memoir44_bot.html`).
- **Pilot migration**: `bots/mick_bot.html`'s `.credits` component now consumes `theme-kit.css` instead of a local copy, via `--tk-credits-*` overrides. Verified 0.03–0.04% pixel diff against baseline (font-rendering noise, not a regression).
- **`.agents/skills/boardbot-creator/SKILL.md`** updated (Section 14) with accurate, concrete usage instructions for the finalized (narrower-than-originally-planned) shared kit, the "3 layout families" finding, and known visual-regression false positives (`arknova_arno_bot.html`/`sanctuary_bot.html` randomize card order on load).
- Remaining 18 bots are **not yet migrated** to `theme-kit.css`/`.js` — planned as an incremental, one-bot-at-a-time effort during future redesign passes, not a batch job.

## 3. Phase 1 (started) — In-character voice in log/status text

Goal: make each bot *read* like its in-fiction character instead of a generic UI with a theme applied.

- **Usage data pulled first** (Phase 4 of the plan): queried the public Firestore `counters` collection directly (reads are public per `firestore.rules`) for real per-bot page-view counts, to prioritize rollout order instead of guessing.
  - Top bots by views: `eleven_bot.html` (195, already has strong in-character voice — match commentary + procedural campaign story), `stone_age_bot.html` (124), `arknova_arno_bot.html` (110), `utek_bot.html` (89), `hoth_bot.html` (88, already done in the first diegetic pass), `thunder_road_vendetta_bot.html` (59), `mick_bot.html` (55), `memoir44_bot.html` (45, already done), `cafe_baras_bot.html` (39), `sanctuary_bot.html` (35).
- **Pilot done on `bots/stone_age_bot.html`** (#1 by views among bots not yet given a voice pass): rewrote all Automa-mode and Official-Solo-Mode log strings, in both PT and EN, from plain mechanical phrasing into a "tribal chronicle" voice.
  - Example: *"Automa alocou em [8] Cabana de Agricultura: agricultura +1"* → *"Os campos do Automa florescem em [8] Cabana de Agricultura — agricultura avança para 1."*
  - All dynamic data (position, resource/card name, points, round number, dice rolls) preserved — only the phrasing changed.
  - No new abstraction introduced: the bot's existing `S().logXxx(...)` i18n dictionary already serves as the "flavor string table," so this was a pure content rewrite with zero structural or call-site changes.
- **Validated**: `node --check` on the extracted script (no syntax errors); `npm run visual-check stone_age_bot.html` (0.000% diff — a text-content-only change, as expected); a live interactive pass (both game modes, both languages) confirming the new log lines render correctly.
- Confirmed one **pre-existing, unrelated quirk** (not a regression): history log entries don't retranslate on a language switch after they're written — same documented behavior already seen elsewhere in the codebase (e.g. Mystic Vale's undo).
- **Remaining rollout** (not yet done): `arknova_arno_bot.html`, `utek_bot.html`, `thunder_road_vendetta_bot.html`, `cafe_baras_bot.html`, `sanctuary_bot.html`, and the rest of the catalog — one bot at a time, in usage-ranked order.

## Not started yet

- Phase 1 items 2–4 (free CC0 textures/icons, flavor animations, optional 3D models).
- Phase 2 (real sampled SFX, haptics, remaining 3D-dice rollout).
- Phase 3 (PWA/offline support).

## Next steps

1. Review this working-tree state (`git status` / `git diff`).
2. Commit and push to `staging` for real-device testing (per the `deploy-to-prod` skill, `main` only gets updated on explicit request).
3. Continue the Phase 1 in-character-voice rollout to the next bot (`arknova_arno_bot.html`), or pick a different Phase 1 sub-item.
