with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Revert module
html = html.replace('<script type="module">', '<script>')

# Replace static import with dynamic import
old_import = """import DiceBox from '../assets/dice-box/dice-box.es.min.js';
    let diceBox;"""

new_import = """let diceBox;"""

html = html.replace(old_import, new_import)

old_init = """async function initDiceBox() {
      if (diceInitialized) return;
      diceBox = new DiceBox({"""

new_init = """async function initDiceBox() {
      if (diceInitialized) return;
      const { default: DiceBox } = await import('../assets/dice-box/dice-box.es.min.js');
      diceBox = new DiceBox({"""

html = html.replace(old_init, new_init)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
print("Module fixed.")
