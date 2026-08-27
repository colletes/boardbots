import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Add dice roller and reference buttons
old_actions = "<!-- Action Controls -->"
new_actions = """<!-- Bot References and Dice -->
        <div class="action-row" style="gap: 6px; margin-bottom: 8px;">
          <button class="btn-secondary" onclick="rollDie()" style="flex: 1; padding: 10px; font-size: 0.9rem;">🎲 Rolar Dado</button>
          <button class="btn-secondary" onclick="openLandmarksModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;">🏛️ Landmarks</button>
          <button class="btn-secondary" onclick="openRingTokensModal()" style="flex: 1; padding: 10px; font-size: 0.9rem;">💍 Trilha/Fichas</button>
        </div>
        
        <div id="diceResult" style="display:none; background:var(--surface-3); border:2px solid var(--accent); padding:16px; border-radius:var(--radius); text-align:center; font-size:1.5rem; font-weight:800; font-family:var(--font-display); animation:modalPop 0.2s; margin-bottom:12px;">
          Resultado: <span id="diceNumber" style="color:var(--accent); font-size:2rem;"></span>
        </div>
        
        <!-- Action Controls -->"""
html = html.replace(old_actions, new_actions)


# 2. Modals for Landmarks and Ring/Tokens
modals_html = """    <!-- Landmarks Modal -->
    <div class="modal-overlay" id="landmarksModal" onclick="if(event.target===this) closeLandmarksModal()">
      <div class="modal-box">
        <div class="modal-header">
          <h2>🏛️ Comprar Landmarks</h2>
          <button class="close-btn" onclick="closeLandmarksModal()">×</button>
        </div>
        <div class="setup-desc">
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
        <button class="btn-secondary" onclick="closeLandmarksModal()">Fechar</button>
      </div>
    </div>

    <!-- Ring/Tokens Modal -->
    <div class="modal-overlay" id="ringTokensModal" onclick="if(event.target===this) closeRingTokensModal()">
      <div class="modal-box">
        <div class="modal-header">
          <h2>💍 Efeitos da Trilha do Anel</h2>
          <button class="close-btn" onclick="closeRingTokensModal()">×</button>
        </div>
        <div class="setup-desc">
          <ul style="padding-left:18px;">
            <li><strong>1 Moeda:</strong> Pega 1 moeda da reserva.</li>
            <li><strong>Símbolo de Retorno:</strong> NÃO ganha turno extra se a carta já possuir símbolo repetido.</li>
            <li><strong>1 Unidade:</strong> Posiciona a unidade seguindo as prioridades de cartas vermelhas (escolhe entre todas as regiões).</li>
            <li><strong>Destruir Fortaleza:</strong> Remove fortaleza do jogador de uma região <strong>sem unidades do jogador</strong>. Role dado para desempate.</li>
          </ul>
          
          <h3 style="margin-top:16px; color:var(--accent); font-family:var(--font-display);">🎲 Seleção de Fichas de Raça (Símbolo Verde)</h3>
          <p>Quando o Automa precisa pegar uma ficha de Raça:</p>
          <ul style="padding-left:18px;">
            <li>Se tiver 2 símbolos iguais: Revela as 2 do monte correspondente e <strong>rola um dado</strong> para escolher.</li>
            <li>Se tiver 3 símbolos diferentes: Revela o topo dos 3 montes e <strong>rola um dado</strong> para escolher.</li>
          </ul>
        </div>
        <button class="btn-secondary" onclick="closeRingTokensModal()">Fechar</button>
      </div>
    </div>
"""

# Insert modals right before helpModal
html = html.replace('<!-- Help Modal -->', modals_html + '\n    <!-- Help Modal -->')

# 3. Add JS functions
js_functions = """
    function rollDie() {
      const resultBox = document.getElementById('diceResult');
      const numberEl = document.getElementById('diceNumber');
      resultBox.style.display = 'block';
      let rolls = 0;
      const interval = setInterval(() => {
        numberEl.textContent = Math.floor(Math.random() * 6) + 1;
        rolls++;
        if (rolls > 15) {
          clearInterval(interval);
          numberEl.textContent = Math.floor(Math.random() * 6) + 1;
        }
      }, 50);
    }

    function openLandmarksModal() { document.getElementById('landmarksModal').classList.add('open'); }
    function closeLandmarksModal() { document.getElementById('landmarksModal').classList.remove('open'); }
    function openRingTokensModal() { document.getElementById('ringTokensModal').classList.add('open'); }
    function closeRingTokensModal() { document.getElementById('ringTokensModal').classList.remove('open'); }
"""

html = html.replace('function openHelp()', js_functions + '\n    function openHelp()')


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)

print("Rules integration updated")

