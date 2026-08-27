import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# We need to replace await diceBox.init(); with the Promise.race
html = html.replace('await diceBox.init();', '''await Promise.race([
          diceBox.init(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DiceBox init timeout')), 3000))
        ]);''')

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
