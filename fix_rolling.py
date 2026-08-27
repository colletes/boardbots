import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

target_logic = """      currentDiceResolve = (val) => {"""
new_target_logic = """      const elLandmark = document.getElementById('landmarkDiceResult');
      const elRace = document.getElementById('inlineDiceResult');
      
      if (reason === 'landmark' && elLandmark) {
        elLandmark.innerHTML = '<span style="color:var(--text-dim);"><span class="spin-icon" style="display:inline-block;">🎲</span> ' + (state.lang === 'pt' ? 'Rolando...' : 'Rolling...') + '</span>';
      } else if (elRace) {
        elRace.innerHTML = '<span style="color:var(--text-dim);"><span class="spin-icon" style="display:inline-block;">🎲</span> ' + (state.lang === 'pt' ? 'Rolando...' : 'Rolling...') + '</span>';
      }

      currentDiceResolve = (val) => {"""

html = html.replace(target_logic, new_target_logic)

css_target = """    .spin-icon {"""
if "spin-icon" not in html:
    css_old = """    .pulse { animation: pulse 2s infinite; }"""
    css_new = """    .pulse { animation: pulse 2s infinite; }
    @keyframes spinRoll { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .spin-icon { animation: spinRoll 1s linear infinite; }"""
    html = html.replace(css_old, css_new)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
