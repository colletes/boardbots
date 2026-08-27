import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Add landmarkDiceResult to panelLandmarksContent
old_landmark_btn_row = """          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" onclick="botBuyLandmark()" style="flex:1; background:var(--accent); color:var(--bg); border:none; padding:8px; font-weight:bold;" data-i18n="panelLandmarksBtnBuy">✅ Bot Comprou Landmark</button>
            <button id="btnRollLandmark" class="btn-secondary" onclick="rollDiceBox('landmark')" style="flex:1; padding:8px;" data-i18n="panelLandmarksBtnRoll">🎲 Sortear (1d6)</button>
          </div>"""
new_landmark_btn_row = """          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" onclick="botBuyLandmark()" style="flex:1; background:var(--accent); color:var(--bg); border:none; padding:8px; font-weight:bold;" data-i18n="panelLandmarksBtnBuy">✅ Bot Comprou Landmark</button>
            <button id="btnRollLandmark" class="btn-secondary" onclick="rollDiceBox('landmark')" style="flex:1; padding:8px;" data-i18n="panelLandmarksBtnRoll">🎲 Sortear (1d6)</button>
          </div>
          <div id="landmarkDiceResult" style="margin-top:8px; font-weight:bold; color:var(--accent); text-align:center; font-size:0.9rem;"></div>"""

html = html.replace(old_landmark_btn_row, new_landmark_btn_row)

# Update currentDiceResolve to use the correct div
old_dice_resolve = """      currentDiceResolve = (val) => {
        const el = document.getElementById('inlineDiceResult');
        const d = I18N[state.lang] || I18N.pt;
        if (reason === 'landmark') {
          addLog({ type: 'generic', text: d.logDiceLandmark.replace('{val}', val) });
          el.textContent = d.diceResultLandmark.replace('{val}', val);
        } else if (reason === 'race2') {"""
new_dice_resolve = """      currentDiceResolve = (val) => {
        const elLandmark = document.getElementById('landmarkDiceResult');
        const elRace = document.getElementById('inlineDiceResult');
        const d = I18N[state.lang] || I18N.pt;
        if (reason === 'landmark') {
          addLog({ type: 'generic', text: d.logDiceLandmark.replace('{val}', val) });
          if(elLandmark) elLandmark.textContent = d.diceResultLandmark.replace('{val}', val);
        } else if (reason === 'race2') {"""
html = html.replace(old_dice_resolve, new_dice_resolve)

# Ensure race2 and race3 use elRace
old_race2_resolve = """          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          el.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        } else if (reason === 'race3') {"""
new_race2_resolve = """          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          if(elRace) elRace.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        } else if (reason === 'race3') {"""
html = html.replace(old_race2_resolve, new_race2_resolve)

old_race3_resolve = """          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          el.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        }
      };"""
new_race3_resolve = """          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          if(elRace) elRace.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        }
      };"""
html = html.replace(old_race3_resolve, new_race3_resolve)


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
