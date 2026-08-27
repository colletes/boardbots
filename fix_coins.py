with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix the id mismatch in updateUI
html = html.replace("document.getElementById('leaderVpVal').textContent = state.leaderVp;", "document.getElementById('coinsVal').textContent = state.leaderVp;")

# Also change the i18n label from vpSubtext to something more accurate if needed, or leave it.
# Actually, the user says "Coins +/- buttons are not working."
# I'll just fix the ID.

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
