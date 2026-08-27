import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix PT Dictionary
old_pt = "        panelRingTokensBtn3: 'Sortear de 3 difer. (1d3)',"
new_pt = """        panelRingTokensBtn3: 'Sortear de 3 difer. (1d3)',
        logDiceLandmark: 'Rolou {val} para escolher Landmark.',
        logDiceRace: 'Rolou {val} para Ficha de Raça: {res}.',
        diceResultLandmark: '🎲 Dado: {val} (Pegue o Landmark correspondente)',
        diceResultRace: '🎲 Dado: {val} -> Pegue a {res}',"""

html = html.replace(old_pt, new_pt)

# Fix Dice Extraction
old_dice = """          let val = 0;
          const group = Array.isArray(results) ? results[0] : results;
          if (group && group.rolls && group.rolls.length > 0) val = group.rolls[0].value;
          else if (group) val = group.value;
          
          if (currentDiceResolve) {
            currentDiceResolve(val || Math.floor(Math.random() * 6) + 1); // fallback to random if 0/undefined
            currentDiceResolve = null;
          }"""

new_dice = """          let val = null;
          try {
            const group = Array.isArray(results) ? results[0] : results;
            if (group && group.rolls && group.rolls.length > 0) val = group.rolls[0].value;
            else if (group) val = group.value;
          } catch(e) {}
          
          // force integer, if invalid use random
          val = parseInt(val, 10);
          if (isNaN(val) || val <= 0) val = Math.floor(Math.random() * 6) + 1;

          if (currentDiceResolve) {
            currentDiceResolve(val);
            currentDiceResolve = null;
          }"""

html = html.replace(old_dice, new_dice)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
