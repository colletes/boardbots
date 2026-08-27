with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("const d = DICTIONARIES[state.lang];", "const d = I18N[state.lang] || I18N.pt;")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
