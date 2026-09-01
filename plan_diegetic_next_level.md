# Diegetic UI — Next Level (full plan)

## Context

The first diegetic pass (Hoth "Echo Base Holocron", Tiny Epic Kingdoms medieval kingdom, Memoir'44 war bulletin, plus 3D physics dice via `@3d-dice/dice-box`) is merged to production. This plan covers the next round of improvements requested: go deeper on immersion, and consider options beyond plain HTML/JS/CSS where it pays off.

**Revision note (2026-09-01):** updated per user directive — no voice narration, no physical/print component (boardbots stays simple and 100% virtual), no native app wrapper for now; Phase 1 expanded to cover free textures/images/animations/flavor models more broadly; Phase 2 SFX redirected from synth bleeps toward real sampled sound effects.

Constraints carried over from the existing codebase/conventions:
- Each bot stays a single-file HTML deliverable (no bundler/build step introduced).
- Game logic, state persistence, and both solo modes (where applicable) must stay unchanged — these are visual/sensory/infra changes only.
- **No more versioned filenames** (`_v2`, `RC2`, etc.). Bot files were renamed (2026-09-01) to drop version suffixes (e.g. `stone_age_bot.html`, `hoth_bot.html`, `utek_bot.html`) — since `staging` + git history already provide the safety net a versioned filename used to provide, every future pass edits the live bot file in place.
- Validate with `node --check` on extracted inline `<script>` + live browser check (console errors, desktop 1440px / mobile 390px, no horizontal overflow) before every commit, same as prior passes.
- Ship through `staging` first, promote to `main` only when explicitly requested (per `deploy-to-prod` skill).
- Boardbots stays simple and 100% virtual — no physical/print deliverables, no native app packaging.

## Phase 0 — Foundation (do this before any new bot-specific polish)

**Status (2026-09-01): done for the pieces that are genuinely safe to share; rest is incremental.**

Goal: stop the recurring "redesign broke the layout again" bugs seen in Hoth/UTEK by making shared UI pieces a real shared asset instead of copy-pasted CSS/JS per bot.

1. ✅ Extracted `assets/theme-kit.css` (keyframes `fadeSlideUp`/`popIn`, `.icon-inline` em-relative icon utility, `.credits`/`.credits img`/`.credits-text` component with `--tk-credits-*` override vars) and `assets/theme-kit.js` (`ThemeKit.setAmbientIcon()` helper for the ambient-sound button icon-swap).
   - **Scope correction found during implementation**: `.hero`, `.lang-switch`, `.btn-help-float` turned out to NOT be safely unifiable — the catalog actually has 3+ deliberately different nav/help-button layout families (sticky top-nav bar, floating circular buttons, plain top-bar buttons) across different bots, not one drifted-apart copy of the same thing. Unifying those would be a real visual redesign per bot, not a mechanical CSS extraction — so only the pieces that really are identical (`.credits`, `.icon-inline`, keyframes) went into the shared kit. Documented in [SKILL.md Section 14](.agents/skills/boardbot-creator/SKILL.md).
2. ✅ `bots/mick_bot.html` migrated as a validated pilot (`.credits` now consumes theme-kit.css via CSS var overrides in `:root`) — confirmed 0.03-0.04% pixel diff (font-rendering noise, not a regression) via the new screenshot-diff tool. Remaining 18 bots migrate incrementally, one per future redesign pass — not a batch job (too risky to do unsupervised across the whole catalog in one pass).
3. ✅ Added `tools/visual-regression.mjs` (Playwright + pixelmatch, local static server via `python3 -m http.server`): `npm run visual-check [files...]` diffs current renders (desktop 1440px + mobile 390px) against committed baselines in `tools/visual-baselines/`; `npm run visual-update [files...]` (re)writes baselines. Baselines for **all 19 bots** captured and committed (gitignore has an explicit override so these PNGs aren't swept up by the repo's general `*.png` ignore rule).
4. Effort: medium, one-time infra + ongoing small effort per bot migrated. Payoff: every future bot pass gets safer and faster.
5. **Standing instruction:** this has been added to [.agents/skills/boardbot-creator/SKILL.md](.agents/skills/boardbot-creator/SKILL.md) as a mandatory step for any AI agent creating/updating a bot, so it survives beyond this one plan/session.

## Phase 1 — Deepen the diegesis itself, expanded to all bots + richer free assets

**Status (2026-09-01): item 1 (in-character voice) started — pilot done on `stone_age_bot.html`, ranked #1 by usage among untouched bots.**

Right now the reskins are mostly color/texture/frame. The next level is making the bot *read* like the in-fiction character, not a UI with a theme applied to it — and doing it with richer visual material, not just CSS.

1. **In-character voice in text** (log/status copy), generalized across the whole bot catalog, not just a 3-bot pilot:
   - **Usage-data check (Phase 4) done first**: queried the public Firestore `counters` collection directly (`https://firestore.googleapis.com/v1/projects/boardbots-641cc/databases/(default)/documents/counters`, read is public per `firestore.rules`) for real `view-<bot>` counts. Ranking (excluding `eleven_bot.html`/`hoth_bot.html`/`memoir44_bot.html`, which already have a mature in-character voice from the first diegetic pass and the campaign/match-commentary system respectively): **`stone_age_bot.html` is #1 untouched bot by views (124)**, ahead of `arknova_arno_bot.html` (110), `utek_bot.html` (89), `thunder_road_vendetta_bot.html` (59), `mick_bot.html` (55, already migrated in Phase 0), `cafe_baras_bot.html` (39), `sanctuary_bot.html` (35).
   - **Pilot done**: rewrote all of `stone_age_bot.html`'s Automa-mode and Official-Solo-Mode log strings (`logGameStarted`, `logMarkedOccupied`, `logAllocatedResource/Tool/Mating/Agri`, `logCivPoints/Resource/Food/Agri/Tool/Mixed/Draw`, `logBuildingFixed/Dice`, `logNewRound`, and the `officialLog*` family), PT+EN, from plain mechanical phrasing ("Automa alocou em [8] Cabana de Agricultura: agricultura +1") into tribal-chronicle voice ("Os campos do Automa florescem em [8] Cabana de Agricultura — agricultura avança para 1"), preserving every piece of dynamic data (position, name, points, round, dice rolls) so no information is lost.
   - No new `narrate()`/`FLAVOR` abstraction was introduced — the bot's existing `S().logXxx(...)` i18n dictionary already *is* that abstraction (one key per log event, per-language template functions with placeholders), so the fix was purely rewriting the template string content, zero structural/call-site changes. Future bots should follow the same pattern: look for the existing per-bot `logXxx`/status-message i18n keys first, and only introduce a new table if a bot has no such abstraction yet.
   - Validated: `node --check` on the extracted inline script (no syntax errors), `npm run visual-check stone_age_bot.html` (0.000% diff on both viewports — pure string-content change, no layout impact), and a live Playwright pass exercising both Automa mode (roll allocation → confirmed new log line) and Official Solo Mode (start game → apply feeding, confirmed new log lines) in PT and EN — all render correctly. Confirmed pre-existing (not a regression) quirk: history log entries, once written, don't retranslate on a language switch — same documented behavior as other bots (e.g. Mystic Vale's undo).
   - Remaining rollout (not yet done): `arknova_arno_bot.html`, `utek_bot.html`, `thunder_road_vendetta_bot.html`, `cafe_baras_bot.html`, `sanctuary_bot.html`, etc. — one bot at a time, in usage-ranked order, each its own small pass (find log/status i18n keys → rewrite in-genre → validate the same way).
   - e.g. Hoth = radio-chatter command terminal phrasing; Tiny Epic Kingdoms = royal-advisor counsel ("meu senhor/my lord"); Memoir'44 = field-radio bulletin phrasing; Stone Age = tribal chronicle (done); extend the same idea to every other bot's own fiction (Mistborn = Ministry/underground report, Ark Nova = zoo field log, etc.).
2. **Free textures/images beyond CSS gradients** — sources that are CC0/public-domain (no attribution required, safe for a public repo) or CC-BY (attribution added to `credits.html`, never used silently):
   - **Textures**: [ambientCG](https://ambientcg.com) and [cc0textures.com](https://cc0textures.com) (CC0 seamless material textures — parchment, wood, stone, metal, fabric) for background layers, replacing/supplementing CSS-only noise-SVG textures.
   - **Icons**: [game-icons.net](https://game-icons.net) (CC-BY 3.0, huge library of board-game-relevant SVG icons) as a richer alternative/supplement to the hand-drawn inline SVG icon set already in use.
   - **UI chrome / flavor sprites**: [Kenney.nl](https://kenney.nl/assets) asset packs (all CC0 — UI packs, fantasy/sci-fi icon packs, parchment/wood UI packs) for borders, frames, buttons, badges matching each bot's genre.
   - **Flavor photography/illustration**: CC0 sources only ([unsplash.com](https://unsplash.com)/[pexels.com](https://pexels.com) license-permitting, or public-domain illustration archives) for section-header flavor images (e.g. a snowy tundra photo behind Hoth's status header) — never scrape copyrighted game art beyond the box-cover crops already licensed/used with the physical game's own assets.
   - Any non-CC0 asset used gets a corresponding credit line added to `credits.html`, consistent with how game/solo-mode designer credits are already handled.
3. **Lightweight flavor animations**, still pure CSS/JS (no new runtime dependency beyond what's already used):
   - parallax background layers (2-3 depth layers moving slightly on scroll/mouse) on hero banners.
   - ambient particle effects tuned per theme (falling snow on Hoth, embers/dust on Tiny Epic Kingdoms, static/scanline flicker on sci-fi bots) — same canvas/CSS-particle technique already used for `dice_roller_v1.html`'s VFX.
4. **Flavor "models"** — a few bots could get a small rotating showpiece using [`<model-viewer>`](https://modelviewer.dev) (a free, dependency-light Google web component, just one `<script type="module">` tag, no bundler) loading a free CC0 glTF model (e.g. from [Poly Pizza](https://poly.pizza), filterable by CC0) for a hero-banner flourish (a rotating die, coin, token, ship). Treat as an optional per-bot flourish, not a platform-wide requirement — only where a fitting free CC0 model actually exists; never fabricate/assume a source.

Effort: low-medium per bot for text/animations; textures/icons are a one-time asset-sourcing effort reused across many bots via Phase 0's shared kit; 3D models are opportunistic/optional.

## Phase 2 — Sensory layer: real sound effects + haptics + physical dice everywhere

No voice narration (removed per directive).

1. **Move SFX from synth bleeps toward real sampled sound effects.** The oscillator-only approach in `tools/dice_roller_v1.html` sounds "Atari-like"; replace/supplement it with short CC0 sampled audio:
   - Sources: [Kenney.nl](https://kenney.nl/assets) audio packs (Interface Sounds, RPG Audio, Sci-Fi Sounds — all CC0), [OpenGameArt.org](https://opengameart.org) audio section (filter CC0), [freesound.org](https://freesound.org) (filter strictly to CC0-licensed sounds only).
   - Store short `.ogg`/`.mp3` files under `assets/sfx/{shared|game}/`, played via a small shared helper in `assets/theme-kit.js` (`playSfx(key)`, preloads + plays an `<audio>`/`AudioBuffer`) — consistent with Phase 0's shared-kit approach instead of duplicating audio-loading code per bot.
   - Keep the existing oscillator synths only for cheap ambient/background texture (e.g. a low wind hum, distant murmur) where a real sample isn't needed; use real samples for discrete action feedback (card flip, dice clatter, coin drop, sword clash, seal stamp) tuned per bot's genre.
   - Any CC-BY sample used gets credited in `credits.html`, same rule as Phase 1 assets.
2. **Haptics**: `navigator.vibrate(...)` on dice roll / critical result on mobile — short buzz pattern, cheap addition, currently unused anywhere in the codebase.
3. **Roll out 3D dice to the remaining bots still on `Math.random()`-only rolls**, using the already-validated `rollDiceBoxSafe` timeout + value-sanitization pattern from the dice-hang fix.

Effort: medium. Mostly client-side; the only new "infra" is a handful of small CC0 audio files added to `assets/`, no backend/API involved.

## Phase 3 — Beyond HTML/JS/CSS: installable, offline-capable bots (PWA)

Items 1-3 confirmed; native app wrapper (item 4) dropped for now — a step too far given the "keep it simple, keep it virtual" direction.

1. Add a `manifest.json` + a couple of icon sizes per bot (or one shared manifest keyed by bot, simplest: one per bot since each is already a standalone URL).
2. A minimal service worker caching the bot's own HTML + the dice-box/theme assets it needs, so a bot keeps working at the table with no wifi once opened once.
3. "Add to Home Screen" becomes a real installable app icon, not just a bookmark — this is the single biggest perceived-polish jump for someone actually using these at a game table.

Effort: medium (service worker caching needs care per bot's external assets, e.g. dice-box CDN/self-hosted assets, fonts).

## Phase 4 — Prioritize with data, not guesses

`assets/analytics.js` / Firebase already track usage. Before investing Phase 1/2 effort broadly:
1. Pull which bots get opened/played most.
2. Order the Phase 1 (flavor text/assets) and Phase 2 (sensory) rollout by that ranking instead of alphabetical/arbitrary order.

Effort: low (read existing data), high leverage on where to spend the rest of the plan's effort.

## Phase 5 — Removed

Physical/print companion materials are out of scope per directive: boardbots stays simple and 100% virtual, no physical-world deliverables.

## Open decisions needed before implementation

1. Which phase(s) to start with — recommend Phase 0 first (safety net + the standing skill-file instruction), then Phase 1 asset-sourcing pass + Phase 2 SFX pass, prioritized by Phase 4 usage data.
2. PWA/offline (Phase 3): confirm scope — per-bot install, or a single "shell" app that can load any bot offline.
3. Asset licensing bookkeeping: confirm the CC0-first / credit-CC-BY approach above is acceptable, and that `credits.html` is the right place to log every non-CC0 asset used.

## Validation checklist (applies to every phase)

- `node --check` on every modified bot's extracted inline script.
- Live browser pass: desktop 1440px and mobile 390px, zero console/page errors, no horizontal overflow.
- Existing game logic/state persistence/solo-mode behavior unchanged (exercise a full turn cycle).
- New versioned file created before any substantial pass on a shipped bot (never edit the shipped version in place).
- Every new texture/icon/audio/model asset has a confirmed free license (CC0 preferred) and, if attribution-required, a corresponding entry added to `credits.html`.
- Deploy to `staging` first; promote to `main` only on explicit request.
