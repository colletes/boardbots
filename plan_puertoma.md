# Implementation Plan — Puerto Rico 1897 (Special Edition): Puertoma Solo Bot

**Target file:** `bots/puerto_rico_bot.html` (no version suffix, edited in place per house style)
**Source manual:** `Puerto Rico/puerto_rico_1897_ed_manual_de_puerto_rico_1897_edi_333938.pdf` (44 pages, PT-BR, full text layer — Puertoma rules on pages 33-41, expansions 23-27 & 40)
**Skill followed:** `.agents/skills/boardbot-creator/SKILL.md`

---

## 1. Open Questions / Assets Still Needed

These were resolved via Q&A during planning, recorded here for traceability:

| Decision | Resolution |
|---|---|
| App architecture | **Decision-brain companion** — user manages the 2 physical Puertoma player boards (buildings, workers, goods) on the table; the app tracks an internal mirror of each Puertoma's state and narrates exactly what to do each phase. (Matches every other Boardbots automa companion.) |
| Player configuration | Support **1 human + 2 Puertomas** (true solo, the rules' intended/balanced mode) **and** **1 human + 1 Puertoma** (explicitly-allowed "practice" mode, flagged in-app as unbalanced). Multi-human (2+ humans + Puertoma) is **out of scope** for v1. |
| Expansion scope | v1 includes **base Puertoma (7 roles)** + **Expansão I: Novos Edifícios** + **Expansão II: Cidadãos**. Expansões III (Contrabandista), IV/V (Festival), VI (Conquistas) are documented as a **Phase 2 / future roadmap**, not built now. |
| Tie-break mechanism | User wants **exact replication** of the 8 physical "Cartas de Desempate", not a generic RNG substitute. **Still needed: clear photos (front showing the printed number + role-priority icons) of all 8 cards**, plus the "Carta de Ajuda do Puertoma" reference card (already partially visible in rulebook diagrams). Until provided, the plan assumes the documented *algorithm* (draw → count available/eligible items left-to-right until reaching the card's printed number → pick that one) and a placeholder uniform 1-8 distribution; card faces will be swapped in once photos arrive. |
| Difficulty levels | Include all 3: **Padrão**, **Fácil** (both Puertomas discard 2 of their 4 ability tokens once 2 are unlocked), **Difícil** (asymmetric fixed setup: both Lvl-1 abilities start pre-unlocked, 1st Puertoma gets a free Lvl-1 building + 1 worker + 1 corn, 2nd gets a free Lvl-2 building + 1 sugar + reduced starting coin). |
| Box art / card thumbnail | **Still needed from user**: Puerto Rico 1897 Special Edition box cover (for `.hero` banner + `assets/art/puertorico.webp` index card). |
| Language | PT + EN, `boardbots_lang` localStorage, standard i18n system. |

**Action needed from you before/while building:** please provide (a) the box art image, and (b) photos of the 8 Desempate cards (or confirm it's fine to ship with an equivalent-logic RNG fallback first and patch in exact card data later — recommended if photos aren't readily available, since it unblocks Phase 1 immediately).

---

## 2. Rules Digest (verified against the PDF)

### 2.1 Role mapping (Special Edition name → classic Puerto Rico role)
| PT name | Classic role | Puertoma profitability condition |
|---|---|---|
| Cultivador | Settler | Can fit any available Plantation tile on its board |
| Recrutador | Mayor | Has ≥1 empty worker space under a Property tile |
| Construtor | Builder | Can afford to build *some* building with available space |
| Produtor | Craftsman | Can produce a good of a type it doesn't have yet |
| Negociante | Trader | Can sell a good for ≥1 coin |
| Capitão | Captain | Can load some good onto a ship |
| Aventureiro | Prospector | Always profitable; **excluded entirely from 3-effective-player games** (1H+2P or 2H+1P), same as classic PR |

"Melhor/pior Produto" order (worst→best, used everywhere for tie-breaks): **Milho → Fruta → Açúcar → Tabaco → Café**.

### 2.2 Puertoma Action Board (adjacency graph — verified visually from the board diagram, page 34)
8-node directed graph (`Aventureiro` + 6 roles in a 2×3 grid), edges = "if action marker is at X, choosing/following Y moves the marker only if X→Y exists":

- `Aventureiro ↔ Construtor` (bidirectional)
- `Aventureiro ↔ Cultivador` (bidirectional)
- `Construtor ↔ Cultivador` (bidirectional, same row)
- `Construtor → Negociante`, `Construtor → Recrutador` (one-way down/diagonal)
- `Cultivador → Recrutador`, `Cultivador → Negociante` (one-way down/diagonal)
- `Negociante ↔ Recrutador` (bidirectional, same row)
- `Negociante → Produtor`, `Negociante → Capitão` (one-way down/diagonal)
- `Recrutador → Capitão`, `Recrutador → Produtor` (one-way down/diagonal)
- `Produtor ↔ Capitão` (bidirectional, same row)
- `Produtor → Construtor` (long loop up the left edge, one-way) — **Expansion III only**: this edge actually routes through `Contrabandista` (Aliciar/Saquear sub-path); for base game (no Contrabandista in play) treat it as a direct `Produtor → Construtor` edge.
- `Capitão → Cultivador` (long loop up the right edge, one-way) — same note, routes through `Contrabandista`/Assaltar when Expansion III is active.

> ⚠️ **Verification flag:** this graph was read directly off a high-res crop of the printed diagram (page 34) and cross-checked against the worked examples on page 36 (both examples match: Construtor→{Cultivador, Recrutador, Negociante} adjacency, and Produtor→{Negociante, Capitão} adjacency). Confidence is high, but worth a final sanity-check against the physical board once in hand, since it's the single most important piece of automa logic.

### 2.3 Selecting a Function (priority order, applied in sequence — filter, don't stop early)
1. A Function **adjacent** to the current Action Marker position (following the graph above), that is **available** (no one chose it yet this round) and **profitable** (see table above).
2. Among remaining candidates: the Function holding **the most coins** (coins accumulate on unchosen Function tiles each round).
3. Tie-break: draw a **Carta de Desempate**; `Contrabandista` always counts as having 2 coins for this tie-break (Expansion III only). Pick the first listed Function (in the card's priority order) that is available & profitable.
4. If a chosen Function has coins on it, the Puertoma collects them before acting.
5. Moving the Action Marker only happens if the *chosen* Function is graph-adjacent to its current position; otherwise the marker stays put (this can happen when priority-2/3 picks a non-adjacent Function).

### 2.4 Role-by-role automa action logic (page 37-39)
- **Construtor**: builds the *highest-level* building it can afford with space available, never a duplicate. Ties on cost → draw Desempate, count tied buildings left-to-right up to the card's number, build the last one counted. No quarry discounts for Puertoma. Skips if nothing buildable (and Construtor becomes "not profitable" in that case, see §2.3 step 1 exclusion). **Ability unlock rule**: habilidades unlock on building the **2nd** Lvl-1/2/3 building and the **1st** Lvl-4 building (not occupancy-based like humans' trade building perks — Puertomas never use their built Commercial buildings' passive perks, only unlocked ability tokens).
- **Cultivador**: always takes a Property tile if board space remains (max 2 of each type, quarries unlimited). Priority: (1) a type it already has one of, (2) best product type (worst→best order, reversed = best-first), (3) a quarry (even without choosing the role). No pick if no quarries remain and no other option.
- **Recrutador**: new workers allocated to *inactive* Property with the **fewest empty slots** (tie → best property type); once ALL board properties are active, extra workers go straight to the VP bank (never re-shuffled). **Agência de Empregos fill formula**: `Σ empty building slots (human boards) + MAX(empty worker slots under any single Puertoma property)` — i.e. only the single worst (emptiest) Puertoma property counts, not the sum across Puertomas.
- **Produtor**: produces everything possible from active Properties (no production buildings required for Puertoma — it's abstracted to Property-only). Gets +1 of its best produced good if it chose the role (Vantagem).
- **Negociante**: sells 1 crate of its best sellable good, only if it earns ≥1 coin.
- **Capitão**: loads the good it can load the *most* crates of; tie → loads the worse good; tie on ship choice → the ship with least remaining capacity that still fits the max amount. Stores 1 crate of its best good at end of phase; rest spoil.
- **Aventureiro**: gains the Function's coin (plus any token coins). Not used in 3-effective-player games.

### 2.5 End of round / End of game
- Standard round-end (coins to unchosen Functions, return chosen tiles, pass Governor).
- Puertoma end-game trigger: completing its building area = **2 buildings on each of the 4 levels** (6 Common + 2 Expanded).
- Puertoma final scoring: no building-specific VP text, no Commercial-building "occupied" perk VP. Instead:
  - +6 VP per Expanded Commercial building built (flat, regardless of its printed condition)
  - +1 VP per unused Worker
  - +3 VP per Quarry
  - +2 VP per Property type with **both** tiles active (e.g. 2 active Sugar + 2 active Coffee = +4)
  - +1 VP per 2 remaining goods+coins combined (round up)
  - Ties resolved per base-game rules.

### 2.6 Difficulty variants
- **Fácil**: once a Puertoma unlocks 2 of its 4 ability tokens, discard the other 2 (it keeps only those 2 for the rest of the game — no further unlocks).
- **Difícil**: at setup, both Puertomas' Level-1 ability is pre-flipped/active from turn 1. First Puertoma (the one with a Fruit property) additionally gets a free random Lvl-1 building, 1 worker (on the Fruit property), 1 corn crate. Second Puertoma (Corn property) gets a free random Lvl-2 building, 1 sugar crate, and starts with only 1 coin instead of the normal amount.

### 2.7 Ability tokens (24 total, 6 per Puertoma-board color? — verify; text lists per-level effects, not per-color sets)
Full table extracted (Level / Triggering Action / Effect) — see page 41 dump; will be hardcoded as game-data constants (not re-derived at runtime). One random token per level (1-4) is secretly assigned per Puertoma at setup and flips face-up once unlocked.

### 2.8 Expansion I: Novos Edifícios (in scope for v1)
- Setup: human drafts which Commercial buildings are even in the game (round-robin pick, 1 per empty building-tray slot by cost). **When it's a Puertoma's turn to pick**, it draws a Desempate card and counts available buildings left-to-right to its printed number (same "pick via tie-break" mechanic as building-choice ties).
- New Common buildings: Canal, Madeireira (Lumberyard — turns a drawn Property face-down into a "Floresta" for a discount), Mercado Oculto, Depósito, Choupana, Posto dos Mercadores, Igreja, Cais Pequeno, Farol, Destilaria, Centro de Imprensa (doubles the chosen role's Vantagem), Assembleia.
- New Expanded buildings: Monumento (8 VP flat), Catedral (set-collection bonus on matching field tiles).
- **Puertoma interaction note**: none of these buildings' passive *perks* apply to Puertomas (per the "Puertomas never use Commercial building perks" base rule) — they only affect the human player and the shared drafting pool. Puertoma building-choice priority (highest level affordable) is unaffected by which specific buildings exist, EXCEPT the Madeireira/Centro de Imprensa interaction is human-only so no special-casing needed for the automa engine.

### 2.9 Expansion II: Cidadãos (in scope for v1)
- Setup: similar round-robin building draft, can also draft "Alfaiataria Grande" (a Production building that behaves like a draftable Commercial slot).
- New shared mechanic: at game start and after every Recrutador phase, 1 of the new Workers delivered to the Agência de Empregos is swapped for a Citizen (shared 20-token pool). Citizens behave as Workers for all purposes (including for Puertomas) except: they're worth 1 VP each at game end, and several *new* buildings give a different (usually better) benefit when occupied by a Citizen vs a Worker.
- **End-game trigger changes**: running out of Workers is no longer a game-end condition (affects shared Agência de Empregos logic, not Puertoma-specific, but the engine must track it since it changes when the game-end check fires).
- **Puertoma interaction**: since Puertomas never use Commercial building perks, the Worker-vs-Citizen distinction only matters for (a) final scoring (+1 VP per Citizen the Puertoma holds, tracked alongside its Worker count) and (b) the Recrutador allocation algorithm is otherwise unchanged (Citizens slot into the same priority queue as Workers).

---

## 3. Proposed Architecture

### 3.1 Mental model
The app is **not** a full virtual Puerto Rico board. It is a **state-tracking decision engine** for the 2 (or 1) Puertoma opponents, driven by minimal inputs from the human each round:

1. **Shared/global state** (small, input by human as it changes): which Functions are available this round & their accumulated coins, Trading House contents (which goods + how many crates of each are currently sitting there), the 5 ships' current cargo (type + crates loaded + capacity), remaining Property tiles in the bag (counts per type), remaining buildings in the tray, Agência de Empregos pending worker/citizen count.
2. **Per-Puertoma state** (fully owned & auto-updated by the app once initialized): coins, properties (type + active/inactive + worker slots filled), buildings built (which ones, by level), workers/citizens total count, goods held, unlocked ability tokens, Reserve-token building target (Expansion I interaction n/a for Puertoma logic), end-game building-completion flag.
3. Each round, the app walks the human through: **(a)** confirm which Function the human chose (if human goes first) or simulate Puertoma-first turns in table order, **(b)** for each Puertoma in turn order, run the Function-selection algorithm against current shared+own state, display the chosen Function + whether the action marker moves, **(c)** resolve that Function's action deterministically against the Puertoma's own tracked state, printing an explicit **physical instruction list** ("mova 1 trabalhador para o espaço mais à esquerda da Propriedade de Açúcar", "construa a Fábrica (nível 4, 6 moedas)", etc.) for the human to mirror on the real Puertoma board, **(d)** apply the resulting state changes to shared state too (coins spent, Trading House/ship contents, bag/tray depletion) so the next decision is computed against accurate data.
4. End of round / end of game handled the same way — the app computes Puertoma scores from its own tracked state; the human enters their own final tally manually (classic Boardbots pattern — human's own board stays physical/untracked).

### 3.2 Why this works for a human's physical setup
This mirrors the existing Boardbots pattern (Stone Age, Hoth, etc.): the real complexity of Puerto Rico's board (goods abstraction, ship capacities, building slots) genuinely needs to live *somewhere* precise for correct AI decisions — but it only needs to live for the **2 virtual players**, which the app owns outright. The human's own board, worker placements, and scoring remain entirely physical and untouched by the app, keeping the UI dramatically simpler than a full PR digital implementation while still being 100% rules-accurate for what matters (the automa's decisions).

---

## 4. Data Model (draft)

```js
const state = {
  lang: 'pt',
  mode: 'solo2' | 'solo1',       // 1H+2P vs 1H+1P practice
  difficulty: 'padrao'|'facil'|'dificil',
  expansions: { novosEdificios: true, cidadaos: true },
  round: 1,
  governorIndex: 0,              // whose turn it is to pick first
  actionMarker: 'construtor',    // current position on Puertoma Action Board
  functionsAvailable: { cultivador:true, recrutador:true, construtor:false, ... },
  functionCoins: { cultivador:0, recrutador:1, ... },
  sharedBoard: {
    tradingHouse: { milho:0, fruta:1, acucar:0, tabaco:0, cafe:2 }, // crates present
    ships: [ {id:'4', good:null, loaded:0, capacity:4}, ... ],
    propertyBagCounts: { milho:5, fruta:4, ... , pedreira: 8 },
    buildingTrayRemaining: { ... },          // per building key, qty left
    workersInEmploymentAgency: 0,
    citizensInEmploymentAgency: 0,          // Expansion II
    citizensRemainingInSupply: 20,          // Expansion II
    buildingDraftPool: [ ... ]               // active buildings this game (Exp I/II draft result)
  },
  puertomas: [
    {
      id: 'A', color:'orange',
      coins: 3,
      properties: [ {type:'fruta', active:false, workerSlots:2, workersFilled:0}, ... ],
      quarries: 2,
      buildings: [ {key:'estoque_pequeno_fruta', level:1}, ... ],
      goods: { milho:0, fruta:0, acucar:1, tabaco:0, cafe:0 },
      workers: 4, citizens: 1,
      abilityTokens: { 1:{key:'...', unlocked:false}, 2:{...}, 3:{...}, 4:{...} },
      reserveTokenBuildingKey: null,  // only relevant with Expansion III (future)
      finishedBuildingArea: false
    },
    { id:'B', color:'purple', ... }
  ],
  log: [ { round, actor, text } ],
};
```

Game-data constants (hardcoded, extracted verified from the PDF, not placeholders):
- `FUNCTIONS` (7 keys + adjacency graph per §2.2)
- `PRODUCT_ORDER` = `['milho','fruta','acucar','tabaco','cafe']`
- `BUILDINGS` table: key, namePT/EN, level, cost, vp, kind (`producao`|`comercial`|`comercial_expandido`), expansion tag — full base-game list (pages 18-22) + Expansion I list (pages 23-25) + Expansion II list (pages 26-27)
- `ABILITY_TOKENS` table (page 41, 10 entries by level/action, as quoted above)
- `SETUP_BY_PLAYERCOUNT` (coins, VP/worker bank sizes, starting ship decks, properties removed — page 6 + page 22 for 2p-equivalent Puertoma setup)
- `TIEBREAK_DECK`: either the 8 real cards' data (pending user photos) or a documented equivalent-RNG fallback

---

## 5. UI / Screen Flow

1. **Setup screen** (per skill §3): game mode picker (1H+1P practice / 1H+2P solo), difficulty picker (Padrão/Fácil/Difícil), expansion toggles (Novos Edifícios / Cidadãos, both on by default), physical setup checklist (`<details>`), "Start Game" button.
2. **Round flow screen** (main game loop):
   - Step A: "Quem escolhe a Função primeiro?" — shows turn order (human always first per rules, then Puertomas in seat order).
   - Step B (repeats per Puertoma in turn order, including reacting to the human's and to the other Puertoma's chosen Function): a **decision card** shows the candidate evaluation trace (adjacent candidates → profitability filter → coin comparison → tie-break draw if needed) ending in "Puertoma A escolhe: CONSTRUTOR", then an **action resolution card** with an explicit physical step list + any shared-state deltas (goods added to Trading House, ship filled, bag/tray depletion) the human must also reflect physically.
   - Every other-player-chosen Function also triggers a lightweight "Puertoma segue a Função X" resolution (§2.3 note: Puertomas always perform the base action of any role chosen by anyone, just without the Vantagem).
   - Step C: end-of-round panel (coins placed on unchosen Functions, Governor token passes, round counter increments).
3. **End-of-game screen**: trigger detection (building area completion / VP bank empty / worker-pool empty, respecting Expansion II's worker-depletion exception), automatic Puertoma score breakdown (itemized per §2.5), input field for the human's own final score for comparison/winner display.
4. **Help modal** (`#helpModal`, mandatory): Puertoma overview, role-selection algorithm explained with the worked examples from page 36, ability token table, difficulty explanations, expansion summaries, "como usar o app" quick-start.
5. **Floating controls**: help (`?`), reset/new game, PT/EN language switch — all per skill §4.
6. **Footer**: credits (Puerto Rico 1897 Special Edition © its publisher; Puertoma design credit; app credit + Ko-fi), Home button.

---

## 6. Theming (per skill §5)
- **Texture**: none of the existing 15 match a Caribbean sugar/coffee plantation theme well — closest is `old-parchment.jpg` or `light-oak.jpg`. **Recommend sourcing a new CC0 texture** from ambientCG (e.g. a weathered ledger/parchment or cane-sugar crate wood grain) sized 512×512 JPG q72, saved as `assets/textures/sugar-ledger.jpg` (or similar name) — flag as a small new-asset task, not blocking.
- **SFX**: reuse shared `card-draw` (Desempate draws), `token-place` (worker/citizen allocation), `card-flip` (ability token unlock), `ui-click`; add a couple of game-specific sounds under `assets/sfx/puertorico/` only if truly distinct feedback is needed (e.g. a coin-clink for Negociante sales) — likely can lean entirely on the shared library to minimize new asset work.
- **Iconography**: inline SVGs (`.icon-inline`) for the 7 roles + ship/building/worker/citizen glyphs — no emoji.
- **Diegetic framing**: narrate the automa's turns as a "harbor clerk's ledger" / "administrador colonial" voice-over in the log panel, per skill §5.4 (in-character but numerically precise).

---

## 7. i18n Plan
New keys needed (PT/EN pairs), grouped by screen: `setup_*`, `mode_*`, `difficulty_*`, `expansion_*`, `role_<name>_*`, `building_<key>_name/_desc`, `ability_<level>_<action>_desc`, `log_*` (narrator templates with `{vars}`), `help_*`, `score_*`, `game_puertorico_title/_desc` (for `index.html`/`site.js`), `credit_puertorico`.

---

## 8. Phased Build Plan

**Phase 0 — Data extraction & verification (no code)**
- Re-confirm the Action Board adjacency graph against the physical board once available.
- Build the complete `BUILDINGS` constants table (name/cost/VP/level/benefit-text) for base game + Expansion I + Expansion II directly from pages 18-27 (already excerpted above; needs full transcription, not just the samples quoted in this plan).
- Transcribe the 8 Desempate cards (pending user photos) + the "Carta de Ajuda" reference card.
- Confirm starting-coin table per player count (page 6/34) and the 2-Puertoma vs 1-Puertoma setup deltas.

**Phase 1 — Core engine (no UI polish)**
- Implement state model, Function-selection algorithm, per-role action resolvers, ability-unlock tracking, round/game-end detection — validated via a headless test harness (plain `node --check` + scripted scenario assertions) replaying the 2 worked examples from page 36 and the Agência de Empregos worked example from page 38.

**Phase 2 — UI shell & round-flow screens**
- Setup screen, round-flow screens, decision-trace card, help modal, i18n wiring, footer/credits, index.html + sitemap + SEO metadata per skill §16.

**Phase 3 — Expansions I & II wiring**
- Building draft flow (human picks UI, Puertoma picks via tie-break-card simulation), Citizens pool tracking, updated end-game trigger logic.

**Phase 4 — Theming & diegetic pass**
- Texture sourcing, SVG iconography, log narrator voice, SFX via ThemeKit, visual regression baseline capture (`npm run visual-update`).

**Phase 5 — QA & staging**
- Full Playwright run-through of a multi-round sample game (1H+2P, Padrão difficulty) verifying score computation against a hand-calculated reference game; push to `staging` branch per skill §14; share staging link for real-table testing.

**Phase 6 (future/backlog, not built now)** — Expansion III (Contrabandista), IV/V (Festival), VI (Conquistas), full Fácil/Difícil edge-case audits with real playtests.

---

## 9. Code Generation Prompt (for delegated implementation)

> Build `bots/puerto_rico_bot.html` as a single self-contained HTML file (no build step, no external JS deps beyond what's already in `assets/`) implementing a **Puertoma decision-brain companion** for Puerto Rico 1897 Special Edition, following `.agents/skills/boardbot-creator/SKILL.md` to the letter (hero banner, floating help/reset/lang buttons, mandatory physical-setup checklist, mandatory rules help modal, footer credits + Ko-fi + Home button, `assets/theme-kit.css`/`.js` reuse, real CC0 texture background, SVG iconography only, sampled SFX via `ThemeKit.playSfx`, widescreen responsive grid layout, PT/EN i18n via `data-i18n`/`data-i18n-html`).
>
> This is **not** a full virtual Puerto Rico implementation — it is a decision engine that tracks 2 (or 1) Puertoma opponents' full board state internally and narrates, phase by phase, the exact physical action the human must mirror on the Puertoma's real player board, while the human's own board/scoring stays fully physical/manual.
>
> Implement exactly the rules digest in `plan_puertoma.md` §2 (role-selection priority algorithm, action-board adjacency graph, per-role action resolution, ability-token unlocks, Fácil/Difícil variants, end-game scoring formula, Expansion I building draft + new buildings, Expansion II Citizens mechanic). Hardcode all game-data constants (buildings, ability tokens, setup tables) verbatim from the source rulebook excerpts in this plan — never use placeholder/approximate values.
>
> Support player configs: 1 human + 2 Puertomas (primary) and 1 human + 1 Puertoma (flagged practice mode). Support difficulty: Padrão / Fácil / Difícil. Support expansion toggles: Novos Edifícios, Cidadãos (both default ON).
>
> Produce the complete, self-contained HTML file.

---

## 10. Task Status Audit

- 🆕 Rules digest extracted and verified from source PDF (role mapping, action-board graph, selection algorithm, per-role resolvers, ability tokens, difficulty variants, scoring, Expansion I & II summaries).
- 🆕 Architecture decided: decision-brain companion (not full virtual board).
- 🆕 Data model drafted.
- 🆕 Phased build plan drafted (Phases 0-6).
- ❌ Full `BUILDINGS` constants table (complete transcription of all costs/VP/benefits) — only samples captured so far, full pass needed in Phase 0.
- ❌ 8 Desempate card faces — **blocked on user-provided photos**.
- ❌ Box art / index card asset — **blocked on user**.
- ❌ No code written yet (plan-only deliverable per this task).
