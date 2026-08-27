with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Add translations for buttons
pt_insert = """        gotItBtn: 'Entendido',
        btnRollDie: '🎲 Rolar Dado',
        btnLandmarks: '🏛️ Landmarks',
        btnRingTokens: '💍 Trilha/Fichas',
        btnDraftToken: '🎲 Sortear Ficha',"""
en_insert = """        gotItBtn: 'Got it',
        btnRollDie: '🎲 Roll Die',
        btnLandmarks: '🏛️ Landmarks',
        btnRingTokens: '💍 Ring/Tokens',
        btnDraftToken: '🎲 Draft Token',"""

html = html.replace("        gotItBtn: 'Entendido',", pt_insert)
html = html.replace("        gotItBtn: 'Got it',", en_insert)


# 2. Update button texts to use data-i18n
old_btns = """<button class="btn-secondary" onclick="rollDie()" style="flex: 1; padding: 10px; font-size: 0.9rem;">🎲 Rolar Dado</button>
          <button class="btn-secondary" onclick="openLandmarksModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;">🏛️ Landmarks</button>
          <button class="btn-secondary" onclick="openRingTokensModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;">💍 Trilha/Fichas</button>"""
new_btns = """<button class="btn-secondary" onclick="rollDie()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnRollDie">🎲 Rolar Dado</button>
          <button class="btn-secondary" onclick="openLandmarksModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnLandmarks">🏛️ Landmarks</button>
          <button class="btn-secondary" onclick="openRingTokensModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;" data-i18n="btnRingTokens">💍 Trilha/Fichas</button>"""
html = html.replace(old_btns, new_btns)

old_draft_btn = """<button onclick="rollDraftToken()" style="background:var(--accent); color:var(--bg); border:none; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.75rem; cursor:pointer;">🎲 Sortear Ficha</button>"""
new_draft_btn = """<button onclick="rollDraftToken()" style="background:var(--accent); color:var(--bg); border:none; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.75rem; cursor:pointer;" data-i18n="btnDraftToken">🎲 Sortear Ficha</button>"""
html = html.replace(old_draft_btn, new_draft_btn)


# 3. Inject Modals properly
modals_html = """  <!-- Landmarks Modal -->
  <div class="modal-overlay" id="landmarksModal" onclick="if(event.target===this) closeLandmarksModal()">
    <div class="modal-box">
      <div class="modal-header">
        <h2>🏛️ Landmarks</h2>
        <button class="close-btn" onclick="closeLandmarksModal()">✕</button>
      </div>
      <div class="setup-desc" style="text-align:left;">
        <p><strong>Regra de Compra:</strong> Antes de virar uma carta, se o Líder tiver moedas (Custo = 7/5/2 + Fortalezas), ele <strong>DEVE</strong> comprar UMA Landmark.</p>
        <ol style="padding-left:18px;">
          <li>Prioriza a Landmark que der Vitória por Conquista Imediata.</li>
          <li>Se não houver, <strong>Rola o dado</strong> para escolher qual comprar.</li>
        </ol>
        <p style="margin-top:10px; color:var(--accent);"><strong>Efeitos das Landmarks:</strong></p>
        <ul style="padding-left:18px; margin-top:6px;">
          <li><strong>Barad-Dur:</strong> Fortaleza em Mordor. Revela carta de Decisão e joga carta do Descarte.</li>
          <li><strong>Bree:</strong> Fortaleza e 2 Unidades em Arnor.</li>
          <li><strong>Erebor:</strong> Fortaleza em Rhovanion. Ganha 5 Moedas. Resolve 1 Unidade.</li>
          <li><strong>Grey Havens:</strong> Fortaleza em Lindon. Rola dado p/ pegar 1 ficha de Raça (só Ents/Wizards no cap. 3).</li>
          <li><strong>Helm's Deep:</strong> Fortaleza e 3 Unidades em Rohan.</li>
          <li><strong>Isengard:</strong> Fortaleza em Enedwaith. Descarta carta Cinza do jogador (menos ícones). Move Anel 1 espaço.</li>
          <li><strong>Minas Tirith:</strong> Fortaleza e 1 Unidade em Gondor. Move Anel 2 espaços.</li>
        </ul>
      </div>
      <button class="btn-secondary" onclick="closeLandmarksModal()" style="margin-top:12px;">Fechar</button>
    </div>
  </div>

  <!-- Ring/Tokens Modal -->
  <div class="modal-overlay" id="ringTokensModal" onclick="if(event.target===this) closeRingTokensModal()">
    <div class="modal-box">
      <div class="modal-header">
        <h2>💍 Efeitos da Trilha do Anel</h2>
        <button class="close-btn" onclick="closeRingTokensModal()">✕</button>
      </div>
      <div class="setup-desc" style="text-align:left;">
        <ul style="padding-left:18px;">
          <li><strong>1 Moeda:</strong> Pega 1 moeda da reserva.</li>
          <li><strong>Símbolo de Retorno:</strong> NÃO ganha turno extra se a carta já possuir símbolo repetido.</li>
          <li><strong>1 Unidade:</strong> Posiciona a unidade seguindo as prioridades de cartas vermelhas (escolhe entre todas as regiões).</li>
          <li><strong>Destruir Fortaleza:</strong> Remove fortaleza do jogador de uma região <strong>sem unidades do jogador</strong>. Role dado para desempate.</li>
        </ul>
      </div>
      <button class="btn-secondary" onclick="closeRingTokensModal()" style="margin-top:12px;">Fechar</button>
    </div>
  </div>
"""

# Insert right before the help modal
html = html.replace('<div class="modal-overlay" id="helpModal">', modals_html + '\n  <div class="modal-overlay" id="helpModal">')


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
