import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_dice_import = "const { default: DiceBox } = await import('../assets/dice-box/dice-box.es.min.js');"
new_dice_import = "const { default: DiceBox } = await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');"

old_dice_config = """        diceBox = new DiceBox({
          container: '#dice-box',
          assetPath: '../assets/dice-box/', origin: '',
          theme: 'default',
          themeColor: '#475569',
          scale: 6
        });"""

new_dice_config = """        diceBox = new DiceBox({
          container: '#dice-box',
          assetPath: 'assets/',
          origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',
          theme: 'default',
          themeColor: '#475569',
          scale: 6
        });"""

html = html.replace(old_dice_import, new_dice_import)
html = html.replace(old_dice_config, new_dice_config)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
