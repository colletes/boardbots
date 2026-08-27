import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix 1: Language buttons on load
old_init = """    function init() {
      loadState();
      applyI18n();"""
new_init = """    function init() {
      loadState();
      document.getElementById('langPtBtn').classList.toggle('active', state.lang === 'pt');
      document.getElementById('langEnBtn').classList.toggle('active', state.lang === 'en');
      applyI18n();"""
html = html.replace(old_init, new_init)

# Fix 2: Dice resize event and CSS
old_dice_init = """        await diceBox.init();
        diceBox.onRollComplete = (results) => {"""
new_dice_init = """        await diceBox.init();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        diceBox.onRollComplete = (results) => {"""
html = html.replace(old_dice_init, new_dice_init)

# Fix 3: Change dice-box style from fixed/vw/vh to fixed/100%/100% just in case
old_dice_style = 'id="dice-box" style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; pointer-events:none;"'
new_dice_style = 'id="dice-box" style="position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; pointer-events:none;"'
html = html.replace(old_dice_style, new_dice_style)

# Fix 4: Add a timeout to fallback if the roll never completes (failsafe)
old_roll_dice = """      diceBox.updateConfig({ themeColor: hex });
      diceBox.clear();
      
      diceBox.roll('1d6');
    }"""
new_roll_dice = """      diceBox.updateConfig({ themeColor: hex });
      diceBox.clear();
      
      diceBox.roll(reason === 'landmark' ? '1d6' : reason === 'race2' ? '1d2' : '1d3');
      
      // Fallback failsafe: If dice don't settle in 4 seconds, force resolve
      setTimeout(() => {
        if (isRolling && currentDiceResolve) {
          console.warn('Dice roll timed out! Forcing fallback.');
          diceBox.clear();
          isRolling = false;
          let maxVal = reason === 'landmark' ? 6 : reason === 'race2' ? 2 : 3;
          currentDiceResolve(Math.floor(Math.random() * maxVal) + 1);
          currentDiceResolve = null;
        }
      }, 4000);
    }"""
html = html.replace(old_roll_dice, new_roll_dice)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
