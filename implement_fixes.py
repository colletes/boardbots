import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Remove ageTracker
# Looking for something like:
# <div class="stat-box" id="ageTrackerBox">
#   <span class="stat-label" data-i18n="ageTrackerLabel">Capítulo</span>
#   <span class="stat-value" id="ageVal">1</span>
# </div>
age_tracker_regex = re.compile(r'<div class="stat-box"[^>]*>\s*<span class="stat-label" data-i18n="ageTrackerLabel">.*?</span>\s*<span class="stat-value" id="ageVal">.*?</span>\s*</div>', re.DOTALL)
html = age_tracker_regex.sub("", html)
# Also remove from updateUI
html = html.replace("document.getElementById('ageVal').textContent = state.currentAge;", "")

# 2. Fix Leaders properties
old_leaders_regex = re.compile(r"const LEADERS = \{.*?\};", re.DOTALL)
new_leaders = """const LEADERS = {
      witchking: { name: 'Witch-king', cardColor: 'redpurple', colorNamePt: 'Vermelha / Roxa', colorNameEn: 'Red / Purple', thumb: '../assets/art/lotr_duel/leaders/witchking.webp', repeat: 'tree', powerPt: 'Joga 1 Unidade extra em Carta Vermelha.', powerEn: 'Places 1 additional Unit when playing Red card.' },
      galadriel: { name: 'Galadriel', cardColor: 'redpurple', colorNamePt: 'Vermelha / Roxa', colorNameEn: 'Red / Purple', thumb: '../assets/art/lotr_duel/leaders/galadriel.webp', repeat: 'tree', powerPt: 'Joga 1 Unidade extra em Carta Vermelha.', powerEn: 'Places 1 additional Unit when playing Red card.' },
      tombombadil: { name: 'Tom Bombadil', cardColor: 'grey', colorNamePt: 'Cinza', colorNameEn: 'Grey', thumb: '../assets/art/lotr_duel/leaders/tombombadil.webp', repeat: 'none', powerPt: 'Ganha 3 Moedas ao jogar carta com Encadeamento.', powerEn: 'Gains 3 Coins when playing a card with a chaining symbol.' },
      saruman: { name: 'Saruman', cardColor: 'green', colorNamePt: 'Verde', colorNameEn: 'Green', thumb: '../assets/art/lotr_duel/leaders/saruman.webp', repeat: 'eye', powerPt: 'Executa 2 Movimentos em Carta Verde.', powerEn: 'Executes 2 Unit movements when playing a Green card.' },
      elrond: { name: 'Elrond', cardColor: 'green', colorNamePt: 'Verde', colorNameEn: 'Green', thumb: '../assets/art/lotr_duel/leaders/elrond.webp', repeat: 'eye', powerPt: 'Executa 2 Movimentos em Carta Verde.', powerEn: 'Executes 2 Unit movements when playing a Green card.' },
      smaug: { name: 'Smaug', cardColor: 'yellow', colorNamePt: 'Amarela', colorNameEn: 'Yellow', thumb: '../assets/art/lotr_duel/leaders/smaug.webp', repeat: 'none', powerPt: 'Avança 1 espaço na Trilha do Anel em Carta Amarela.', powerEn: 'Advances 1 space on the Quest of the Ring track when playing a Yellow card.' },
      sauron: { name: 'Sauron', cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', thumb: '../assets/art/lotr_duel/leaders/sauron.webp', repeat: 'both', powerPt: 'Joga 1 Unidade em Carta Azul.', powerEn: 'Places 1 Unit when playing a Blue card.' },
      gandalf: { name: 'Gandalf', cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', thumb: '../assets/art/lotr_duel/leaders/gandalf.webp', repeat: 'both', powerPt: 'Joga 1 Unidade em Carta Azul.', powerEn: 'Places 1 Unit when playing a Blue card.' },
      eowynsstew: { name: "Eowyn's Stew", cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', thumb: '../assets/art/lotr_duel/leaders/eowynsstew.webp', repeat: 'both', powerPt: 'Unidade extra em Vermelha. 3 Moedas em Encadeamento.', powerEn: '1 extra Unit on Red card. 3 Coins on chained cards.' }
    };"""
html = old_leaders_regex.sub(new_leaders, html)

# 3. Remove difficulty stars from rendering logic
# We already removed leader.difficulty so it will break if we don't fix selectLeader HTML
old_select_leader = """        const stars = '★'.repeat(leader.difficulty) + '☆'.repeat(5 - leader.difficulty);
        const colorName = isPt ? leader.colorNamePt : leader.colorNameEn;
        const power = isPt ? leader.powerPt : leader.powerEn;

        opt.innerHTML = `
          <img src="${leader.thumb}" alt="${leader.name}" class="leader-thumb">
          <div class="leader-info" style="gap:4px;">
            <div class="leader-name-row">
              <span class="leader-name">${leader.name}</span>
              <span class="leader-stars" title="Dificuldade ${leader.difficulty}/5">${stars}</span>
            </div>"""

new_select_leader = """        const colorName = isPt ? leader.colorNamePt : leader.colorNameEn;
        const power = isPt ? leader.powerPt : leader.powerEn;

        opt.innerHTML = `
          <img src="${leader.thumb}" alt="${leader.name}" class="leader-thumb">
          <div class="leader-info" style="gap:4px;">
            <div class="leader-name-row">
              <span class="leader-name" style="width: 100%;">${leader.name}</span>
            </div>"""
html = html.replace(old_select_leader, new_select_leader)

# 4. CSS for colors
css_addition = """
    .tag-redpurple { background: linear-gradient(135deg, #ef4444, #a855f7); color: white; border:none; }
    .tag-green { background: #16a34a; color: white; border:none; }
    .tag-grey { background: #64748b; color: white; border:none; }
    .tag-yellow { background: #eab308; color: black; border:none; }
    .tag-blue { background: #3b82f6; color: white; border:none; }
    .tag-black { background: #1e293b; color: white; border:none; }
    .tag-brown { background: #78350f; color: white; border:none; }
"""
html = html.replace("</style>", css_addition + "</style>")

# 5. Add Token selection logic
# The user wants to click a button to roll dice for tokens. Let's add it next to the Science Tracker title.
old_tracker_title = """          <span data-i18n="scienceTrackerTitle">Fichas de Raça do Líder</span>
          <span id="scienceCountBadge" style="color:var(--accent); font-weight:800;">0 / 6</span>"""
new_tracker_title = """          <span data-i18n="scienceTrackerTitle">Fichas de Raça do Líder</span>
          <div>
            <button onclick="rollDraftToken()" style="background:var(--accent); color:var(--bg); border:none; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:0.75rem; cursor:pointer;">🎲 Sortear Ficha</button>
            <span id="scienceCountBadge" style="color:var(--accent); font-weight:800; margin-left:8px;">0 / 6</span>
          </div>"""
html = html.replace(old_tracker_title, new_tracker_title)

# Add Modal for rollDraftToken
draft_modal = """    <!-- Draft Token Modal -->
    <div class="modal-overlay" id="draftTokenModal" onclick="if(event.target===this) document.getElementById('draftTokenModal').classList.remove('open')">
      <div class="modal-box" style="text-align:center;">
        <div class="modal-header">
          <h2>🎲 Sorteio de Ficha de Raça</h2>
          <button class="close-btn" onclick="document.getElementById('draftTokenModal').classList.remove('open')">×</button>
        </div>
        <p style="margin-bottom:12px; font-size:0.9rem;">Quantos símbolos de Raça formaram a aliança?</p>
        <div style="display:flex; gap:10px; margin-bottom: 20px;">
          <button class="btn-primary" onclick="executeDraftRoll(2)" style="flex:1;">2 Símbolos Iguais</button>
          <button class="btn-primary" onclick="executeDraftRoll(3)" style="flex:1;">3 Símbolos Diferentes</button>
        </div>
        
        <div id="draftResultArea" style="display:none; background:var(--surface-3); border:2px solid var(--accent); padding:16px; border-radius:var(--radius); animation:modalPop 0.2s;">
          <div style="font-size:3rem; margin-bottom:8px;" id="draftDieResult">🎲</div>
          <h3 id="draftTextResult" style="color:var(--accent); margin-bottom:4px;">Pegue a ficha X</h3>
          <p id="draftSubtext" style="font-size:0.85rem; color:var(--text-muted);"></p>
        </div>
      </div>
    </div>"""

html = html.replace("<!-- Help Modal -->", draft_modal + "\n    <!-- Help Modal -->")

draft_js = """
    function rollDraftToken() {
      document.getElementById('draftResultArea').style.display = 'none';
      document.getElementById('draftTokenModal').classList.add('open');
    }
    function executeDraftRoll(type) {
      const resultArea = document.getElementById('draftResultArea');
      const dieEl = document.getElementById('draftDieResult');
      const textEl = document.getElementById('draftTextResult');
      const subEl = document.getElementById('draftSubtext');
      
      resultArea.style.display = 'block';
      let rolls = 0;
      const interval = setInterval(() => {
        const val = Math.floor(Math.random() * 6) + 1;
        dieEl.textContent = val;
        rolls++;
        if (rolls > 15) {
          clearInterval(interval);
          const finalVal = Math.floor(Math.random() * 6) + 1;
          dieEl.textContent = finalVal;
          if (type === 2) {
            // 1-3 Left, 4-6 Right
            textEl.textContent = finalVal <= 3 ? "Pegue a 1ª Ficha (Esquerda)" : "Pegue a 2ª Ficha (Direita)";
            subEl.textContent = "Revele as 2 fichas do topo do monte e pegue a indicada.";
          } else {
            // 1-2 Left, 3-4 Middle, 5-6 Right
            if (finalVal <= 2) textEl.textContent = "Pegue a 1ª Ficha (Esquerda)";
            else if (finalVal <= 4) textEl.textContent = "Pegue a 2ª Ficha (Meio)";
            else textEl.textContent = "Pegue a 3ª Ficha (Direita)";
            subEl.textContent = "Revele a 1ª ficha de cada um dos 3 montes e pegue a indicada.";
          }
        }
      }, 50);
    }
"""

html = html.replace("function rollDie()", draft_js + "\n    function rollDie()")


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)

print("Fixes applied successfully")
