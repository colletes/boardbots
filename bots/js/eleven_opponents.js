/**
 * Eleven — Official Opponent Cards (OP001-OP064)
 *
 * Data ported from the fan-made open-source "Eleven Match Solver" project
 * (Unity/C#) by Hazime Kondo & Akira Miyake:
 *   https://github.com/HazimeKondo/eleven-match-solver
 * (Assets/Data/NPCTeams/OP0xx.asset — MonoBehaviour TeamData fields.)
 *
 * Each card lists its 9 physical Zones directly, exactly as printed on the
 * card (3x3 grid: al/ac/ar = Attack row Left/Center/Right, ml/mc/mr = Mid
 * row, dl/dc/dr = Defense row). "tp" = total power (GK + all outfield
 * players), a rough difficulty indicator shown in the opponent picker.
 * "a" = isAttacker (true/false), "p" = power. Jersey/shirt numbers aren't
 * part of the source data (always 0) — assigned sequentially at load time.
 * Match-resolution pooling of these 9 Zones into the 5 resolution Sections
 * (Left/Right Wing + 3 Central zones) happens at solve time — see
 * eleven_bot_v1.html buildTeamObj() and eleven_tactics.js header comment.
 *
 * CORRECTED 2026-08-05: the source .asset data for OP001-OP032 stores the
 * Attack-row and Defense-row fields (al/ac/ar vs dl/dc/dr) swapped, and for
 * OP033-OP064 stores the Left and Right columns (al/ml/dl vs ar/mr/dr)
 * swapped, relative to the physical printed cards — confirmed against 3 real
 * physical cards (OP027, OP028, OP035) supplied by the user. Both are fixed
 * here at generation time; the two are independent bugs affecting two
 * disjoint card sets.
 */

const NPC_CARDS = {
  OP001: { tp:16, gk:{p:2,g:1}, al:[], ac:[{p:1,a:false},{p:1,a:true}], ar:[], ml:[{p:2,a:true}], mc:[{p:2,a:false},{p:1,a:false}], mr:[{p:2,a:true}], dl:[{p:2,a:false}], dc:[{p:1,a:false},{p:1,a:true}], dr:[{p:1,a:false}] },
  OP002: { tp:16, gk:{p:2,g:1}, al:[], ac:[{p:1,a:false}], ar:[{p:1,a:true}], ml:[{p:2,a:false}], mc:[{p:1,a:false},{p:2,a:true}], mr:[{p:2,a:true}], dl:[{p:1,a:true}], dc:[{p:1,a:false},{p:2,a:false}], dr:[{p:1,a:false}] },
  OP003: { tp:16, gk:{p:2,g:1}, al:[{p:1,a:true}], ac:[{p:1,a:false}], ar:[], ml:[{p:1,a:false}], mc:[{p:2,a:true},{p:2,a:true}], mr:[{p:2,a:false}], dl:[], dc:[{p:2,a:false},{p:1,a:true},{p:1,a:false}], dr:[{p:1,a:false}] },
  OP004: { tp:16, gk:{p:2,g:1}, al:[], ac:[{p:1,a:true}], ar:[{p:1,a:false}], ml:[{p:2,a:true}], mc:[{p:1,a:false},{p:2,a:true},{p:2,a:false}], mr:[], dl:[{p:2,a:false}], dc:[{p:1,a:false},{p:1,a:true}], dr:[{p:1,a:false}] },
  OP005: { tp:16, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:2,a:true}], ar:[{p:1,a:true}], ml:[{p:1,a:false}], mc:[{p:1,a:true},{p:3,a:true}], mr:[{p:3,a:false}], dl:[{p:1,a:false}], dc:[{p:1,a:false}], dr:[{p:1,a:false}] },
  OP006: { tp:16, gk:{p:1,g:2}, al:[], ac:[{p:1,a:true},{p:1,a:true}], ar:[{p:2,a:true}], ml:[{p:3,a:false}], mc:[{p:1,a:false},{p:1,a:true}], mr:[{p:3,a:true}], dl:[{p:1,a:false}], dc:[{p:1,a:false},{p:1,a:false}], dr:[] },
  OP007: { tp:16, gk:{p:1,g:2}, al:[], ac:[{p:1,a:true},{p:1,a:true},{p:2,a:true}], ar:[], ml:[{p:3,a:true}], mc:[{p:3,a:false},{p:1,a:true}], mr:[{p:1,a:false}], dl:[], dc:[{p:1,a:false},{p:1,a:false},{p:1,a:false}], dr:[] },
  OP008: { tp:16, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:1,a:true},{p:2,a:true}], ar:[], ml:[{p:1,a:false}], mc:[{p:3,a:false},{p:3,a:true}], mr:[{p:1,a:true}], dl:[], dc:[{p:1,a:false},{p:1,a:false}], dr:[{p:1,a:false}] },
  OP009: { tp:18, gk:{p:2,g:1}, al:[{p:1,a:false}], ac:[{p:1,a:true},{p:3,a:true}], ar:[], ml:[{p:2,a:false}], mc:[{p:2,a:true},{p:1,a:true}], mr:[], dl:[{p:2,a:false}], dc:[{p:2,a:false},{p:1,a:false}], dr:[{p:1,a:true}] },
  OP010: { tp:18, gk:{p:2,g:1}, al:[{p:1,a:false}], ac:[{p:1,a:true}], ar:[{p:3,a:true}], ml:[{p:2,a:false}], mc:[{p:1,a:true}], mr:[{p:2,a:true}], dl:[{p:2,a:false}], dc:[{p:1,a:true},{p:1,a:false}], dr:[{p:2,a:false}] },
  OP011: { tp:18, gk:{p:2,g:1}, al:[{p:1,a:false}], ac:[{p:1,a:true}], ar:[{p:3,a:true}], ml:[{p:2,a:false}], mc:[{p:2,a:true}], mr:[{p:1,a:true}], dl:[], dc:[{p:2,a:false},{p:1,a:true},{p:2,a:false}], dr:[{p:1,a:false}] },
  OP012: { tp:18, gk:{p:2,g:1}, al:[{p:1,a:false}], ac:[{p:3,a:true}], ar:[{p:1,a:true}], ml:[{p:2,a:false}], mc:[{p:2,a:true}], mr:[{p:1,a:true}], dl:[{p:1,a:false}], dc:[{p:2,a:false},{p:1,a:true}], dr:[{p:2,a:false}] },
  OP013: { tp:18, gk:{p:1,g:2}, al:[], ac:[{p:1,a:true}], ar:[{p:1,a:true}], ml:[{p:1,a:true}], mc:[{p:1,a:false},{p:2,a:false}], mr:[{p:1,a:true}], dl:[{p:3,a:false}], dc:[{p:3,a:false},{p:1,a:true}], dr:[{p:3,a:false}] },
  OP014: { tp:18, gk:{p:1,g:2}, al:[], ac:[{p:1,a:true},{p:1,a:true}], ar:[], ml:[{p:1,a:false}], mc:[{p:1,a:true},{p:1,a:true}], mr:[{p:2,a:false}], dl:[{p:1,a:true}], dc:[{p:3,a:false},{p:3,a:false}], dr:[{p:3,a:false}] },
  OP015: { tp:18, gk:{p:1,g:2}, al:[], ac:[{p:1,a:true}], ar:[{p:1,a:true}], ml:[{p:1,a:false}], mc:[{p:2,a:false},{p:1,a:true}], mr:[{p:1,a:true}], dl:[{p:1,a:true}], dc:[{p:3,a:false},{p:3,a:false},{p:3,a:false}], dr:[] },
  OP016: { tp:18, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:1,a:true}], ar:[], ml:[], mc:[{p:1,a:false},{p:1,a:true},{p:1,a:true}], mr:[{p:2,a:false}], dl:[{p:3,a:false}], dc:[{p:3,a:false},{p:1,a:true},{p:3,a:false}], dr:[] },
  OP017: { tp:20, gk:{p:2,g:1}, al:[{p:1,a:false}], ac:[{p:4,a:true}], ar:[], ml:[{p:2,a:false}], mc:[{p:1,a:true}], mr:[{p:2,a:true}], dl:[{p:1,a:false}], dc:[{p:2,a:false},{p:3,a:true},{p:1,a:false}], dr:[{p:1,a:false}] },
  OP018: { tp:20, gk:{p:2,g:1}, al:[{p:4,a:true}], ac:[{p:1,a:false}], ar:[], ml:[{p:1,a:true}], mc:[{p:2,a:false},{p:2,a:true}], mr:[], dl:[{p:3,a:true}], dc:[{p:1,a:false},{p:2,a:false},{p:1,a:false}], dr:[{p:1,a:true}] },
  OP019: { tp:20, gk:{p:2,g:1}, al:[], ac:[{p:4,a:true}], ar:[{p:1,a:false}], ml:[{p:1,a:true}], mc:[{p:2,a:false}], mr:[{p:2,a:true}], dl:[{p:1,a:false}], dc:[{p:2,a:false},{p:1,a:true},{p:3,a:true}], dr:[{p:1,a:false}] },
  OP020: { tp:20, gk:{p:2,g:1}, al:[], ac:[{p:1,a:false}], ar:[{p:4,a:true}], ml:[], mc:[{p:1,a:true},{p:2,a:true}], mr:[{p:2,a:false}], dl:[{p:3,a:true}], dc:[{p:1,a:false},{p:1,a:true},{p:1,a:false}], dr:[{p:2,a:false}] },
  OP021: { tp:20, gk:{p:1,g:2}, al:[{p:3,a:true}], ac:[{p:2,a:false}], ar:[{p:1,a:true}], ml:[], mc:[{p:2,a:true},{p:1,a:false},{p:2,a:true}], mr:[], dl:[{p:2,a:false}], dc:[{p:2,a:false},{p:3,a:false}], dr:[{p:1,a:true}] },
  OP022: { tp:20, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:2,a:false}], ar:[{p:3,a:true}], ml:[], mc:[{p:1,a:true},{p:2,a:false}], mr:[{p:2,a:true}], dl:[{p:3,a:false}], dc:[{p:2,a:false},{p:2,a:false}], dr:[{p:1,a:true}] },
  OP023: { tp:20, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:3,a:true}], ar:[{p:2,a:false}], ml:[], mc:[{p:2,a:false},{p:1,a:true}], mr:[{p:2,a:true}], dl:[{p:1,a:true}], dc:[{p:2,a:false},{p:2,a:false}], dr:[{p:3,a:false}] },
  OP024: { tp:20, gk:{p:1,g:2}, al:[{p:2,a:false}], ac:[{p:1,a:true}], ar:[{p:3,a:true}], ml:[], mc:[{p:2,a:false},{p:1,a:true}], mr:[{p:2,a:true}], dl:[{p:2,a:false}], dc:[{p:2,a:false},{p:1,a:true}], dr:[{p:3,a:false}] },
  OP025: { tp:22, gk:{p:2,g:1}, al:[], ac:[{p:3,a:false},{p:1,a:false}], ar:[], ml:[{p:1,a:true}], mc:[{p:2,a:true},{p:3,a:false},{p:2,a:true}], mr:[{p:1,a:true}], dl:[{p:1,a:false}], dc:[{p:3,a:false}], dr:[{p:3,a:true}] },
  OP026: { tp:20, gk:{p:2,g:1}, al:[], ac:[{p:3,a:false}], ar:[{p:1,a:false}], ml:[{p:2,a:true}], mc:[{p:1,a:false},{p:1,a:true},{p:1,a:false}], mr:[{p:2,a:true}], dl:[], dc:[{p:3,a:false},{p:3,a:true}], dr:[{p:1,a:false}] },
  OP027: { tp:22, gk:{p:2,g:1}, al:[], ac:[{p:1,a:false}], ar:[{p:3,a:false}], ml:[{p:3,a:false}], mc:[{p:1,a:true},{p:1,a:false},{p:2,a:true}], mr:[{p:2,a:true}], dl:[{p:3,a:false}], dc:[{p:3,a:true}], dr:[{p:1,a:false}] },
  OP028: { tp:22, gk:{p:2,g:1}, al:[{p:3,a:false}], ac:[{p:1,a:false}], ar:[], ml:[{p:1,a:false}], mc:[{p:2,a:true},{p:1,a:true},{p:2,a:true}], mr:[{p:3,a:false}], dl:[], dc:[{p:1,a:false},{p:3,a:true},{p:3,a:false}], dr:[] },
  OP029: { tp:22, gk:{p:1,g:2}, al:[{p:1,a:true}], ac:[{p:4,a:true},{p:3,a:true}], ar:[], ml:[{p:1,a:true}], mc:[{p:3,a:false},{p:2,a:true}], mr:[{p:1,a:false}], dl:[{p:2,a:false}], dc:[{p:2,a:false}], dr:[{p:2,a:false}] },
  OP030: { tp:22, gk:{p:1,g:2}, al:[{p:4,a:true}], ac:[{p:1,a:true}], ar:[{p:3,a:true}], ml:[{p:3,a:false}], mc:[{p:1,a:false},{p:1,a:true}], mr:[{p:2,a:true}], dl:[], dc:[{p:2,a:false},{p:2,a:false}], dr:[{p:2,a:false}] },
  OP031: { tp:22, gk:{p:1,g:2}, al:[{p:3,a:true}], ac:[{p:4,a:true},{p:1,a:true}], ar:[], ml:[{p:3,a:false}], mc:[{p:2,a:true},{p:1,a:false}], mr:[{p:1,a:true}], dl:[], dc:[{p:2,a:false},{p:2,a:false},{p:2,a:false}], dr:[] },
  OP032: { tp:22, gk:{p:1,g:2}, al:[], ac:[{p:3,a:true},{p:1,a:true}], ar:[{p:4,a:true}], ml:[{p:2,a:true}], mc:[{p:3,a:false},{p:1,a:true}], mr:[{p:1,a:false}], dl:[{p:2,a:false}], dc:[{p:2,a:false},{p:2,a:false}], dr:[] },
  OP033: { tp:24, gk:{p:2,g:2}, al:[{p:1,a:false}], ac:[{p:3,a:true}], ar:[{p:2,a:true}], ml:[{p:3,a:true}], mc:[{p:2,a:false},{p:1,a:false}], mr:[{p:3,a:true}], dl:[{p:2,a:false}], dc:[{p:3,a:false}], dr:[{p:2,a:false}] },
  OP034: { tp:24, gk:{p:2,g:2}, al:[], ac:[{p:3,a:true},{p:2,a:true},{p:1,a:false}], ar:[], ml:[{p:3,a:true}], mc:[{p:3,a:true},{p:1,a:false}], mr:[{p:2,a:false}], dl:[], dc:[{p:3,a:false},{p:2,a:false}], dr:[{p:2,a:false}] },
  OP035: { tp:24, gk:{p:2,g:2}, al:[], ac:[{p:2,a:true},{p:1,a:false}], ar:[{p:3,a:true}], ml:[{p:3,a:true}], mc:[{p:3,a:true},{p:2,a:false}], mr:[{p:1,a:false}], dl:[{p:3,a:false}], dc:[{p:2,a:false},{p:2,a:false}], dr:[] },
  OP036: { tp:24, gk:{p:2,g:2}, al:[{p:3,a:true}], ac:[{p:2,a:true}], ar:[{p:1,a:false}], ml:[], mc:[{p:3,a:true},{p:2,a:false},{p:1,a:false}], mr:[{p:3,a:true}], dl:[{p:2,a:false}], dc:[{p:2,a:false}], dr:[{p:3,a:false}] },
  OP037: { tp:26, gk:{p:3,g:1}, al:[{p:2,a:true}], ac:[{p:2,a:true},{p:3,a:true}], ar:[{p:1,a:false}], ml:[], mc:[{p:2,a:false},{p:4,a:true}], mr:[], dl:[{p:3,a:true}], dc:[{p:1,a:false},{p:2,a:false}], dr:[{p:3,a:false}] },
  OP038: { tp:26, gk:{p:3,g:1}, al:[{p:3,a:true}], ac:[{p:2,a:true},{p:2,a:true}], ar:[{p:1,a:false}], ml:[], mc:[{p:2,a:false},{p:4,a:true}], mr:[], dl:[], dc:[{p:1,a:false},{p:3,a:true},{p:3,a:false}], dr:[{p:2,a:false}] },
  OP039: { tp:26, gk:{p:3,g:1}, al:[{p:2,a:true}], ac:[{p:1,a:false},{p:3,a:true}], ar:[{p:2,a:true}], ml:[], mc:[{p:2,a:false},{p:4,a:true}], mr:[], dl:[{p:2,a:false}], dc:[{p:3,a:true},{p:3,a:false}], dr:[{p:1,a:false}] },
  OP040: { tp:26, gk:{p:3,g:1}, al:[], ac:[{p:2,a:true},{p:3,a:true},{p:2,a:true}], ar:[{p:1,a:false}], ml:[], mc:[{p:2,a:false},{p:4,a:true}], mr:[], dl:[{p:1,a:false}], dc:[{p:2,a:false},{p:3,a:false}], dr:[{p:3,a:true}] },
  OP041: { tp:26, gk:{p:2,g:2}, al:[], ac:[{p:2,a:true},{p:1,a:true},{p:2,a:true}], ar:[], ml:[], mc:[{p:2,a:false},{p:4,a:true},{p:1,a:false}], mr:[], dl:[{p:4,a:true}], dc:[{p:2,a:false},{p:3,a:false}], dr:[{p:3,a:false}] },
  OP042: { tp:26, gk:{p:2,g:2}, al:[{p:2,a:true}], ac:[{p:1,a:true}], ar:[{p:2,a:true}], ml:[{p:1,a:false}], mc:[{p:4,a:true}], mr:[{p:2,a:false}], dl:[{p:2,a:false}], dc:[{p:4,a:false},{p:3,a:true},{p:3,a:false}], dr:[] },
  OP043: { tp:26, gk:{p:2,g:2}, al:[], ac:[{p:2,a:true},{p:1,a:true}], ar:[{p:2,a:true}], ml:[{p:2,a:false}], mc:[{p:1,a:false}], mr:[{p:4,a:true}], dl:[{p:2,a:false}], dc:[{p:3,a:false},{p:3,a:false}], dr:[{p:4,a:true}] },
  OP044: { tp:26, gk:{p:2,g:2}, al:[{p:1,a:true}], ac:[{p:2,a:true},{p:2,a:true}], ar:[], ml:[{p:4,a:true}], mc:[{p:2,a:false}], mr:[{p:1,a:false}], dl:[{p:3,a:false}], dc:[{p:4,a:true},{p:2,a:false}], dr:[{p:3,a:false}] },
  OP045: { tp:28, gk:{p:3,g:1}, al:[{p:5,a:true}], ac:[{p:1,a:true},{p:3,a:true}], ar:[{p:3,a:false}], ml:[], mc:[{p:2,a:false},{p:1,a:true}], mr:[], dl:[{p:1,a:true}], dc:[{p:2,a:false},{p:4,a:false}], dr:[{p:3,a:false}] },
  OP046: { tp:28, gk:{p:3,g:1}, al:[{p:5,a:true}], ac:[{p:3,a:true},{p:3,a:false}], ar:[{p:1,a:true}], ml:[{p:2,a:false}], mc:[{p:1,a:true}], mr:[], dl:[], dc:[{p:2,a:false},{p:1,a:true},{p:3,a:false}], dr:[{p:4,a:false}] },
  OP047: { tp:28, gk:{p:3,g:1}, al:[{p:5,a:true}], ac:[{p:1,a:true},{p:3,a:false},{p:3,a:true}], ar:[], ml:[], mc:[{p:1,a:true}], mr:[{p:2,a:false}], dl:[], dc:[{p:2,a:false},{p:4,a:false},{p:3,a:false}], dr:[{p:1,a:true}] },
  OP048: { tp:28, gk:{p:3,g:1}, al:[{p:5,a:true}], ac:[{p:3,a:true},{p:1,a:true}], ar:[{p:3,a:false}], ml:[{p:1,a:true}], mc:[{p:2,a:false}], mr:[], dl:[], dc:[{p:2,a:false},{p:4,a:false},{p:3,a:false}], dr:[{p:1,a:true}] },
  OP049: { tp:29, gk:{p:3,g:2}, al:[{p:2,a:true}], ac:[{p:4,a:true}], ar:[], ml:[{p:1,a:false}], mc:[{p:3,a:true},{p:1,a:false}], mr:[{p:4,a:false}], dl:[{p:4,a:true}], dc:[{p:3,a:false},{p:2,a:false}], dr:[{p:2,a:false}] },
  OP050: { tp:29, gk:{p:3,g:2}, al:[], ac:[{p:4,a:true},{p:2,a:true}], ar:[], ml:[{p:4,a:false}], mc:[{p:1,a:false},{p:3,a:true},{p:1,a:false}], mr:[], dl:[{p:4,a:true}], dc:[{p:3,a:false},{p:2,a:false}], dr:[{p:2,a:false}] },
  OP051: { tp:29, gk:{p:3,g:2}, al:[{p:4,a:true}], ac:[{p:2,a:true}], ar:[], ml:[{p:1,a:false}], mc:[{p:1,a:false},{p:4,a:false}], mr:[{p:3,a:true}], dl:[{p:4,a:true}], dc:[{p:2,a:false},{p:2,a:false}], dr:[{p:3,a:false}] },
  OP052: { tp:29, gk:{p:3,g:2}, al:[], ac:[{p:4,a:true}], ar:[{p:2,a:true}], ml:[{p:3,a:true}], mc:[{p:1,a:false},{p:1,a:false}], mr:[{p:4,a:false}], dl:[{p:4,a:true}], dc:[{p:2,a:false},{p:3,a:false}], dr:[{p:2,a:false}] },
  OP053: { tp:30, gk:{p:3,g:1}, al:[], ac:[{p:4,a:true},{p:3,a:false}], ar:[], ml:[{p:2,a:true}], mc:[{p:3,a:false},{p:2,a:false}], mr:[{p:2,a:true}], dl:[{p:4,a:false}], dc:[{p:2,a:true},{p:3,a:false}], dr:[{p:2,a:false}] },
  OP054: { tp:30, gk:{p:3,g:1}, al:[], ac:[{p:3,a:false}], ar:[{p:4,a:true}], ml:[{p:2,a:true}], mc:[{p:2,a:false},{p:2,a:true}], mr:[{p:3,a:false}], dl:[], dc:[{p:2,a:false},{p:2,a:true},{p:3,a:false}], dr:[{p:4,a:false}] },
  OP055: { tp:31, gk:{p:3,g:1}, al:[], ac:[{p:3,a:false}], ar:[{p:4,a:true}], ml:[{p:2,a:true}], mc:[{p:2,a:false},{p:2,a:true}], mr:[{p:3,a:false}], dl:[{p:2,a:false}], dc:[{p:4,a:false},{p:2,a:true}], dr:[{p:4,a:false}] },
  OP056: { tp:30, gk:{p:3,g:1}, al:[{p:4,a:true}], ac:[{p:3,a:false}], ar:[], ml:[{p:3,a:false}], mc:[{p:2,a:true},{p:2,a:false},{p:2,a:true}], mr:[], dl:[{p:2,a:true}], dc:[{p:2,a:false},{p:4,a:false}], dr:[{p:3,a:false}] },
  OP057: { tp:31, gk:{p:3,g:2}, al:[{p:4,a:true}], ac:[{p:1,a:true}], ar:[{p:4,a:true}], ml:[{p:2,a:false}], mc:[{p:4,a:false},{p:1,a:false}], mr:[], dl:[{p:3,a:true}], dc:[{p:3,a:false},{p:3,a:false}], dr:[{p:3,a:true}] },
  OP058: { tp:31, gk:{p:3,g:2}, al:[{p:1,a:true}], ac:[{p:4,a:true}], ar:[{p:4,a:true}], ml:[{p:2,a:false}], mc:[{p:1,a:false}], mr:[{p:4,a:false}], dl:[{p:3,a:false}], dc:[{p:3,a:true},{p:3,a:true}], dr:[{p:3,a:false}] },
  OP059: { tp:31, gk:{p:3,g:2}, al:[{p:1,a:true}], ac:[{p:4,a:true}], ar:[{p:4,a:true}], ml:[{p:2,a:false}], mc:[{p:4,a:false}], mr:[{p:1,a:false}], dl:[{p:3,a:true}], dc:[{p:3,a:false},{p:3,a:true},{p:3,a:false}], dr:[] },
  OP060: { tp:31, gk:{p:3,g:2}, al:[{p:4,a:true}], ac:[{p:4,a:true}], ar:[{p:1,a:true}], ml:[{p:4,a:false}], mc:[{p:1,a:false}], mr:[{p:2,a:false}], dl:[], dc:[{p:3,a:true},{p:3,a:false},{p:3,a:true}], dr:[{p:3,a:false}] },
  OP061: { tp:35, gk:{p:6,g:1}, al:[], ac:[{p:3,a:false},{p:5,a:true}], ar:[], ml:[{p:1,a:true}], mc:[{p:4,a:false},{p:1,a:true}], mr:[{p:3,a:false}], dl:[{p:4,a:false}], dc:[{p:3,a:false},{p:1,a:true}], dr:[{p:4,a:false}] },
  OP062: { tp:35, gk:{p:6,g:1}, al:[], ac:[{p:5,a:true}], ar:[{p:3,a:false}], ml:[{p:4,a:false}], mc:[{p:1,a:true},{p:1,a:true}], mr:[{p:3,a:false}], dl:[], dc:[{p:4,a:false},{p:1,a:true},{p:4,a:false}], dr:[{p:3,a:false}] },
  OP063: { tp:35, gk:{p:6,g:1}, al:[{p:5,a:true}], ac:[{p:3,a:false}], ar:[], ml:[{p:1,a:true}], mc:[{p:4,a:false},{p:3,a:false}], mr:[{p:1,a:true}], dl:[{p:4,a:false}], dc:[{p:3,a:false},{p:1,a:true}], dr:[{p:4,a:false}] },
  OP064: { tp:35, gk:{p:6,g:1}, al:[], ac:[{p:3,a:false}], ar:[{p:5,a:true}], ml:[{p:3,a:false}], mc:[{p:1,a:true},{p:4,a:false},{p:1,a:true}], mr:[], dl:[{p:1,a:true}], dc:[{p:4,a:false},{p:4,a:false}], dr:[{p:3,a:false}] },
};

if (typeof module !== 'undefined') {
    module.exports = { NPC_CARDS };
}
