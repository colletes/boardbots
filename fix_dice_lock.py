with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_dice_func = """    async function rollDiceBox(reason) {
      if (!diceInitialized) await initDiceBox();
      
      const lColor = LEADERS[state.selectedLeader]?.cardColor;"""

new_dice_func = """    let isRolling = false;
    async function rollDiceBox(reason) {
      if (isRolling) return;
      isRolling = true;
      if (!diceInitialized) await initDiceBox();
      
      const lColor = LEADERS[state.selectedLeader]?.cardColor;"""

old_dice_complete = """        diceBox.onRollComplete = (results) => {
          setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; }, 2000);
          if (currentDiceResolve && results[0]) currentDiceResolve(results[0].value);
        };"""

new_dice_complete = """        diceBox.onRollComplete = (results) => {
          setTimeout(() => { 
            document.getElementById('dice-box').style.display = 'none'; 
            isRolling = false;
          }, 2000);
          if (currentDiceResolve && results[0]) currentDiceResolve(results[0].value);
        };"""

old_fallback_complete = """      if (diceFallback) {
         currentDiceResolve(Math.floor(Math.random() * 6) + 1);
         return;
      }"""

new_fallback_complete = """      if (diceFallback) {
         currentDiceResolve(Math.floor(Math.random() * 6) + 1);
         isRolling = false;
         return;
      }"""

html = html.replace(old_dice_func, new_dice_func)
html = html.replace(old_dice_complete, new_dice_complete)
html = html.replace(old_fallback_complete, new_fallback_complete)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
