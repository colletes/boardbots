import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Clear text content when roll starts
roll_str_old = """      targetEl.style.position = 'relative';
      targetEl.style.minHeight = '150px';
      targetEl.appendChild(diceBoxEl);"""

roll_str_new = """      targetEl.textContent = ''; // clear old text so tray is empty during roll
      targetEl.style.position = 'relative';
      targetEl.style.minHeight = '150px';
      targetEl.appendChild(diceBoxEl);"""

html = html.replace(roll_str_old, roll_str_new)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
