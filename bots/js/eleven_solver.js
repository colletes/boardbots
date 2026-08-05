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

    calculatePossible: function(attackingTeam, defendingTeam, area) {
        // attacking: array of players in that area that are attackers
        // defending: array of players in that area that are defenders
        const attacking = (attackingTeam[area] || []).filter(p => p.isAttacker);
        const defending = (defendingTeam[area] || []).filter(p => !p.isAttacker);

        if (attacking.length === 0) return [];
        if (defending.length === 0) return attacking;

        let defPowers = defending.map(p => p.power);
        
        // Stack of attackers
        let attStack = [...attacking];
        let goalkickers = [];

        while (attStack.length > 0) {
            let attacker = attStack.pop();
            let defId = 0;
            let goalkick = true;

            for (; defId < defPowers.length; defId++) {
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
