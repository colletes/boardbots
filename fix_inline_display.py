with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_inline = '<div id="dice-box" style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; pointer-events:none; display:none;"></div>'
new_inline = '<div id="dice-box" style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; pointer-events:none;"></div>'

html = html.replace(old_inline, new_inline)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
