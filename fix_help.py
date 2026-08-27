with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_help = """        <div class="setup-desc" data-i18n-html="helpLeadersSummaryDesc">
          <p><strong>César (⭐):</strong> Começa com Estratégia (+1 escudo). Cor: Roxo.</p>
          <p><strong>Aristóteles (⭐⭐⭐):</strong> Começa com Lei e Matemática. Cor: Cinza.</p>
          <p><strong>Hamurabi (⭐⭐):</strong> Começa com Economia. +5 PV no final do jogo. Cor: Amarelo.</p>
          <p><strong>Bilkis (⭐⭐⭐⭐⭐):</strong> Começa com Economia. Cor: Marrom.</p>
        </div>"""

new_help = """        <div class="leader-grid" id="helpLeadersContainer" style="margin-top: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
          <!-- dynamically populated by renderHelpLeaders() -->
        </div>"""

html = html.replace(old_help, new_help)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
