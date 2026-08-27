import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_logic = """      if (state.leaderVp < cost) {
        alert("O Líder não tem moedas suficientes! (Tem " + state.leaderVp + " / Custa " + cost + ")");
        return;
      }
      
      adjustCoins(-cost);"""

new_logic = """      adjustCoins(-cost);"""

html = html.replace(old_logic, new_logic)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
