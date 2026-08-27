with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("assetPath: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',", "assetPath: 'assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
