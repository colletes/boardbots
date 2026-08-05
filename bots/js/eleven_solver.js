/**
 * Eleven Match Solver
 * Ported from C# ResultHandler.cs
 */

const ElevenSolver = {
    // team definition:
    // {
    //    GK: { power: int, gloves: int },
    //    Left: [{ power: int, isAttacker: bool, shirt: int }, ...],
    //    Right: [...],
    //    Attack: [...],
    //    Mid: [...],
    //    Defense: [...]
    // }
    
    AREAS: ['Left', 'Right', 'Attack', 'Mid', 'Defense'],

    // Per the rulebook, Sections face their mirrored counterpart (Opponent card
    // is placed upside down): your Left Wing faces their Right Wing, your Central
    // Forwards face their Central Defenders, and so on. Central Midfield mirrors itself.
    OPPOSING_AREA: { Left: 'Right', Right: 'Left', Attack: 'Defense', Defense: 'Attack', Mid: 'Mid' },

    calculatePossible: function(attackingTeam, defendingTeam, attackArea) {
        const defenseArea = this.OPPOSING_AREA[attackArea];
        // attacking: players in the attacking Team's Section that are attackers
        // defending: players in the defending Team's MIRRORED Section that are defenders
        const attacking = (attackingTeam[attackArea] || []).filter(p => p.isAttacker);
        const defending = (defendingTeam[defenseArea] || []).filter(p => !p.isAttacker);

        if (attacking.length === 0) return { scorers: [], blocked: [] };

        // Sort both ascending and greedily give each attacker (weakest first) the
        // smallest defender that can still block them. This is the optimal
        // assignment (fewest goals possible, per the rules) and, unlike a plain
        // first-fit scan, doesn't depend on the order Players were entered in.
        let defPowers = defending.map(p => p.power).sort((a, b) => a - b);
        let attackers = [...attacking].sort((a, b) => a.power - b.power);
        let scorers = [];
        let blocked = [];

        for (let attacker of attackers) {
            let wasBlocked = false;

            for (let defId = 0; defId < defPowers.length; defId++) {
                if (defPowers[defId] >= attacker.power) {
                    defPowers.splice(defId, 1);
                    wasBlocked = true;
                    break;
                }
            }

            if (wasBlocked) blocked.push(attacker);
            else scorers.push(attacker);
        }

        return { scorers, blocked };
    },

    // Builds the full play-by-play resolution of a Match, following the exact
    // order described in the rulebook (Left, Right, Attack, Mid, Defense), plus
    // the goalkeeper save phase (weakest shot first, across all zones). Powers
    // both the plain score (checkMatch) and the narrated/animated Match Solver UI.
    resolveMatch: function(playerTeam, npcTeam) {
        const chances = [];
        let playerShots = [];
        let npcShots = [];

        this.AREAS.forEach(area => {
            const p = this.calculatePossible(playerTeam, npcTeam, area);
            const n = this.calculatePossible(npcTeam, playerTeam, area);
            chances.push({ area, side: 'player', scorers: p.scorers, blocked: p.blocked });
            chances.push({ area, side: 'npc', scorers: n.scorers, blocked: n.blocked });
            playerShots = playerShots.concat(p.scorers.map(s => Object.assign({}, s, { area })));
            npcShots = npcShots.concat(n.scorers.map(s => Object.assign({}, s, { area })));
        });

        // Weakest shot first (per rulebook example resolution order)
        playerShots.sort((a, b) => a.power - b.power);
        npcShots.sort((a, b) => a.power - b.power);

        let npcGloves = npcTeam.GK ? npcTeam.GK.gloves : 0;
        let npcGKPower = npcTeam.GK ? npcTeam.GK.power : 0;
        let playerGloves = playerTeam.GK ? playerTeam.GK.gloves : 0;
        let playerGKPower = playerTeam.GK ? playerTeam.GK.power : 0;

        // Chronological "keeper's phase" log per team: each shot, in the order
        // it's judged, tagged with whether it was saved or went in.
        const playerFinish = []; // player's shots vs. npc's keeper
        for (let shot of playerShots) {
            if (npcGloves > 0 && shot.power <= npcGKPower) {
                npcGloves--;
                playerFinish.push({ shot, result: 'save' });
            } else {
                playerFinish.push({ shot, result: 'goal' });
            }
        }
        const npcFinish = []; // npc's shots vs. player's keeper
        for (let shot of npcShots) {
            if (playerGloves > 0 && shot.power <= playerGKPower) {
                playerGloves--;
                npcFinish.push({ shot, result: 'save' });
            } else {
                npcFinish.push({ shot, result: 'goal' });
            }
        }

        const playerGoalers = playerFinish.filter(f => f.result === 'goal').map(f => f.shot);
        const npcGoalers = npcFinish.filter(f => f.result === 'goal').map(f => f.shot);

        return {
            chances,
            finish: { player: playerFinish, npc: npcFinish },
            TeamGoals: playerGoalers.length,
            NPCGoals: npcGoalers.length,
            TeamScorers: playerGoalers.map(p => p.shirt),
            NPCScorers: npcGoalers.map(p => p.shirt)
        };
    },

    checkMatch: function(playerTeam, npcTeam) {
        const res = this.resolveMatch(playerTeam, npcTeam);
        return {
            TeamGoals: res.TeamGoals,
            NPCGoals: res.NPCGoals,
            TeamScorers: res.TeamScorers
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = ElevenSolver;
}
