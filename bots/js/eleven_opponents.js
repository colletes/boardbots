/**
 * Eleven — Official Opponent Cards (OP001–OP064)
 *
 * Data ported from the fan-made open-source "Eleven Match Solver" project
 * (Unity/C#) by Hazime Kondo & Akira Miyake:
 *   https://github.com/HazimeKondo/eleven-match-solver
 * (Assets/Data/NPCTeams/OP0xx.asset — MonoBehaviour TeamData fields.)
 *
 * Each card's 9 physical Zones (al/ac/ar, ml/mc/mr, dl/dc/dr — Attack/Mid/
 * Defense rows × Left/Center/Right) are remapped here into this app's 5
 * Sections (see eleven_tactics.js header): Left = al+ml+dl, Right = ar+mr+dr,
 * Attack = ac, Mid = mc, Defense = dc. "tp" = total power (GK + all outfield
 * players), a rough difficulty indicator shown in the opponent picker.
 * "a" = isAttacker (true/false), "p" = power. Jersey/shirt numbers aren't
 * part of the source data (always 0) — assigned sequentially at load time.
 */

const NPC_CARDS = {
  OP001: { tp:16, gk:{p:2,g:1}, Left:[{p:2,a:false},{p:2,a:true}], Right:[{p:1,a:false},{p:2,a:true}], Attack:[{p:1,a:false},{p:1,a:true}], Mid:[{p:2,a:false},{p:1,a:false}], Defense:[{p:1,a:false},{p:1,a:true}] },
  OP002: { tp:16, gk:{p:2,g:1}, Left:[{p:1,a:true},{p:2,a:false}], Right:[{p:1,a:false},{p:2,a:true},{p:1,a:true}], Attack:[{p:1,a:false},{p:2,a:false}], Mid:[{p:1,a:false},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP003: { tp:16, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:1,a:true}], Right:[{p:1,a:false},{p:2,a:false}], Attack:[{p:2,a:false},{p:1,a:true},{p:1,a:false}], Mid:[{p:2,a:true},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP004: { tp:16, gk:{p:2,g:1}, Left:[{p:2,a:false},{p:2,a:true}], Right:[{p:1,a:false},{p:1,a:false}], Attack:[{p:1,a:false},{p:1,a:true}], Mid:[{p:1,a:false},{p:2,a:true},{p:2,a:false}], Defense:[{p:1,a:true}] },
  OP005: { tp:16, gk:{p:1,g:2}, Left:[{p:1,a:false},{p:1,a:false},{p:1,a:true}], Right:[{p:1,a:false},{p:3,a:false},{p:1,a:true}], Attack:[{p:1,a:false}], Mid:[{p:1,a:true},{p:3,a:true}], Defense:[{p:2,a:true}] },
  OP006: { tp:16, gk:{p:1,g:2}, Left:[{p:1,a:false},{p:3,a:false}], Right:[{p:3,a:true},{p:2,a:true}], Attack:[{p:1,a:false},{p:1,a:false}], Mid:[{p:1,a:false},{p:1,a:true}], Defense:[{p:1,a:true},{p:1,a:true}] },
  OP007: { tp:16, gk:{p:1,g:2}, Left:[{p:3,a:true}], Right:[{p:1,a:false}], Attack:[{p:1,a:false},{p:1,a:false},{p:1,a:false}], Mid:[{p:3,a:false},{p:1,a:true}], Defense:[{p:1,a:true},{p:1,a:true},{p:2,a:true}] },
  OP008: { tp:16, gk:{p:1,g:2}, Left:[{p:1,a:false},{p:1,a:true}], Right:[{p:1,a:false},{p:1,a:true}], Attack:[{p:1,a:false},{p:1,a:false}], Mid:[{p:3,a:false},{p:3,a:true}], Defense:[{p:1,a:true},{p:2,a:true}] },
  OP009: { tp:18, gk:{p:2,g:1}, Left:[{p:2,a:false},{p:2,a:false},{p:1,a:false}], Right:[{p:1,a:true}], Attack:[{p:2,a:false},{p:1,a:false}], Mid:[{p:2,a:true},{p:1,a:true}], Defense:[{p:1,a:true},{p:3,a:true}] },
  OP010: { tp:18, gk:{p:2,g:1}, Left:[{p:2,a:false},{p:2,a:false},{p:1,a:false}], Right:[{p:2,a:false},{p:2,a:true},{p:3,a:true}], Attack:[{p:1,a:true},{p:1,a:false}], Mid:[{p:1,a:true}], Defense:[{p:1,a:true}] },
  OP011: { tp:18, gk:{p:2,g:1}, Left:[{p:2,a:false},{p:1,a:false}], Right:[{p:1,a:false},{p:1,a:true},{p:3,a:true}], Attack:[{p:2,a:false},{p:1,a:true},{p:2,a:false}], Mid:[{p:2,a:true}], Defense:[{p:1,a:true}] },
  OP012: { tp:18, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:2,a:false},{p:1,a:false}], Right:[{p:2,a:false},{p:1,a:true},{p:1,a:true}], Attack:[{p:2,a:false},{p:1,a:true}], Mid:[{p:2,a:true}], Defense:[{p:3,a:true}] },
  OP013: { tp:18, gk:{p:1,g:2}, Left:[{p:3,a:false},{p:1,a:true}], Right:[{p:3,a:false},{p:1,a:true},{p:1,a:true}], Attack:[{p:3,a:false},{p:1,a:true}], Mid:[{p:1,a:false},{p:2,a:false}], Defense:[{p:1,a:true}] },
  OP014: { tp:18, gk:{p:1,g:2}, Left:[{p:1,a:true},{p:1,a:false}], Right:[{p:3,a:false},{p:2,a:false}], Attack:[{p:3,a:false},{p:3,a:false}], Mid:[{p:1,a:true},{p:1,a:true}], Defense:[{p:1,a:true},{p:1,a:true}] },
  OP015: { tp:18, gk:{p:1,g:2}, Left:[{p:1,a:true},{p:1,a:false}], Right:[{p:1,a:true},{p:1,a:true}], Attack:[{p:3,a:false},{p:3,a:false},{p:3,a:false}], Mid:[{p:2,a:false},{p:1,a:true}], Defense:[{p:1,a:true}] },
  OP016: { tp:18, gk:{p:1,g:2}, Left:[{p:3,a:false},{p:1,a:true}], Right:[{p:2,a:false}], Attack:[{p:3,a:false},{p:1,a:true},{p:3,a:false}], Mid:[{p:1,a:false},{p:1,a:true},{p:1,a:true}], Defense:[{p:1,a:true}] },
  OP017: { tp:20, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:2,a:false},{p:1,a:false}], Right:[{p:1,a:false},{p:2,a:true}], Attack:[{p:2,a:false},{p:3,a:true},{p:1,a:false}], Mid:[{p:1,a:true}], Defense:[{p:4,a:true}] },
  OP018: { tp:20, gk:{p:2,g:1}, Left:[{p:3,a:true},{p:1,a:true},{p:4,a:true}], Right:[{p:1,a:true}], Attack:[{p:1,a:false},{p:2,a:false},{p:1,a:false}], Mid:[{p:2,a:false},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP019: { tp:20, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:1,a:true}], Right:[{p:1,a:false},{p:2,a:true},{p:1,a:false}], Attack:[{p:2,a:false},{p:1,a:true},{p:3,a:true}], Mid:[{p:2,a:false}], Defense:[{p:4,a:true}] },
  OP020: { tp:20, gk:{p:2,g:1}, Left:[{p:3,a:true}], Right:[{p:2,a:false},{p:2,a:false},{p:4,a:true}], Attack:[{p:1,a:false},{p:1,a:true},{p:1,a:false}], Mid:[{p:1,a:true},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP021: { tp:20, gk:{p:1,g:2}, Left:[{p:2,a:false},{p:3,a:true}], Right:[{p:1,a:true},{p:1,a:true}], Attack:[{p:2,a:false},{p:3,a:false}], Mid:[{p:2,a:true},{p:1,a:false},{p:2,a:true}], Defense:[{p:2,a:false}] },
  OP022: { tp:20, gk:{p:1,g:2}, Left:[{p:3,a:false},{p:1,a:true}], Right:[{p:1,a:true},{p:2,a:true},{p:3,a:true}], Attack:[{p:2,a:false},{p:2,a:false}], Mid:[{p:1,a:true},{p:2,a:false}], Defense:[{p:2,a:false}] },
  OP023: { tp:20, gk:{p:1,g:2}, Left:[{p:1,a:true},{p:1,a:true}], Right:[{p:3,a:false},{p:2,a:true},{p:2,a:false}], Attack:[{p:2,a:false},{p:2,a:false}], Mid:[{p:2,a:false},{p:1,a:true}], Defense:[{p:3,a:true}] },
  OP024: { tp:20, gk:{p:1,g:2}, Left:[{p:2,a:false},{p:2,a:false}], Right:[{p:3,a:false},{p:2,a:true},{p:3,a:true}], Attack:[{p:2,a:false},{p:1,a:true}], Mid:[{p:2,a:false},{p:1,a:true}], Defense:[{p:1,a:true}] },
  OP025: { tp:22, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:1,a:true}], Right:[{p:3,a:true},{p:1,a:true}], Attack:[{p:3,a:false}], Mid:[{p:2,a:true},{p:3,a:false},{p:2,a:true}], Defense:[{p:3,a:false},{p:1,a:false}] },
  OP026: { tp:20, gk:{p:2,g:1}, Left:[{p:2,a:true}], Right:[{p:1,a:false},{p:2,a:true},{p:1,a:false}], Attack:[{p:3,a:false},{p:3,a:true}], Mid:[{p:1,a:false},{p:1,a:true},{p:1,a:false}], Defense:[{p:3,a:false}] },
  OP027: { tp:22, gk:{p:2,g:1}, Left:[{p:3,a:false},{p:3,a:false}], Right:[{p:1,a:false},{p:2,a:true},{p:3,a:false}], Attack:[{p:3,a:true}], Mid:[{p:1,a:true},{p:1,a:false},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP028: { tp:22, gk:{p:2,g:1}, Left:[{p:1,a:false},{p:3,a:false}], Right:[{p:3,a:false}], Attack:[{p:1,a:false},{p:3,a:true},{p:3,a:false}], Mid:[{p:2,a:true},{p:1,a:true},{p:2,a:true}], Defense:[{p:1,a:false}] },
  OP029: { tp:22, gk:{p:1,g:2}, Left:[{p:2,a:false},{p:1,a:true},{p:1,a:true}], Right:[{p:2,a:false},{p:1,a:false}], Attack:[{p:2,a:false}], Mid:[{p:3,a:false},{p:2,a:true}], Defense:[{p:4,a:true},{p:3,a:true}] },
  OP030: { tp:22, gk:{p:1,g:2}, Left:[{p:3,a:false},{p:4,a:true}], Right:[{p:2,a:false},{p:2,a:true},{p:3,a:true}], Attack:[{p:2,a:false},{p:2,a:false}], Mid:[{p:1,a:false},{p:1,a:true}], Defense:[{p:1,a:true}] },
  OP031: { tp:22, gk:{p:1,g:2}, Left:[{p:3,a:false},{p:3,a:true}], Right:[{p:1,a:true}], Attack:[{p:2,a:false},{p:2,a:false},{p:2,a:false}], Mid:[{p:2,a:true},{p:1,a:false}], Defense:[{p:4,a:true},{p:1,a:true}] },
  OP032: { tp:22, gk:{p:1,g:2}, Left:[{p:2,a:false},{p:2,a:true}], Right:[{p:1,a:false},{p:4,a:true}], Attack:[{p:2,a:false},{p:2,a:false}], Mid:[{p:3,a:false},{p:1,a:true}], Defense:[{p:3,a:true},{p:1,a:true}] },
  OP033: { tp:24, gk:{p:2,g:2}, Left:[{p:2,a:true},{p:3,a:true},{p:2,a:false}], Right:[{p:1,a:false},{p:3,a:true},{p:2,a:false}], Attack:[{p:3,a:true}], Mid:[{p:2,a:false},{p:1,a:false}], Defense:[{p:3,a:false}] },
  OP034: { tp:24, gk:{p:2,g:2}, Left:[{p:2,a:false},{p:2,a:false}], Right:[{p:3,a:true}], Attack:[{p:3,a:true},{p:2,a:true},{p:1,a:false}], Mid:[{p:3,a:true},{p:1,a:false}], Defense:[{p:3,a:false},{p:2,a:false}] },
  OP035: { tp:24, gk:{p:2,g:2}, Left:[{p:3,a:true},{p:1,a:false}], Right:[{p:3,a:true},{p:3,a:false}], Attack:[{p:2,a:true},{p:1,a:false}], Mid:[{p:3,a:true},{p:2,a:false}], Defense:[{p:2,a:false},{p:2,a:false}] },
  OP036: { tp:24, gk:{p:2,g:2}, Left:[{p:1,a:false},{p:3,a:true},{p:3,a:false}], Right:[{p:3,a:true},{p:2,a:false}], Attack:[{p:2,a:true}], Mid:[{p:3,a:true},{p:2,a:false},{p:1,a:false}], Defense:[{p:2,a:false}] },
  OP037: { tp:26, gk:{p:3,g:1}, Left:[{p:1,a:false},{p:3,a:false}], Right:[{p:2,a:true},{p:3,a:true}], Attack:[{p:2,a:true},{p:3,a:true}], Mid:[{p:2,a:false},{p:4,a:true}], Defense:[{p:1,a:false},{p:2,a:false}] },
  OP038: { tp:26, gk:{p:3,g:1}, Left:[{p:1,a:false},{p:2,a:false}], Right:[{p:3,a:true}], Attack:[{p:2,a:true},{p:2,a:true}], Mid:[{p:2,a:false},{p:4,a:true}], Defense:[{p:1,a:false},{p:3,a:true},{p:3,a:false}] },
  OP039: { tp:26, gk:{p:3,g:1}, Left:[{p:2,a:true},{p:1,a:false}], Right:[{p:2,a:true},{p:2,a:false}], Attack:[{p:1,a:false},{p:3,a:true}], Mid:[{p:2,a:false},{p:4,a:true}], Defense:[{p:3,a:true},{p:3,a:false}] },
  OP040: { tp:26, gk:{p:3,g:1}, Left:[{p:1,a:false},{p:3,a:true}], Right:[{p:1,a:false}], Attack:[{p:2,a:true},{p:3,a:true},{p:2,a:true}], Mid:[{p:2,a:false},{p:4,a:true}], Defense:[{p:2,a:false},{p:3,a:false}] },
  OP041: { tp:26, gk:{p:2,g:2}, Left:[{p:3,a:false}], Right:[{p:4,a:true}], Attack:[{p:2,a:true},{p:1,a:true},{p:2,a:true}], Mid:[{p:2,a:false},{p:4,a:true},{p:1,a:false}], Defense:[{p:2,a:false},{p:3,a:false}] },
  OP042: { tp:26, gk:{p:2,g:2}, Left:[{p:2,a:true},{p:2,a:false}], Right:[{p:2,a:true},{p:1,a:false},{p:2,a:false}], Attack:[{p:1,a:true}], Mid:[{p:4,a:true}], Defense:[{p:4,a:false},{p:3,a:true},{p:3,a:false}] },
  OP043: { tp:26, gk:{p:2,g:2}, Left:[{p:2,a:true},{p:4,a:true},{p:4,a:true}], Right:[{p:2,a:false},{p:2,a:false}], Attack:[{p:2,a:true},{p:1,a:true}], Mid:[{p:1,a:false}], Defense:[{p:3,a:false},{p:3,a:false}] },
  OP044: { tp:26, gk:{p:2,g:2}, Left:[{p:1,a:false},{p:3,a:false}], Right:[{p:1,a:true},{p:4,a:true},{p:3,a:false}], Attack:[{p:2,a:true},{p:2,a:true}], Mid:[{p:2,a:false}], Defense:[{p:4,a:true},{p:2,a:false}] },
  OP045: { tp:28, gk:{p:3,g:1}, Left:[{p:3,a:false},{p:3,a:false}], Right:[{p:5,a:true},{p:1,a:true}], Attack:[{p:1,a:true},{p:3,a:true}], Mid:[{p:2,a:false},{p:1,a:true}], Defense:[{p:2,a:false},{p:4,a:false}] },
  OP046: { tp:28, gk:{p:3,g:1}, Left:[{p:1,a:true},{p:4,a:false}], Right:[{p:5,a:true},{p:2,a:false}], Attack:[{p:3,a:true},{p:3,a:false}], Mid:[{p:1,a:true}], Defense:[{p:2,a:false},{p:1,a:true},{p:3,a:false}] },
  OP047: { tp:28, gk:{p:3,g:1}, Left:[{p:2,a:false},{p:1,a:true}], Right:[{p:5,a:true}], Attack:[{p:1,a:true},{p:3,a:false},{p:3,a:true}], Mid:[{p:1,a:true}], Defense:[{p:2,a:false},{p:4,a:false},{p:3,a:false}] },
  OP048: { tp:28, gk:{p:3,g:1}, Left:[{p:3,a:false},{p:1,a:true}], Right:[{p:5,a:true},{p:1,a:true}], Attack:[{p:3,a:true},{p:1,a:true}], Mid:[{p:2,a:false}], Defense:[{p:2,a:false},{p:4,a:false},{p:3,a:false}] },
  OP049: { tp:29, gk:{p:3,g:2}, Left:[{p:4,a:false},{p:2,a:false}], Right:[{p:2,a:true},{p:1,a:false},{p:4,a:true}], Attack:[{p:4,a:true}], Mid:[{p:3,a:true},{p:1,a:false}], Defense:[{p:3,a:false},{p:2,a:false}] },
  OP050: { tp:29, gk:{p:3,g:2}, Left:[{p:2,a:false}], Right:[{p:4,a:false},{p:4,a:true}], Attack:[{p:4,a:true},{p:2,a:true}], Mid:[{p:1,a:false},{p:3,a:true},{p:1,a:false}], Defense:[{p:3,a:false},{p:2,a:false}] },
  OP051: { tp:29, gk:{p:3,g:2}, Left:[{p:3,a:true},{p:3,a:false}], Right:[{p:4,a:true},{p:1,a:false},{p:4,a:true}], Attack:[{p:2,a:true}], Mid:[{p:1,a:false},{p:4,a:false}], Defense:[{p:2,a:false},{p:2,a:false}] },
  OP052: { tp:29, gk:{p:3,g:2}, Left:[{p:2,a:true},{p:4,a:false},{p:2,a:false}], Right:[{p:3,a:true},{p:4,a:true}], Attack:[{p:4,a:true}], Mid:[{p:1,a:false},{p:1,a:false}], Defense:[{p:2,a:false},{p:3,a:false}] },
  OP053: { tp:30, gk:{p:3,g:1}, Left:[{p:2,a:true},{p:2,a:false}], Right:[{p:2,a:true},{p:4,a:false}], Attack:[{p:4,a:true},{p:3,a:false}], Mid:[{p:3,a:false},{p:2,a:false}], Defense:[{p:2,a:true},{p:3,a:false}] },
  OP054: { tp:30, gk:{p:3,g:1}, Left:[{p:4,a:true},{p:3,a:false},{p:4,a:false}], Right:[{p:2,a:true}], Attack:[{p:3,a:false}], Mid:[{p:2,a:false},{p:2,a:true}], Defense:[{p:2,a:false},{p:2,a:true},{p:3,a:false}] },
  OP055: { tp:31, gk:{p:3,g:1}, Left:[{p:4,a:true},{p:3,a:false},{p:4,a:false}], Right:[{p:2,a:true},{p:2,a:false}], Attack:[{p:3,a:false}], Mid:[{p:2,a:false},{p:2,a:true}], Defense:[{p:4,a:false},{p:2,a:true}] },
  OP056: { tp:30, gk:{p:3,g:1}, Left:[{p:3,a:false}], Right:[{p:4,a:true},{p:3,a:false},{p:2,a:true}], Attack:[{p:3,a:false}], Mid:[{p:2,a:true},{p:2,a:false},{p:2,a:true}], Defense:[{p:2,a:false},{p:4,a:false}] },
  OP057: { tp:31, gk:{p:3,g:2}, Left:[{p:4,a:true},{p:3,a:true}], Right:[{p:4,a:true},{p:2,a:false},{p:3,a:true}], Attack:[{p:1,a:true}], Mid:[{p:4,a:false},{p:1,a:false}], Defense:[{p:3,a:false},{p:3,a:false}] },
  OP058: { tp:31, gk:{p:3,g:2}, Left:[{p:4,a:true},{p:4,a:false},{p:3,a:false}], Right:[{p:1,a:true},{p:2,a:false},{p:3,a:false}], Attack:[{p:4,a:true}], Mid:[{p:1,a:false}], Defense:[{p:3,a:true},{p:3,a:true}] },
  OP059: { tp:31, gk:{p:3,g:2}, Left:[{p:4,a:true},{p:1,a:false}], Right:[{p:1,a:true},{p:2,a:false},{p:3,a:true}], Attack:[{p:4,a:true}], Mid:[{p:4,a:false}], Defense:[{p:3,a:false},{p:3,a:true},{p:3,a:false}] },
  OP060: { tp:31, gk:{p:3,g:2}, Left:[{p:1,a:true},{p:2,a:false},{p:3,a:false}], Right:[{p:4,a:true},{p:4,a:false}], Attack:[{p:4,a:true}], Mid:[{p:1,a:false}], Defense:[{p:3,a:true},{p:3,a:false},{p:3,a:true}] },
  OP061: { tp:35, gk:{p:6,g:1}, Left:[{p:3,a:false},{p:4,a:false}], Right:[{p:1,a:true},{p:4,a:false}], Attack:[{p:3,a:false},{p:5,a:true}], Mid:[{p:4,a:false},{p:1,a:true}], Defense:[{p:3,a:false},{p:1,a:true}] },
  OP062: { tp:35, gk:{p:6,g:1}, Left:[{p:3,a:false},{p:3,a:false},{p:3,a:false}], Right:[{p:4,a:false}], Attack:[{p:5,a:true}], Mid:[{p:1,a:true},{p:1,a:true}], Defense:[{p:4,a:false},{p:1,a:true},{p:4,a:false}] },
  OP063: { tp:35, gk:{p:6,g:1}, Left:[{p:1,a:true},{p:4,a:false}], Right:[{p:5,a:true},{p:1,a:true},{p:4,a:false}], Attack:[{p:3,a:false}], Mid:[{p:4,a:false},{p:3,a:false}], Defense:[{p:3,a:false},{p:1,a:true}] },
  OP064: { tp:35, gk:{p:6,g:1}, Left:[{p:5,a:true},{p:3,a:false}], Right:[{p:3,a:false},{p:1,a:true}], Attack:[{p:3,a:false}], Mid:[{p:1,a:true},{p:4,a:false},{p:1,a:true}], Defense:[{p:4,a:false},{p:4,a:false}] },
};

if (typeof module !== 'undefined' && module.exports) module.exports = { NPC_CARDS };
