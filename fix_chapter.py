with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Add chapterVal update back into updateUI
old_update = """      document.getElementById('leaderVpVal').textContent = state.leaderVp;
      

      renderScienceChips();"""

new_update = """      document.getElementById('leaderVpVal').textContent = state.leaderVp;
      
      const chapVal = document.getElementById('chapterVal');
      if (chapVal) {
        chapVal.textContent = state.currentAge;
      }

      renderScienceChips();"""

html = html.replace(old_update, new_update)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
