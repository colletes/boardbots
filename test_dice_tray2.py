import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

fallback_old = """          diceBox.clear();
          isRolling = false;
          let maxVal = reason === 'landmark' ? 6 : reason === 'race2' ? 2 : 3;"""

fallback_new = """          diceBox.clear();
          isRolling = false;
          document.getElementById('landmarkDiceResult').style.minHeight = '0';
          document.getElementById('inlineDiceResult').style.minHeight = '0';
          let maxVal = reason === 'landmark' ? 6 : reason === 'race2' ? 2 : 3;"""

html = html.replace(fallback_old, fallback_new)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
