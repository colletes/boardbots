import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_html = """      <div class="science-tracker">
        <div class="science-header">
          <span data-i18n="scienceTrackerTitle">Símbolos Científicos do Líder</span>
          <span id="scienceCountBadge" style="color:var(--accent); font-weight:800;">0 / 6</span>
        </div>
        <div class="science-chips" id="scienceChips">
          <!-- 6 symbols injected via JS -->
        </div>
        <div id="activeRaceEffects" class="fallback-info" style="display:none; margin-top:8px; text-align:left;"></div>
      </div>"""

new_html = """      <!-- Supremacy Symbols Panel -->
      <div class="science-tracker">
        <div class="science-header" style="flex-direction:column; align-items:flex-start; gap:4px;">
          <div style="display:flex; justify-content:space-between; width:100%;">
            <span data-i18n="panelSupremacyTitle">Supremacia (Símbolos)</span>
            <span id="scienceCountBadge" style="color:var(--accent); font-weight:800; background:var(--surface-2); padding:2px 8px; border-radius:12px; font-size:0.8rem;">0 / 6</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-dim); font-weight:normal;" data-i18n="panelSupremacyDesc">Marque os símbolos de raça presentes nas cartas do bot.</span>
        </div>
        <div class="science-chips" id="scienceChips" style="grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));">
          <!-- Dynamic tokens (now 7 including Eagles) -->
        </div>
        <div id="supremacyAlert" class="supremacy-alert" style="display:none; margin-top:12px; font-size:0.85rem;" data-i18n="alertSupremacy">
          🏆 O Bot venceu por Apoio das Raças! (6 símbolos diferentes)
        </div>
      </div>

      <!-- Alliance Tokens Reference Guide -->
      <div class="science-tracker" style="margin-top:16px;">
        <div class="science-header" style="flex-direction:column; align-items:flex-start; gap:4px;">
          <span data-i18n="panelAllianceTitle">Fichas de Aliança (Lembretes)</span>
          <span style="font-size:0.75rem; color:var(--text-dim); font-weight:normal;" data-i18n="panelAllianceDesc">Clique em uma Raça para ver suas regras passivas.</span>
        </div>
        <div class="science-chips" id="allianceButtons" style="grid-template-columns: repeat(3, 1fr);">
          <!-- Dynamic accordion buttons -->
        </div>
        <div id="allianceEffectDetails" class="fallback-info" style="display:none; margin-top:8px; text-align:left;">
          <!-- Details shown here -->
        </div>
      </div>"""

html = html.replace(old_html, new_html)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
