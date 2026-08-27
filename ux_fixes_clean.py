import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Fortalezas tracking should be 0 to 7
html = html.replace("state.military = Math.max(-9, Math.min(9, state.military + delta));", "state.military = Math.max(0, Math.min(7, state.military + delta));")
html = html.replace("if (state.military <= -9) {", "if (false) {") 
html = html.replace("if (state.military >= 9) {", "if (state.military >= 7) {")
html = html.replace("dict.militaryLoseAlert", "dict.conquerLoseAlert")
html = html.replace("militaryLoseAlert: '☠️ DERROTA! O Líder alcançou a Supremacia Militar!',", "conquerLoseAlert: '☠️ DERROTA! O Líder posicionou sua 7ª Fortaleza e Conquistou a Terra-média!',")
html = html.replace("militaryLoseAlert: '☠️ DEFEAT! The Leader reached Military Supremacy!',", "conquerLoseAlert: '☠️ DEFEAT! The Leader placed their 7th Fortress and Conquered Middle-earth!',")

# 2. Fix the Fortress UI
old_updateui_military = """      document.getElementById('fortressVal').textContent = (state.military > 0 ? `+${state.military}` : state.military);
      
      const dict = I18N[state.lang] || I18N.pt;
      const sub = document.getElementById('fortressSubtext');
      if (state.military < 0) {
        sub.textContent = dict.militaryPlayerLead.replace('{count}', Math.abs(state.military));
        sub.style.color = 'var(--green)';
      } else if (state.military > 0) {
        sub.textContent = dict.militaryLeaderLead.replace('{count}', state.military);
        sub.style.color = 'var(--red)';
      } else {
        sub.textContent = dict.militaryNeutral;
        sub.style.color = 'var(--text-muted)';
      }"""
new_updateui_military = """      document.getElementById('fortressVal').textContent = state.military;
      const dict = I18N[state.lang] || I18N.pt;
      const sub = document.getElementById('fortressSubtext');
      sub.textContent = `${state.military}/7 Fortalezas`;
      sub.style.color = state.military >= 6 ? 'var(--red)' : 'var(--text-muted)';"""
html = html.replace(old_updateui_military, new_updateui_military)

# 3. Restructure UI
old_buttons = """<!-- Bot References and Dice -->
        <div class="action-row" style="gap: 6px; margin-bottom: 8px;">
          <button class="btn-secondary" onclick="rollDie()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnRollDie">🎲 Rolar Dado</button>
          <button class="btn-secondary" onclick="openLandmarksModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnLandmarks">🏛️ Landmarks</button>
          <button class="btn-secondary" onclick="openRingTokensModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnRingTokens">💍 Trilha/Fichas</button>
        </div>"""
html = html.replace(old_buttons, "")

html = html.replace("""<div id="diceResult" style="display:none; background:var(--surface-3); border:2px solid var(--accent); padding:16px; border-radius:var(--radius); text-align:center; font-size:1.5rem; font-weight:800; font-family:var(--font-display); animation:modalPop 0.2s; margin-bottom:12px;">
          Resultado: <span id="diceNumber" style="color:var(--accent); font-size:2rem;"></span>
        </div>""", "")

landmark_panel = """
        <!-- Landmarks Panel (Always visible check before flip) -->
        <div style="background:var(--surface-2); border:1px solid var(--accent); border-radius:8px; padding:12px; margin-bottom:16px;">
          <h3 style="margin-bottom:8px; color:var(--accent); font-size:1rem; display:flex; justify-content:space-between; align-items:center;">
            <span>🏛️ Landmarks (Checar Antes!)</span>
            <span id="landmarkCostBadge" style="background:var(--bg); padding:2px 8px; border-radius:12px; font-size:0.8rem;">Custo: ?</span>
          </h3>
          <p style="font-size:0.8rem; margin-bottom:10px; line-height:1.4;">
            Se o Bot tiver as moedas necessárias, ele <strong>DEVE</strong> comprar UMA Landmark. Prioriza a que der Vitória Imediata, senão rola o dado (1d6) para escolher.
          </p>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" onclick="botBuyLandmark()" style="flex:1; background:var(--accent); color:var(--bg); border:none; padding:8px; font-weight:bold;">✅ Bot Comprou Landmark</button>
            <button class="btn-secondary" onclick="rollDiceBox('landmark')" style="flex:1; padding:8px;">🎲 Sortear (1d6)</button>
          </div>
          
          <details style="margin-top:10px; font-size:0.8rem;">
            <summary>Ver lista de efeitos das Landmarks</summary>
            <ul style="padding-left:18px; margin-top:6px; color:var(--text-muted);">
              <li><strong>Barad-Dur:</strong> Fortaleza em Mordor. Revela Decisão e joga do Descarte.</li>
              <li><strong>Bree:</strong> Fortaleza + 2 Unidades em Arnor.</li>
              <li><strong>Erebor:</strong> Fortaleza em Rhovanion. Ganha 5 Moedas. Resolve 1 Unidade.</li>
              <li><strong>Grey Havens:</strong> Fortaleza em Lindon. Rola dado p/ pegar 1 ficha de Raça (só Ents/Wizards no cap. 3).</li>
              <li><strong>Helm's Deep:</strong> Fortaleza + 3 Unidades em Rohan.</li>
              <li><strong>Isengard:</strong> Fortaleza em Enedwaith. Descarta carta Cinza do jogador. Move Anel 1 espaço.</li>
              <li><strong>Minas Tirith:</strong> Fortaleza + 1 Unidade em Gondor. Move Anel 2 espaços.</li>
            </ul>
          </details>
        </div>
"""
html = html.replace("<!-- Fallback Scan Direction -->", landmark_panel + "\n        <!-- Fallback Scan Direction -->")

trilha_panel = """
        <!-- Trilha/Fichas Panel (Always visible below card) -->
        <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:8px; padding:12px; margin-top:16px;">
          <h3 style="margin-bottom:8px; font-size:0.95rem;">💍 Trilha do Anel & Fichas</h3>
          <p style="font-size:0.8rem; line-height:1.4; color:var(--text-muted); margin-bottom:8px;">
            <strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).
          </p>
          <div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);">🎲 Sorteio de Raça:</strong>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" onclick="rollDiceBox('race2')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 2 iguais (1d2)</button>
              <button class="btn-secondary" onclick="rollDiceBox('race3')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 3 difer. (1d3)</button>
            </div>
            <div id="inlineDiceResult" style="margin-top:8px; font-weight:bold; color:var(--accent); text-align:center;"></div>
          </div>
        </div>
"""
old_action_controls = """        <!-- Action Controls -->
        <div class="action-row" id="flipBtn" style="margin-top: 15px;">"""
html = html.replace(old_action_controls, trilha_panel + "\n        " + old_action_controls)

dice_container = """  <!-- Dice Box Container -->
  <div id="dice-box" style="position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; pointer-events:none; display:none;"></div>\n"""
html = html.replace("<body>", "<body>\n" + dice_container)

dice_js = """
    let diceBox;
    let diceInitialized = false;
    let currentDiceResolve = null;

    async function initDiceBox() {
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
    }
    
    window.addEventListener('DOMContentLoaded', initDiceBox);

    async function rollDiceBox(reason) {
      if (!diceInitialized) await initDiceBox();
      
      const lColor = LEADERS[state.selectedLeader]?.cardColor;
      let hex = '#475569';
      if (lColor === 'green') hex = '#16a34a';
      else if (lColor === 'blue') hex = '#3b82f6';
      else if (lColor === 'yellow') hex = '#eab308';
      else if (lColor === 'redpurple') hex = '#a855f7';
      else if (lColor === 'grey') hex = '#64748b';
      diceBox.updateConfig({ themeColor: hex });

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
      };
    }

    function botBuyLandmark() {
      let cost = 7;
      if (state.currentAge === '2') cost = 5;
      if (state.currentAge === '3') cost = 2;
      cost += state.military;
      
      if (state.leaderVp < cost) {
        alert("O Líder não tem moedas suficientes! (Tem " + state.leaderVp + " / Custa " + cost + ")");
        return;
      }
      
      adjustCoins(-cost);
      adjustFortress(1);
      addLog({ type: 'generic', text: `🏛️ Líder comprou uma Landmark por ${cost} moedas!` });
    }
"""

html = html.replace("function addLog(msg) {", dice_js + "\n\n    function addLog(msg) {")

# Clean old modals
html = re.sub(r'<!-- Landmarks Modal -->.*?<!-- Ring/Tokens Modal -->.*?</div>\s*</div>', '', html, flags=re.DOTALL)
html = re.sub(r'function rollDraftToken\(\) \{.*?function rollDie\(\) \{.*?\}, 50\);\s*\}', '', html, flags=re.DOTALL)

# Clean obsolete button reference
html = html.replace("""<button onclick="rollDraftToken()" style="background:var(--accent); color:var(--bg); border:none; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.75rem; cursor:pointer;" data-i18n="btnDraftToken">🎲 Sortear Ficha</button>""", "")


# Update Landmark Cost dynamically
cost_update = """
      const chapVal = document.getElementById('chapterVal');
      if (chapVal) {
        chapVal.textContent = state.currentAge;
      }
      
      const costBadge = document.getElementById('landmarkCostBadge');
      if (costBadge) {
        let cost = 7;
        if (state.currentAge === '2') cost = 5;
        if (state.currentAge === '3') cost = 2;
        cost += state.military;
        costBadge.textContent = `Custo: ${cost} moedas`;
        costBadge.style.color = state.leaderVp >= cost ? 'var(--green)' : 'var(--text-muted)';
      }
"""
html = html.replace("const chapVal = document.getElementById('chapterVal');\n      if (chapVal) {\n        chapVal.textContent = state.currentAge;\n      }", cost_update)

html = html.replace("function addLog(msg) {\n      state.logs.unshift(msg);", """function addLog(msg) {\n      if (msg.type === 'generic') { state.logs.unshift(msg); if (state.logs.length > 25) state.logs.pop(); renderLogs(); return; }\n      state.logs.unshift(msg);""")
log_render = """if (log.type === 'generic') {
            text = log.text;
          } else if (log.type === 'flipped') {"""
html = html.replace("if (log.type === 'flipped') {", log_render)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
print("Fixes applied.")
