import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("🔬 DERROTA POR SUPREMACIA CIENTÍFICA! O Líder reuniu 6 fichas de raça distintas!", "🏆 DERROTA POR APOIO DAS RAÇAS! O Bot reuniu 6 símbolos de raça diferentes!")
html = html.replace("🔬 SCIENTIFIC SUPREMACY DEFEAT! The Leader collected 6 distinct race chips!", "🏆 SUPPORT OF THE RACES DEFEAT! The Bot collected 6 different race symbols!")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
