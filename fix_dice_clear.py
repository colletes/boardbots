with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Replace the commented out display:none with diceBox.clear()
old_js = "setTimeout(() => { // document.getElementById('dice-box').style.display = 'none'; isRolling = false; }, 2000);"
new_js = "setTimeout(() => { diceBox.clear(); isRolling = false; }, 2500);"
html = html.replace(old_js, new_js)

# Also ensure diceBox.clear() happens right before rolling in case there are old dice left over
old_roll = "diceBox.updateConfig({ themeColor: hex });"
new_roll = "diceBox.updateConfig({ themeColor: hex });\\n      diceBox.clear();"
html = html.replace(old_roll, new_roll)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
