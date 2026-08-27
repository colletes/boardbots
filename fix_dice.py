with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_dice_init = """    async function initDiceBox() {
      if (diceInitialized) return;
      const { default: DiceBox } = await import('../assets/dice-box/dice-box.es.min.js');
      diceBox = new DiceBox({
        container: '#dice-box',
        assetPath: '../assets/dice-box/',
        theme: 'default',
        themeColor: '#475569',
        scale: 6
      });
      await diceBox.init();
      diceInitialized = true;
      
      diceBox.onRollComplete = (results) => {
        setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; }, 2000);
        const val = results[0].value;
        if (currentDiceResolve) {
          currentDiceResolve(val);
          currentDiceResolve = null;
        }
      };
    }"""

new_dice_init = """    let diceFallback = false;
    async function initDiceBox() {
      if (diceInitialized) return;
      try {
        const { default: DiceBox } = await import('../assets/dice-box/dice-box.es.min.js');
        diceBox = new DiceBox({
          container: '#dice-box',
          assetPath: '../assets/dice-box/', origin: window.location.origin + window.location.pathname.replace(/[^\\/]*$/, ''),
          theme: 'default',
          themeColor: '#475569',
          scale: 6
        });
        await diceBox.init();
        diceInitialized = true;
        
        diceBox.onRollComplete = (results) => {
          setTimeout(() => { document.getElementById('dice-box').style.display = 'none'; }, 2000);
          const val = results[0].value;
          if (currentDiceResolve) {
            currentDiceResolve(val);
            currentDiceResolve = null;
          }
        };
      } catch (e) {
        console.error('DiceBox failed to load, falling back to math.random', e);
        diceFallback = true;
        diceInitialized = true;
      }
    }"""

html = html.replace(old_dice_init, new_dice_init)

old_dice_roll = """      diceBox.updateConfig({ themeColor: hex });

      document.getElementById('dice-box').style.display = 'block';
      diceBox.roll('1d6');
      
      currentDiceResolve = (val) => {"""

new_dice_roll = """      currentDiceResolve = (val) => {
        const el = document.getElementById('inlineDiceResult');
        if (reason === 'landmark') {
          addLog({ type: 'generic', text: `Rolou ${val} para escolher Landmark.` });
          el.textContent = `🎲 Dado: ${val} (Escolha a Landmark correspondente)`;
        } else if (reason === 'race2') {
          const res = val <= 3 ? "1ª Ficha (Esquerda)" : "2ª Ficha (Direita)";
          addLog({ type: 'generic', text: `Rolou ${val} p/ Ficha de Raça: ${res}.` });
          el.textContent = `🎲 Dado: ${val} -> Pegue a ${res}`;
        } else if (reason === 'race3') {
          let res = "1ª Ficha (Esquerda)";
          if (val >= 3 && val <= 4) res = "2ª Ficha (Meio)";
          if (val >= 5) res = "3ª Ficha (Direita)";
          addLog({ type: 'generic', text: `Rolou ${val} p/ Ficha de Raça: ${res}.` });
          el.textContent = `🎲 Dado: ${val} -> Pegue a ${res}`;
        }
      };

      if (diceFallback) {
         currentDiceResolve(Math.floor(Math.random() * 6) + 1);
         return;
      }

      diceBox.updateConfig({ themeColor: hex });
      document.getElementById('dice-box').style.display = 'block';
      diceBox.roll('1d6');"""

# Needs careful replace
html = html.replace("""      diceBox.updateConfig({ themeColor: hex });

      document.getElementById('dice-box').style.display = 'block';
      diceBox.roll('1d6');
      
      currentDiceResolve = (val) => {
        const el = document.getElementById('inlineDiceResult');
        if (reason === 'landmark') {
          addLog({ type: 'generic', text: `Rolou ${val} para escolher Landmark.` });
          el.textContent = `🎲 Dado: ${val} (Escolha a Landmark correspondente)`;
        } else if (reason === 'race2') {
          const res = val <= 3 ? "1ª Ficha (Esquerda)" : "2ª Ficha (Direita)";
          addLog({ type: 'generic', text: `Rolou ${val} p/ Ficha de Raça: ${res}.` });
          el.textContent = `🎲 Dado: ${val} -> Pegue a ${res}`;
        } else if (reason === 'race3') {
          let res = "1ª Ficha (Esquerda)";
          if (val >= 3 && val <= 4) res = "2ª Ficha (Meio)";
          if (val >= 5) res = "3ª Ficha (Direita)";
          addLog({ type: 'generic', text: `Rolou ${val} p/ Ficha de Raça: ${res}.` });
          el.textContent = `🎲 Dado: ${val} -> Pegue a ${res}`;
        }
      };""", new_dice_roll)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
