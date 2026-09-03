# Handoff — Diegetic UI plan, next steps (2026-09-02)

Full roadmap lives in [plan_diegetic_next_level.md](plan_diegetic_next_level.md) — this file is just
a short pointer to what's actually left to do, so a future session can pick up without re-reading
the whole (long) plan doc history.

## Status recap

- **Phase 0 (shared kit/infra), Phase 1 (voice, textures, ambiance, icon polish, tools pages), Phase 2
  items 3+4 (dice-box rollout + bespoke themes), Phase 4 (usage-data prioritization): all DONE.**
- **Phase 3 (PWA/offline) and Phase 5 (print materials): explicitly REMOVED from scope**, do not
  resurrect unless the user asks again.
- Everything below is what remains.

## Remaining work, in priority order

### 1. Phase 2 item 1 — Real sampled sound effects (not started, biggest remaining piece)
Replace/supplement the synth-oscillator bleeps (currently only in `tools/dice_roller_v1.html`) with
real short CC0 sampled audio.
- Sources (CC0 only, no attribution needed): [Kenney.nl](https://kenney.nl/assets) audio packs
  (Interface Sounds, RPG Audio, Sci-Fi Sounds), [OpenGameArt.org](https://opengameart.org) (filter to
  CC0), [freesound.org](https://freesound.org) (filter strictly to CC0).
- Store files under `assets/sfx/{shared|game}/` (new folder).
- Add a shared `playSfx(key)` helper to `assets/theme-kit.js` (preload + play an `<audio>`/
  `AudioBuffer`) instead of duplicating audio-loading code per bot — same shared-kit approach as
  Phase 0.
- Keep the existing oscillator synths only for cheap ambient/background texture (wind hum, distant
  murmur); use real samples for discrete action feedback (card flip, dice clatter, coin drop, sword
  clash, seal stamp), genre-tuned per bot.
- Any CC-BY sample used must get a credit line added to `credits.html`.
- Suggested rollout order: prioritize by the same Firestore `view-<bot>` usage ranking already used
  for Phase 1 item 1 (see `plan_diegetic_next_level.md` Phase 1 item 1 for the query + current
  ranking), start with `tools/dice_roller_v1.html` since it's the one place synth bleeps already
  exist, then the highest-usage bots with dice-box (Stone Age, Ark Nova, etc.).

### 2. Phase 2 item 2 — Haptics (small, not started)
- Add `navigator.vibrate(...)` short buzz pattern on dice roll / critical result, mobile only
  (feature-detect `navigator.vibrate` before calling).
- Currently unused anywhere in the codebase — cheap, contained addition once a natural hook point
  (e.g. inside `rollDiceSafe` in `assets/dice-roller.js`) is chosen.

### 3. Phase 1 item 4 — Flavor 3D models (optional/opportunistic, not a requirement)
- `<model-viewer>` (Google web component, one `<script type="module">` tag, no bundler) loading a
  free CC0 glTF model from [Poly Pizza](https://poly.pizza) for a hero-banner flourish (rotating die/
  coin/token/ship).
- Only do this where a genuinely fitting free CC0 model exists — never fabricate/assume a source.
  Treat as opportunistic per-bot polish, not a catalog-wide pass.

## Loose end spotted this session (not part of the plan, flagged for awareness)

`bots/lostcities.html` has an **uncommitted local edit** (not made by this agent this session —
picked up via an environment change-notification): the Setup instructions text
(`lc_setup_2`) and the `Show card to bot:` label got a new `id="inputPromptText"` and updated
English copy about the bot starting with cards in reserve. Looked like a mid-edit, so it was left
untouched. Check `git diff bots/lostcities.html` before starting new work there — either finish/
commit that edit first or confirm it's intentional before it gets overwritten by something else.

## Conventions to follow (already established, see `.agents/skills/boardbot-creator/SKILL.md`)

- Single-file HTML per bot, no build step.
- Validate every change: `node --check` on the extracted inline `<script>`, then
  `node tools/visual-regression.mjs <bot>.html` (or `npm run visual-check <bot>.html`), then a live
  Playwright pass (desktop 1440px + mobile 390px, zero console errors, no horizontal overflow) —
  **for anything touching dice-box rendering specifically, include an actual screenshot of the
  rendered dice, not just state-flag checks** (see the Thunder Road Vendetta post-ship bug in
  `plan_diegetic_next_level.md` Phase 2 item 3 for why that matters).
- Ship to `staging` first; only promote to `main` when explicitly asked (`deploy-to-prod` skill).
- Any new non-CC0 asset (audio, texture, image) gets a credit line in `credits.html`.
