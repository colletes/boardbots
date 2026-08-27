import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_roll = """    async function rollDiceBox(reason) {
      if (isRolling) return;
      isRolling = true;
      if (!diceInitialized) await initDiceBox();"""
new_roll = """    async function rollDiceBox(reason) {
      if (isRolling) return;
      isRolling = true;
      
      try {
        if (!diceInitialized) await initDiceBox();
      } catch (e) {
        console.error('initDiceBox threw error', e);
        diceFallback = true;
      }"""

html = html.replace(old_roll, new_roll)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
