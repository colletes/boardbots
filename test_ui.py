import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Replace the panel HTML
old_panel = """        <!-- Science / Race Panel -->
        <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
          <h3 style="margin-bottom:12px; color:var(--text); font-size:1rem; display:flex; justify-content:space-between; align-items:center;">
            <span data-i18n="panelScienceTitle">Símbolos de Raça</span>
            <span id="scienceCountBadge" style="background:var(--bg); padding:2px 8px; border-radius:12px; font-size:0.8rem;">0 / 6</span>
          </h3>
          <div class="science-grid" id="scienceChips">
            <!-- Dynamic tokens -->
          </div>
          <div id="supremacyAlert" class="supremacy-alert" style="display:none; margin-top:12px;" data-i18n="alertSupremacy">
            🏆 O Bot venceu por Apoio das Raças! (6 símbolos diferentes)
          </div>
          <div id="activeRaceEffects" style="margin-top:12px; font-size:0.85rem; color:var(--text); background:var(--bg); padding:8px; border-radius:4px; display:none;">
            <!-- Active rules shown here -->
          </div>
        </div>"""

new_panel = """        <!-- Supremacy Symbols Panel -->
        <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
          <h3 style="margin-bottom:8px; color:var(--text); font-size:1rem; display:flex; justify-content:space-between; align-items:center;">
            <span data-i18n="panelSupremacyTitle">Supremacia (Símbolos)</span>
            <span id="scienceCountBadge" style="background:var(--bg); padding:2px 8px; border-radius:12px; font-size:0.8rem;">0 / 6</span>
          </h3>
          <p style="font-size:0.8rem; margin-bottom:12px; color:var(--text-dim);" data-i18n="panelSupremacyDesc">Marque os símbolos de raça presentes nas cartas verdes do bot.</p>
          <div class="science-grid" id="scienceChips">
            <!-- Dynamic tokens (now 7 including Eagles) -->
          </div>
          <div id="supremacyAlert" class="supremacy-alert" style="display:none; margin-top:12px;" data-i18n="alertSupremacy">
            🏆 O Bot venceu por Apoio das Raças! (6 símbolos diferentes)
          </div>
        </div>

        <!-- Alliance Tokens Reference Guide -->
        <div style="background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:12px; margin-bottom:16px;">
          <h3 style="margin-bottom:8px; color:var(--text); font-size:1rem;">
            <span data-i18n="panelAllianceTitle">Fichas de Aliança (Lembretes)</span>
          </h3>
          <p style="font-size:0.8rem; margin-bottom:12px; color:var(--text-dim);" data-i18n="panelAllianceDesc">Clique em uma Ficha para ver suas regras passivas.</p>
          <div class="science-grid" id="allianceButtons">
            <!-- Dynamic accordion buttons -->
          </div>
          <div id="allianceEffectDetails" style="margin-top:12px; font-size:0.85rem; color:var(--text); background:var(--bg); padding:10px; border-radius:6px; display:none;">
            <!-- Details shown here -->
          </div>
        </div>"""

html = html.replace(old_panel, new_panel)
with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
