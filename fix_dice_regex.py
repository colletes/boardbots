import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Replace the diceBox configuration
pattern = r"assetPath: '\.\./assets/dice-box/', origin: window\.location\.origin \+ window\.location\.pathname\.replace\(/\[\^\\/\]\*\$\/, ''\)"
replacement = "assetPath: 'assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/'"

html, num_subs = re.subn(pattern, replacement, html)
print(f"Replaced {num_subs} instances of config.")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
