import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Update the original #dice-box HTML to be inside a fixed #dice-tray
old_box_html = '<div id="dice-box" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:10; pointer-events:none;"></div>'
new_box_html = """<!-- Fixed Dice Tray in Bottom Left -->
  <div id="dice-tray" style="position:fixed; bottom:20px; left:20px; width:180px; height:180px; z-index:9999; pointer-events:none;">
    <div id="dice-box" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></div>
  </div>"""
html = html.replace(old_box_html, new_box_html)

# 2. Update initDiceBox scale to 12
html = html.replace('scale: 9', 'scale: 12')

# 3. Remove the buggy DOM manipulation from rollDiceBox
roll_old = """      const diceBoxEl = document.getElementById('dice-box');
      const targetEl = reason === 'landmark' ? document.getElementById('landmarkDiceResult') : document.getElementById('inlineDiceResult');
      
      targetEl.textContent = ''; // clear old text so tray is empty during roll
      targetEl.style.position = 'relative';
      targetEl.style.minHeight = '150px';
      targetEl.appendChild(diceBoxEl);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 50);"""

html = html.replace(roll_old, "")

# 4. Clean up the clear() logic (remove the minHeight collapse)
clear_old1 = """            diceBox.clear(); 
            isRolling = false; 
            document.getElementById('landmarkDiceResult').style.minHeight = '0';
            document.getElementById('inlineDiceResult').style.minHeight = '0';"""
clear_new1 = """            diceBox.clear(); 
            isRolling = false;"""
html = html.replace(clear_old1, clear_new1)

clear_old2 = """          diceBox.clear();
          isRolling = false;
          document.getElementById('landmarkDiceResult').style.minHeight = '0';
          document.getElementById('inlineDiceResult').style.minHeight = '0';"""
clear_new2 = """          diceBox.clear();
          isRolling = false;"""
html = html.replace(clear_old2, clear_new2)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
