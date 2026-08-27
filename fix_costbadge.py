import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

pattern = r"costBadge\.textContent = `Custo: \$\{cost\} moedas`;"
replacement = "costBadge.textContent = (dict.panelLandmarksCost || 'Custo: ?').replace('?', cost);"

html = html.replace(pattern, replacement) # Oops, regex inside replace won't work if string literal. Let's use simple string replace.
html = html.replace("costBadge.textContent = `Custo: ${cost} moedas`;", replacement)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
