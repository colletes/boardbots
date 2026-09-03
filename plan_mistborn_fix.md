# Mistborn bot fix — continuation plan (paused 2026-09-01)

## Original request (user, pt-br)
Bot de mistborn: (1) crop de todas as imagens de vilão está incorreto, (2) trilhas
de dominância estão erradas — cada carta de vilão tem uma trilha frente+verso
(cerca de 18-19 seções ao todo) que deveria ser mesclada em UMA trilha contínua,
mas o bot tem apenas 4-5 entradas fabricadas/incompletas por vilão. Algumas cartas
precisam ser rotacionadas para fazerem sentido. Fontes adicionais:
- `Documentos/Board games/Mistborn/Dominance+Track+Print+and+Play.pdf` (6 trilhas
  genéricas de dificuldade, só para o Lord Ruler)
- `Documentos/Board games/Mistborn/Solo Coop Expansion/VILLAIN *.pdf` (8 arquivos,
  1 por vilão — trilha real de cada um)
- `Documentos/Board games/Mistborn/Solo Coop Expansion/RULE Cards 01/02/03.pdf`
  (regras adicionais, autor Kagan Eden)

User convidou perguntas — já respondidas em rounds anteriores (ver decisões abaixo).
Pausado por: usuário vai fornecer ele mesmo as imagens já cropadas das cartas de
vilão (ver "PENDING" abaixo) — não usar mais os crops derivados de `portraits/`
sem confirmar com o usuário antes.

## Scope decisions already confirmed with user
- Only the 8 currently-used villain portrait images are in scope (NOT
  `characters/*.webp` or `duralumin/flare_0X.webp` — those are unused, out of scope).
- Each villain's front+back Dominance card must be merged into ONE continuous,
  fully-transcribed track, distinguishing instant vs. passive effects.
- New Lord-Ruler-only selectable difficulty mode exposing the 6 generic tracks
  (Intro, Standard A, Standard B, Hard A, Hard B, Extreme) from the separate PDF.
- Ignore "X=N" title labels on villain cards (e.g. "STEEL MINISTRY DOMINANCE X=2")
  — just a physical-game balance/resistance number, NOT to be modeled in bot logic.
  Exception: Ruin's card text explicitly references a die-rolled "dominance X"
  value (per RULE Cards 01) — transcribe that row as static text only, no new
  interactive dice mechanic (not requested/decided).

## Icon semantics (confirmed by visual inspection of villain PDFs)
- Yellow "!" icon = mandatory effect — must trigger even if the track-advance
  skips past it (per RULE Cards 03).
- "While this is the top dominance section on this track, ..." phrasing =
  passive/continuous effect, active only while that step is current.
- Red icon + number = damage to players. Green "+" = healing. Gold coin = coin
  cost/gain.

## Repo files
- **UPDATE 2026-09-01 (separate cleanup pass): the old versioned filenames
  (`mistborn_bot_v1.html`/`_v2.html`/`_v3.html`) no longer exist.** The repo-wide
  versioning convention was dropped (staging branch now serves as the working
  copy, git history replaces vN files) — all bots were renamed to drop version
  suffixes. This bot's working file is now simply `bots/mistborn_bot.html`
  (contains the same content that was in `_v3.html`). Continue editing that
  file directly; there is no more "never edit vN in place" rule to follow.
- `index.html` line ~300 — points to `bots/mistborn_bot.html`.
- `const VILLAINS = [...]` around line ~1276-1435 of the bot file — 8 villain
  objects (`id, name, title, hp, [cityHp], [usesDice], [dicePurpose],
  [extraGauge], img, desc, domSteps`). `domSteps` is what needs full rewrite
  (currently only 4-5 fabricated entries per villain, need ~18-19 real ones).
- `renderDominanceTrack(v)`, `stepDominance(delta)`, `setDominance(idx)`
  around line ~1696-1729 — logic/UI is fine as-is, only the underlying
  `domSteps` data array needs replacing (maybe add `passive`/`mandatory` flags
  per step for rendering).
- Help text at ~1250-1252 (`help_sec_dom_html` etc.) already correctly describes
  the "only resolve landed section, except mandatory '!' sections" rule — likely
  no change needed there.

## Image crop bug — STATUS: fixed once, but PENDING user-provided replacement
- Root cause: `assets/art/mistborn/villains/*.webp` (8 files, referenced by
  `img:` field in VILLAINS) were full uncropped PDF page renders, not actual
  card crops.
- I already overwrote all 8 files in this session by deriving crops from the
  pre-existing (previously unwired) `assets/art/mistborn/portraits/*.webp`
  composite images (1530x704, contain [BASIC portrait card | BACK dominance
  card] side by side, already correctly oriented pre-rotation). Method used:
  `crop((0,0,905,660))` then `rotate(-90, expand=True)` then `crop((80,0,w,h))`
  to trim a neighboring-card sliver. Verified visually for `ruin` and
  `lord_ruler` only — not all 8 spot-checked in detail.
- **User will now provide their own cropped images instead** — when resuming,
  ask user where the new images are / how they want them placed (presumably
  directly replacing `assets/art/mistborn/villains/*.webp`), and DO NOT re-run
  the portraits/-derived crop script again unless user says otherwise.
- These 8 image files + `index.html` + `bots/mistborn_bot.html` were committed
  in a prior session ("Fix Mistborn villain portrait image crops (v3 bot
  file)"); the dominance-track content rewrite below is still pending.

## Dominance track content bug — STATUS: diagnosed only, NOT yet implemented
- Root cause: a prior session fabricated short thematically-plausible-but-wrong
  `domSteps` instead of transcribing the real PDF content.
- Full real transcriptions for all 8 villains were read from the source PDFs
  earlier in this session (via rendering with PyMuPDF/fitz to
  `/tmp/mistborn_render/*.png` + `get_text()` dumps to
  `/tmp/mistborn_render/villains_text.txt` and `rules_and_dominance_text.txt`)
  but that `/tmp` scratch data is EPHEMERAL and was NOT saved into the repo —
  it may no longer exist on disk. **When resuming, must re-render all 8
  `VILLAIN *.pdf` files and the `Dominance+Track+Print+and+Play.pdf` (2 pages)
  again from scratch** (paths under
  `/Users/thiagocarvalho/Documents/Board games/Mistborn/Solo Coop Expansion/`
  and `/Users/thiagocarvalho/Documents/Board games/Mistborn/`), re-read/re-view
  them, and transcribe each villain's merged front+back track faithfully before
  writing to `domSteps`.
- Rotation-needed-for-legibility status (from viewing raw PDF page renders,
  NOT the portraits crops): confirmed ROTATED: Steel Ministry, Straff Venture,
  Koloss. Confirmed NOT rotated: Zane Venture. NOT YET CONFIRMED: Lord Ruler,
  Jastes Lekal, Ashweather Cett, Ruin. Re-check when re-rendering.
- Lord Ruler difficulty mode: need to design a new selector (dropdown or radio,
  visible only when Lord Ruler is the active villain) swapping in one of 6
  generic tracks (Intro/Standard A/Standard B/Hard A/Hard B/Extreme) from
  `Dominance+Track+Print+and+Play.pdf` instead of a normal per-villain track.
  Full text of these 6 tracks was extracted earlier but also not saved to repo
  — re-extract from that PDF (2 pages) when resuming.

## Next steps when resuming
1. Ask user for / receive their new cropped villain images; place them at
   `assets/art/mistborn/villains/*.webp` (8 files, names: lord_ruler,
   steel_ministry, jastes_lekal, ashweather_cett, ruin, zane_venture,
   straff_venture, koloss).
2. Re-render + re-read the 8 `VILLAIN *.pdf` files and the 2-page
   `Dominance+Track+Print+and+Play.pdf` via PyMuPDF (execution_subagent),
   transcribe faithfully (front+back merged per villain, mandatory/passive
   flags, PT+EN text) into new `domSteps`-equivalent arrays in
   `bots/mistborn_bot_v3.html`.
3. Design + implement the Lord Ruler difficulty-mode selector + data.
4. Validate: `node --check` on extracted `<script>` content, then Playwright
   click-through (dominance steps per villain, PT/EN text, new difficulty
   selector, villain images upright/correct) before considering done.
5. Confirm `index.html` still points at `bots/mistborn_bot.html` (already done).
