import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

pattern = r"setTimeout\(\(\) => \{ document\.getElementById\('dice-box'\)\.style\.display = 'none'; \}, 2000\);"
replacement = "setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; isRolling = false; }, 2000);"

html, num = re.subn(pattern, replacement, html)
print(f"Replaced {num} instances of setTimeout.")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
