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

        if (attacking.length === 0) return [];
        if (defending.length === 0) return attacking;

        // Sort both ascending and greedily give each attacker (weakest first) the
        // smallest defender that can still block them. This is the optimal
        // assignment (fewest goals possible, per the rules) and, unlike a plain
        // first-fit scan, doesn't depend on the order Players were entered in.
        let defPowers = defending.map(p => p.power).sort((a, b) => a - b);
        let attackers = [...attacking].sort((a, b) => a.power - b.power);
        let goalkickers = [];

        for (let attacker of attackers) {
            let goalkick = true;

            for (let defId = 0; defId < defPowers.length; defId++) {
                if (defPowers[defId] >= attacker.power) {
                    defPowers.splice(defId, 1);
                    goalkick = false;
                    break;
                }
            }

            if (goalkick) {
                goalkickers.push(attacker);
            }
        }
        
        return goalkickers;
    },

    checkMatch: function(playerTeam, npcTeam) {
        // NPC goals
        let npckickers = [];
        this.AREAS.forEach(area => {
            npckickers = npckickers.concat(this.calculatePossible(npcTeam, playerTeam, area));
        });
        // Sort by power ascending
        npckickers.sort((a, b) => a.power - b.power);

        let playerGloves = playerTeam.GK ? playerTeam.GK.gloves : 0;
        let playerGKPower = playerTeam.GK ? playerTeam.GK.power : 0;
        
        let npcGoalers = [];
        for (let kicker of npckickers) {
            if (playerGloves > 0 && kicker.power <= playerGKPower) {
                playerGloves--;
                continue;
            }
            npcGoalers.push(kicker);
        }

        // Player goals
        let playerkickers = [];
        this.AREAS.forEach(area => {
            playerkickers = playerkickers.concat(this.calculatePossible(playerTeam, npcTeam, area));
        });
        // Sort by power ascending
        playerkickers.sort((a, b) => a.power - b.power);

        let npcGloves = npcTeam.GK ? npcTeam.GK.gloves : 0;
        let npcGKPower = npcTeam.GK ? npcTeam.GK.power : 0;
        
        let playerGoalers = [];
        for (let kicker of playerkickers) {
            if (npcGloves > 0 && kicker.power <= npcGKPower) {
                npcGloves--;
                continue;
            }
            playerGoalers.push(kicker);
        }

        return {
            TeamGoals: playerGoalers.length,
            NPCGoals: npcGoalers.length,
            TeamScorers: playerGoalers.map(p => p.shirt)
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = ElevenSolver;
}
