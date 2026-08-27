import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_str = "diceBox.roll(reason === 'landmark' ? '1d6' : reason === 'race2' ? '1d2' : '1d3');"
new_str = "diceBox.roll('1d6');"

html = html.replace(old_str, new_str)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
