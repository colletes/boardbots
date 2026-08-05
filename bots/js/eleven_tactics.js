/**
 * Eleven — Formations & Tactic Cards
 *
 * Rulebook facts used here (p.19-20 of the official rulebook):
 * - The Pitch has 9 Zones among 5 Sections: Left Wing (3 Zones), Right Wing
 *   (3 Zones), Central Attack, Central Midfield, Central Defense (1 Zone
 *   each, holding up to 3 Jersey markers).
 * - A Formation (e.g. "4-3-3") only fixes the TOTAL number of Defenders,
 *   Midfielders and Forwards you must field — YOU choose which Zones they
 *   occupy (up to 3 per Wing Section, up to 3 per Central Zone). The exact
 *   per-formation zone split is therefore NOT a fixed rule — FORMATIONS below
 *   is only the classic football def/mid/fwd split, and suggestZoneLayout()
 *   below produces ONE reasonable default Zone placement (always editable).
 * - Basic Tactic cards offer a choice of 2 Formations and no Effect; every
 *   other Tactic card has exactly 1 Formation and 1 Effect (resolved during
 *   the "Resolve the Match" step). Ability text below is transcribed from
 *   the physical cards (see tactics.csv).
 */

const FORMATIONS = {
    '4-4-2': { def: 4, mid: 4, fwd: 2 },
    '5-3-2': { def: 5, mid: 3, fwd: 2 },
    '3-4-3': { def: 3, mid: 4, fwd: 3 },
    '5-4-1': { def: 5, mid: 4, fwd: 1 },
    '4-5-1': { def: 4, mid: 5, fwd: 1 },
    '4-2-4': { def: 4, mid: 2, fwd: 4 },
    '4-3-3': { def: 4, mid: 3, fwd: 3 },
    '3-5-2': { def: 3, mid: 5, fwd: 2 }
};

// One reasonable default Zone placement for a given Defender/Midfielder/
// Forward split: fills each matching Central Zone first (up to 3), then
// spreads any overflow evenly across the Wings (up to 3 each). Returns which
// "position type" (def/mid/fwd) ended up in each Zone, used only to guess a
// sensible default Attacker/Defender icon per slot — freely editable after.
function suggestZoneLayout(def, mid, fwd) {
    const zones = { Left: [], Right: [], Attack: [], Mid: [], Defense: [] };
    function place(posType, count, centralZone) {
        let remaining = count;
        const centralRoom = 3 - zones[centralZone].length;
        const toCentral = Math.min(centralRoom, remaining);
        for (let i = 0; i < toCentral; i++) zones[centralZone].push(posType);
        remaining -= toCentral;
        while (remaining > 0 && (zones.Left.length < 3 || zones.Right.length < 3)) {
            const side = zones.Left.length <= zones.Right.length ? 'Left' : 'Right';
            if (zones[side].length >= 3) break;
            zones[side].push(posType);
            remaining--;
        }
    }
    place('def', def, 'Defense');
    place('mid', mid, 'Mid');
    place('fwd', fwd, 'Attack');
    return zones;
}

// Default battle-role guess per position type (freely editable per slot):
// Defenders default to the Defender icon, Forwards to the Attacker icon,
// Midfielders alternate between the two so both roles are represented.
function defaultIsAttacker(posType, indexInZone) {
    if (posType === 'def') return false;
    if (posType === 'fwd') return true;
    return indexInZone % 2 === 1; // 'mid'
}

const TACTICS = [
    {
        id: 'passe_longo',
        name: { pt: 'Passe Longo', en: 'Long Pass' },
        formations: ['5-4-1'],
        autoResolvable: true,
        ability: {
            pt: 'Se um dos Zagueiros de Centro escalados tiver a mesma força que um dos Atacantes de Centro escalados, marque um gol.',
            en: 'If one of your assigned Central Defenders has the same Strength as one of your assigned Central Forwards, score a goal.'
        },
        postEffect: function (team) {
            const defs = (team.Defense || []).filter(p => !p.isAttacker).map(p => p.power);
            const fwds = (team.Attack || []).filter(p => p.isAttacker).map(p => p.power);
            return defs.some(d => fwds.includes(d)) ? 1 : 0;
        }
    },
    {
        id: 'basica_1',
        name: { pt: 'Formação Básica (4-4-2 / 4-2-4)', en: 'Basic Formation (4-4-2 / 4-2-4)' },
        formations: ['4-4-2', '4-2-4'],
        autoResolvable: false,
        ability: { pt: 'Sem efeito — escolha livremente entre as 2 Formações indicadas.', en: 'No effect — freely choose between the 2 indicated Formations.' }
    },
    {
        id: 'basica_2',
        name: { pt: 'Formação Básica (5-3-2 / 3-5-2)', en: 'Basic Formation (5-3-2 / 3-5-2)' },
        formations: ['5-3-2', '3-5-2'],
        autoResolvable: false,
        ability: { pt: 'Sem efeito — escolha livremente entre as 2 Formações indicadas.', en: 'No effect — freely choose between the 2 indicated Formations.' }
    },
    {
        id: 'basica_3',
        name: { pt: 'Formação Básica (3-4-3 / 4-5-1)', en: 'Basic Formation (3-4-3 / 4-5-1)' },
        formations: ['3-4-3', '4-5-1'],
        autoResolvable: false,
        ability: { pt: 'Sem efeito — escolha livremente entre as 2 Formações indicadas.', en: 'No effect — freely choose between the 2 indicated Formations.' }
    },
    {
        id: 'basica_4',
        name: { pt: 'Formação Básica (5-4-1 / 4-3-3)', en: 'Basic Formation (5-4-1 / 4-3-3)' },
        formations: ['5-4-1', '4-3-3'],
        autoResolvable: false,
        ability: { pt: 'Sem efeito — escolha livremente entre as 2 Formações indicadas.', en: 'No effect — freely choose between the 2 indicated Formations.' }
    },
    {
        id: 'libero',
        name: { pt: 'Líbero', en: 'Libero' },
        formations: ['4-5-1'],
        autoResolvable: false,
        ability: {
            pt: 'Vire qualquer marcador de uniforme que não tiver uma carta de Atleta correspondente.',
            en: 'Flip any Jersey marker that has no matching Player card.'
        }
    },
    {
        id: 'pressao',
        name: { pt: 'Pressão', en: 'Pressure' },
        formations: ['3-4-3'],
        autoResolvable: true,
        ability: {
            // Transcribed as-is from tactics.csv — note the source text pairs
            // "atacantes" with a "(ícone de escudo)" parenthetical, which is
            // inconsistent with the shield=Defender icon used on the Passe
            // Longo card above. The effect below follows the word
            // "atacantes" (Attackers), not the parenthetical icon note.
            pt: 'Se você tiver 2 ou mais atacantes escalados, cada um ganha 2 de força temporária.',
            en: 'If you have 2 or more Attackers fielded, each one gains 2 temporary Strength.'
        },
        preEffect: function (team) {
            const attackers = [];
            ['Left', 'Right', 'Attack', 'Mid', 'Defense'].forEach(area => {
                (team[area] || []).forEach(p => { if (p.isAttacker) attackers.push(p); });
            });
            if (attackers.length >= 2) attackers.forEach(p => { p.power += 2; });
            return team;
        }
    },
    {
        id: 'dar_tudo',
        name: { pt: 'Dar Tudo de Si', en: 'Give Your All' },
        formations: ['3-5-2'],
        autoResolvable: false,
        ability: {
            pt: 'Escolha uma carta de Atleta escalado e role um dado de seis faces. 1-3: após a partida, coloque 1 ícone de lesão na carta. 4-6: coloque 2 ícones de força temporária na carta.',
            en: 'Choose an assigned Player card and roll a six-sided die. 1-3: after the match, place 1 Injury token on the card. 4-6: place 2 temporary Strength tokens on the card.'
        }
    },
    {
        id: 'aquecimento',
        name: { pt: 'Aquecimento', en: 'Warm-up' },
        formations: ['4-2-4'],
        autoResolvable: false,
        ability: {
            pt: 'Coloque 2 ícones de preparo físico da Reserva em qualquer carta de Atleta.',
            en: 'Place 2 Conditioning tokens from the Reserve on any Player card.'
        }
    },
    {
        id: 'nada_a_perder',
        name: { pt: 'Nada a Perder', en: 'Nothing to Lose' },
        formations: ['4-3-3'],
        autoResolvable: true,
        needsInput: 'oppAboveLeague',
        ability: {
            pt: 'Se seu adversário estiver acima de você na tabela da Liga, marque um gol.',
            en: 'If your opponent is above you on the League table, score a goal.'
        },
        postEffect: function (team, npcTeam, res, extra) {
            return (extra && extra.oppAboveLeague) ? 1 : 0;
        }
    },
    {
        id: 'contra_ataque',
        name: { pt: 'Contra-Ataque', en: 'Counter-Attack' },
        formations: ['4-4-2'],
        autoResolvable: true,
        ability: {
            pt: 'Se você tiver pelo menos 4 Zagueiros escalados, e nenhum dos Atacantes de Centro do Adversário marcar um gol, marque um gol.',
            en: 'If you have at least 4 Defenders fielded, and none of the Opponent\'s Central Forwards score, you score a goal.'
        },
        postEffect: function (team, npcTeam, res) {
            let defenders = 0;
            ['Left', 'Right', 'Attack', 'Mid', 'Defense'].forEach(area => {
                (team[area] || []).forEach(p => { if (!p.isAttacker) defenders++; });
            });
            if (defenders < 4) return 0;
            const npcCentralForwardsScored = (res.finish.npc || []).some(f => f.result === 'goal' && f.shot.area === 'Attack');
            return npcCentralForwardsScored ? 0 : 1;
        }
    },
    {
        id: 'jogar_pelo_empate',
        name: { pt: 'Jogar Pelo Empate', en: 'Play for the Draw' },
        formations: ['5-3-2'],
        autoResolvable: false,
        ability: {
            pt: 'Coloque até 3 ícones de força temporária, tirando-os de até 3 cartas de Atleta escaladas diferentes, para colocar até 3 ícones de força temporária em outras 3 cartas de Atleta escaladas diferentes.',
            en: 'Place up to 3 temporary Strength tokens, taking them from up to 3 different assigned Player cards, to place up to 3 temporary Strength tokens on 3 other different assigned Player cards.'
        }
    }
];

function getTactic(id) {
    return TACTICS.find(tc => tc.id === id) || null;
}

if (typeof module !== 'undefined') {
    module.exports = { FORMATIONS, TACTICS, suggestZoneLayout, defaultIsAttacker, getTactic };
}
