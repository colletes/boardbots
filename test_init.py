import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Let's see if we can timeout the init!
old_init_dice = """    async function initDiceBox() {
      if (diceInitialized) return;
      try {
        const { default: DiceBox } = await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');
        diceBox = new DiceBox({
          container: '#dice-box',
          assetPath: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',
          theme: 'default',
          themeColor: '#475569',
          scale: 6
        });
        await diceBox.init();
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        diceBox.onRollComplete = (results) => {"""

new_init_dice = """    async function initDiceBox() {
      if (diceInitialized) return;
      try {
        const { default: DiceBox } = await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');
        diceBox = new DiceBox({
          container: '#dice-box',
          assetPath: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',
          theme: 'default',
          themeColor: '#475569',
          scale: 6
        });
        
        // Timeout the init itself because Web Workers can hang forever on GitHub Pages if CORS blocked
        await Promise.race([
          diceBox.init(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DiceBox init timeout')), 3000))
        ]);
        
        setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        diceBox.onRollComplete = (results) => {"""

html = html.replace(old_init_dice, new_init_dice)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
