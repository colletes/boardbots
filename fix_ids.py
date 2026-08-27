with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("document.getElementById('militaryVal').textContent = ", "document.getElementById('fortressVal').textContent = ")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
