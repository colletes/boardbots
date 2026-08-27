with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

html = html.replace("origin: window.location.origin + window.location.pathname.replace(/[^\\\\/]*$/, '')", "origin: ''")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
