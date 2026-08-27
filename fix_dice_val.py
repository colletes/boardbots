import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_logic = """        diceBox.onRollComplete = (results) => {
          setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; isRolling = false; }, 2000);
          const val = results[0].value;
          if (currentDiceResolve) {
            currentDiceResolve(val);
            currentDiceResolve = null;
          }
        };"""

new_logic = """        diceBox.onRollComplete = (results) => {
          setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; isRolling = false; }, 2000);
          let val = 0;
          const group = Array.isArray(results) ? results[0] : results;
          if (group && group.rolls && group.rolls.length > 0) val = group.rolls[0].value;
          else if (group) val = group.value;
          
          if (currentDiceResolve) {
            currentDiceResolve(val || Math.floor(Math.random() * 6) + 1); // fallback to random if 0/undefined
            currentDiceResolve = null;
          }
        };"""

html = html.replace(old_logic, new_logic)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
