with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("diceBox.updateConfig({ themeColor: hex });\\n      diceBox.clear();", 
                    "diceBox.updateConfig({ themeColor: hex });\n      diceBox.clear();")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
