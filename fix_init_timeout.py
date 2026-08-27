with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# We need to wrap the WHOLE thing in a timeout.
# Actually, the simplest way is to wrap the call in rollDiceBox.

old_roll = """      try {
        if (!diceInitialized) await initDiceBox();
      } catch (e) {"""

new_roll = """      try {
        if (!diceInitialized) {
          await Promise.race([
            initDiceBox(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('initDiceBox global timeout')), 3000))
          ]);
        }
      } catch (e) {"""

html = html.replace(old_roll, new_roll)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
