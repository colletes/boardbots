import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Update English Dictionary
en_extra = """        tieText: '⚖️ Tie in Victory Points! The player with the most VPs on Blue cards wins.',
        panelLandmarksTitle: '🏛️ Landmarks (Check Before!)',
        panelLandmarksCost: 'Cost: ?',
        panelLandmarksDesc: 'If the Bot has enough coins, it <strong>MUST</strong> buy ONE Landmark. It prioritizes the one that grants Immediate Victory, otherwise rolls the die (1d6) to choose.',
        panelLandmarksBtnBuy: '✅ Bot Bought Landmark',
        panelLandmarksBtnRoll: '🎲 Roll Die (1d6)',
        panelLandmarksDetails: 'View Landmark effects list',
        panelLandmarksEffects: '<li><strong>Barad-Dur:</strong> Fortress in Mordor. Reveal Decision and play from Discard.</li><li><strong>Bree:</strong> Fortress + 2 Units in Arnor.</li><li><strong>Erebor:</strong> Fortress in Rhovanion. Gain 5 Coins. Resolve 1 Unit.</li><li><strong>Grey Havens:</strong> Fortress in Lindon. Roll die to take 1 Race token (only Ents/Wizards in chap 3).</li><li><strong>Helm\\'s Deep:</strong> Fortress + 3 Units in Rohan.</li><li><strong>Isengard:</strong> Fortress in Enedwaith. Discard player\\'s Grey card. Move Ring 1 space.</li><li><strong>Minas Tirith:</strong> Fortress + 1 Unit in Gondor. Move Ring 2 spaces.</li>',
        panelRingTokensTitle: '💍 Quest of the Ring & Tokens',
        panelRingTokensEffects: '<strong>Ring Effects:</strong> 1 Coin | ↺ (no extra turn if symbol active) | 1 Unit | ❌ Destroy Fortress (in region w/o player units).',
        panelRingTokensDraftTitle: '🎲 PHYSICAL Race Token Draft:',
        panelRingTokensDraftDesc: 'When the Bot forms an alliance, use the buttons below to draft which Physical Token it takes from the board. <strong>The physical token\\'s power must be resolved by the player immediately or when applicable!</strong>',
        panelRingTokensBtn2: 'Draft from 2 identical (1d2)',
        panelRingTokensBtn3: 'Draft from 3 distinct (1d3)',
        logDiceLandmark: 'Rolled {val} to choose Landmark.',
        logDiceRace: 'Rolled {val} for Race Token: {res}.',
        diceResultLandmark: '🎲 Die: {val} (Choose corresponding Landmark)',
        diceResultRace: '🎲 Die: {val} -> Take the {res}',
        raceLeft: '1st Token (Left)',
        raceMiddle: '2nd Token (Middle)',
        raceRight: '3rd Token (Right)',"""
html = html.replace("        tieText: '⚖️ Tie in Victory Points! The player with the most VPs on Blue cards wins.',", en_extra)

# 2. Update Portuguese Dictionary
pt_extra = """        tieText: '⚖️ Empate nos Pontos de Vitória! Vence quem tiver mais Pts em Cartas Azuis.',
        panelLandmarksTitle: '🏛️ Landmarks (Checar Antes!)',
        panelLandmarksCost: 'Custo: ?',
        panelLandmarksDesc: 'Se o Bot tiver as moedas necessárias, ele <strong>DEVE</strong> comprar UMA Landmark. Prioriza a que der Vitória Imediata, senão rola o dado (1d6) para escolher.',
        panelLandmarksBtnBuy: '✅ Bot Comprou Landmark',
        panelLandmarksBtnRoll: '🎲 Sortear (1d6)',
        panelLandmarksDetails: 'Ver lista de efeitos das Landmarks',
        panelLandmarksEffects: '<li><strong>Barad-Dur:</strong> Fortaleza em Mordor. Revela Decisão e joga do Descarte.</li><li><strong>Bree:</strong> Fortaleza + 2 Unidades em Arnor.</li><li><strong>Erebor:</strong> Fortaleza em Rhovanion. Ganha 5 Moedas. Resolve 1 Unidade.</li><li><strong>Grey Havens:</strong> Fortaleza em Lindon. Rola dado p/ pegar 1 ficha de Raça (só Ents/Wizards no cap. 3).</li><li><strong>Helm\\'s Deep:</strong> Fortaleza + 3 Unidades em Rohan.</li><li><strong>Isengard:</strong> Fortaleza em Enedwaith. Descarta carta Cinza do jogador. Move Anel 1 espaço.</li><li><strong>Minas Tirith:</strong> Fortaleza + 1 Unidade em Gondor. Move Anel 2 espaços.</li>',
        panelRingTokensTitle: '💍 Trilha do Anel & Fichas',
        panelRingTokensEffects: '<strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).',
        panelRingTokensDraftTitle: '🎲 Sorteio de Fichas de Raça FÍSICAS:',
        panelRingTokensDraftDesc: 'Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong>',
        panelRingTokensBtn2: 'Sortear de 2 iguais (1d2)',
        panelRingTokensBtn3: 'Sortear de 3 difer. (1d3)',
        logDiceLandmark: 'Rolou {val} para escolher Landmark.',
        logDiceRace: 'Rolou {val} p/ Ficha de Raça: {res}.',
        diceResultLandmark: '🎲 Dado: {val} (Escolha a Landmark correspondente)',
        diceResultRace: '🎲 Dado: {val} -> Pegue a {res}',
        raceLeft: '1ª Ficha (Esquerda)',
        raceMiddle: '2ª Ficha (Meio)',
        raceRight: '3ª Ficha (Direita)',"""
html = html.replace("        tieText: '⚖️ Empate nos Pontos de Vitória! Vence quem tiver mais Pts em Cartas Azuis.',", pt_extra)

# 3. HTML Landmarks Replacement
old_landmarks_html = """            <span>🏛️ Landmarks (Checar Antes!)</span>
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
          </details>"""

new_landmarks_html = """            <span data-i18n="panelLandmarksTitle">🏛️ Landmarks (Checar Antes!)</span>
            <span id="landmarkCostBadge" style="background:var(--bg); padding:2px 8px; border-radius:12px; font-size:0.8rem;" data-i18n="panelLandmarksCost">Custo: ?</span>
          </h3>
          <p style="font-size:0.8rem; margin-bottom:10px; line-height:1.4;" data-i18n-html="panelLandmarksDesc">
            Se o Bot tiver as moedas necessárias, ele <strong>DEVE</strong> comprar UMA Landmark. Prioriza a que der Vitória Imediata, senão rola o dado (1d6) para escolher.
          </p>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" onclick="botBuyLandmark()" style="flex:1; background:var(--accent); color:var(--bg); border:none; padding:8px; font-weight:bold;" data-i18n="panelLandmarksBtnBuy">✅ Bot Comprou Landmark</button>
            <button id="btnRollLandmark" class="btn-secondary" onclick="rollDiceBox('landmark')" style="flex:1; padding:8px;" data-i18n="panelLandmarksBtnRoll">🎲 Sortear (1d6)</button>
          </div>
          
          <details style="margin-top:10px; font-size:0.8rem;">
            <summary data-i18n="panelLandmarksDetails">Ver lista de efeitos das Landmarks</summary>
            <ul style="padding-left:18px; margin-top:6px; color:var(--text-muted);" data-i18n-html="panelLandmarksEffects">
              <li><strong>Barad-Dur:</strong> Fortaleza em Mordor. Revela Decisão e joga do Descarte.</li>
              <li><strong>Bree:</strong> Fortaleza + 2 Unidades em Arnor.</li>
              <li><strong>Erebor:</strong> Fortaleza em Rhovanion. Ganha 5 Moedas. Resolve 1 Unidade.</li>
              <li><strong>Grey Havens:</strong> Fortaleza em Lindon. Rola dado p/ pegar 1 ficha de Raça (só Ents/Wizards no cap. 3).</li>
              <li><strong>Helm's Deep:</strong> Fortaleza + 3 Unidades em Rohan.</li>
              <li><strong>Isengard:</strong> Fortaleza em Enedwaith. Descarta carta Cinza do jogador. Move Anel 1 espaço.</li>
              <li><strong>Minas Tirith:</strong> Fortaleza + 1 Unidade em Gondor. Move Anel 2 espaços.</li>
            </ul>
          </details>"""
html = html.replace(old_landmarks_html, new_landmarks_html)


# 4. HTML Trilha Replacement
old_trilha_html = """          <h3 style="margin-bottom:8px; font-size:0.95rem;">💍 Trilha do Anel & Fichas</h3>
          <p style="font-size:0.8rem; line-height:1.4; color:var(--text-muted); margin-bottom:8px;">
            <strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).
          </p>
          <div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);">🎲 Sorteio de Fichas de Raça FÍSICAS:</strong>
            <p style="color:var(--text-muted); margin-bottom:8px;">Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong></p>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" onclick="rollDiceBox('race2')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 2 iguais (1d2)</button>
              <button class="btn-secondary" onclick="rollDiceBox('race3')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 3 difer. (1d3)</button>
            </div>"""

new_trilha_html = """          <h3 style="margin-bottom:8px; font-size:0.95rem;" data-i18n="panelRingTokensTitle">💍 Trilha do Anel & Fichas</h3>
          <p style="font-size:0.8rem; line-height:1.4; color:var(--text-muted); margin-bottom:8px;" data-i18n-html="panelRingTokensEffects">
            <strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).
          </p>
          <div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);" data-i18n="panelRingTokensDraftTitle">🎲 Sorteio de Fichas de Raça FÍSICAS:</strong>
            <p style="color:var(--text-muted); margin-bottom:8px;" data-i18n-html="panelRingTokensDraftDesc">Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong></p>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" onclick="rollDiceBox('race2')" style="flex:1; padding:6px; font-size:0.75rem;" data-i18n="panelRingTokensBtn2">Sortear de 2 iguais (1d2)</button>
              <button class="btn-secondary" onclick="rollDiceBox('race3')" style="flex:1; padding:6px; font-size:0.75rem;" data-i18n="panelRingTokensBtn3">Sortear de 3 difer. (1d3)</button>
            </div>"""
html = html.replace(old_trilha_html, new_trilha_html)

# 5. rollDiceBox JS logic Replacement
old_dice_logic = """      currentDiceResolve = (val) => {
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
      };"""

new_dice_logic = """      currentDiceResolve = (val) => {
        const el = document.getElementById('inlineDiceResult');
        const d = DICTIONARIES[state.lang];
        if (reason === 'landmark') {
          addLog({ type: 'generic', text: d.logDiceLandmark.replace('{val}', val) });
          el.textContent = d.diceResultLandmark.replace('{val}', val);
        } else if (reason === 'race2') {
          const res = val <= 3 ? d.raceLeft : d.raceRight;
          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          el.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        } else if (reason === 'race3') {
          let res = d.raceLeft;
          if (val >= 3 && val <= 4) res = d.raceMiddle;
          if (val >= 5) res = d.raceRight;
          addLog({ type: 'generic', text: d.logDiceRace.replace('{val}', val).replace('{res}', res) });
          el.textContent = d.diceResultRace.replace('{val}', val).replace('{res}', res);
        }
      };"""
html = html.replace(old_dice_logic, new_dice_logic)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
