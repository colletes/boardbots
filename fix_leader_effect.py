with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_text = """          <div class="active-leader-text">
            <h3 id="activeLeaderName">Líder</h3>
            <span id="activeLeaderDetails">Progresso • Cor</span>
          </div>"""

new_text = """          <div class="active-leader-text">
            <h3 id="activeLeaderName">Líder</h3>
            <span id="activeLeaderDetails">Progresso • Cor</span>
            <span id="activeLeaderEffect" style="color: var(--accent); font-size: 0.8rem; font-weight: bold; margin-top: 2px; display: block; line-height: 1.2;"></span>
          </div>"""

html = html.replace(old_text, new_text)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
