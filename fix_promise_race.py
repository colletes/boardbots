import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_str = """        await diceBox.init();
        diceInitialized = true;"""
        
new_str = """        await Promise.race([
          diceBox.init(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DiceBox init timeout')), 3000))
        ]);
        diceInitialized = true;"""

if old_str in html:
    html = html.replace(old_str, new_str)
    with open("bots/lotr_duel_bot_v1.html", "w") as f:
        f.write(html)
    print("SUCCESS: Replaced Promise.race")
else:
    print("FAILED: Could not find target string!")
