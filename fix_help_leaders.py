import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Update HTML in the Help Modal
old_help_details = """      <details>
        <summary data-i18n="helpLeadersSummaryTitle">👑 Resumo dos Líderes</summary>
        <div class="setup-desc" data-i18n-html="helpLeadersSummaryDesc">
          <p><strong>César (⭐):</strong> Começa com Estratégia (+1 escudo). Cor: Roxo.</p>
          <p><strong>Aristóteles (⭐⭐⭐):</strong> Começa com Lei e Matemática. Cor: Cinza.</p>
          <p><strong>Hamurabi (⭐⭐):</strong> Começa com Economia. +5 PV no final do jogo. Cor: Amarelo.</p>
        </div>
      </details>"""

new_help_details = """      <details>
        <summary data-i18n="helpLeadersSummaryTitle">👑 Resumo dos Líderes</summary>
        <div class="setup-desc leader-grid" id="helpLeadersContainer" style="margin-top:12px; gap:8px;">
          <!-- Injected dynamically by renderHelpLeaders() -->
        </div>
      </details>"""

html = html.replace(old_help_details, new_help_details)

# 2. Strip from I18N
html = re.sub(r"helpLeadersSummaryDesc: '.*?<p><strong>Gandalf:</strong>.*?</p>',", "", html)

# 3. Add JS function
js_function = """
    function renderHelpLeaders() {
      const container = document.getElementById('helpLeadersContainer');
      if (!container) return;
      container.innerHTML = '';
      const isPt = state.lang === 'pt';

      Object.entries(LEADERS).forEach(([key, leader]) => {
        const opt = document.createElement('div');
        opt.className = 'leader-option';
        opt.style.cursor = 'default';
        opt.style.opacity = '1';

        const colorName = isPt ? leader.colorNamePt : leader.colorNameEn;
        const power = isPt ? leader.powerPt : leader.powerEn;

        opt.innerHTML = `
          <img src="${leader.thumb}" alt="${leader.name}" class="leader-thumb">
          <div class="leader-info" style="gap:4px;">
            <div class="leader-name-row">
              <span class="leader-name" style="width: 100%;">${leader.name}</span>
            </div>
            <div class="leader-meta">
              <span class="tag tag-${leader.cardColor}">🎴 ${colorName}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; line-height: 1.2;">⚡ ${power}</span>
          </div>
        `;
        container.appendChild(opt);
      });
    }
"""

# Insert JS function below renderLeaderGrid()
html = html.replace("    function renderLeaderGrid() {", js_function + "\n    function renderLeaderGrid() {")

# Call renderHelpLeaders() inside applyI18n()
# We should also call it in init() if needed, but applyI18n is called during init and language switch.
html = html.replace("document.querySelectorAll('[data-i18n]').forEach", "renderHelpLeaders();\n      document.querySelectorAll('[data-i18n]').forEach")


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
