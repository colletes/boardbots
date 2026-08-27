import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Make dice-box position absolute instead of fixed
html = html.replace(
    '<div id="dice-box" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; pointer-events:none;"></div>',
    '<div id="dice-box" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; pointer-events:none;"></div>'
)

# Increase scale from 6 to 9
html = html.replace('scale: 6', 'scale: 9')

# Move the container in rollDiceBox
roll_str_old = """      const lColor = LEADERS[state.selectedLeader]?.cardColor;"""

roll_str_new = """      const diceBoxEl = document.getElementById('dice-box');
      const targetEl = reason === 'landmark' ? document.getElementById('landmarkDiceResult') : document.getElementById('inlineDiceResult');
      
      targetEl.style.position = 'relative';
      targetEl.style.minHeight = '150px';
      targetEl.appendChild(diceBoxEl);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
      
      const lColor = LEADERS[state.selectedLeader]?.cardColor;"""

html = html.replace(roll_str_old, roll_str_new)

# Clear the minHeight when roll is complete so it collapses back
clear_old = """setTimeout(() => { diceBox.clear(); isRolling = false; }, 2500);"""
clear_new = """setTimeout(() => { 
            diceBox.clear(); 
            isRolling = false; 
            document.getElementById('landmarkDiceResult').style.minHeight = '0';
            document.getElementById('inlineDiceResult').style.minHeight = '0';
          }, 2500);"""

html = html.replace(clear_old, clear_new)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
