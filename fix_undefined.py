import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_logic = """        const stars = '★'.repeat(leader.difficulty) + '☆'.repeat(5 - leader.difficulty);
        const colorName = isPt ? leader.colorNamePt : leader.colorNameEn;
        const tokens = isPt ? leader.tokensPt : leader.tokensEn;
        const flavor = isPt ? leader.flavorPt : leader.flavorEn;

        opt.innerHTML = `
          <img src="${leader.thumb}" alt="${leader.name}" class="leader-thumb">
          <div class="leader-info">
            <div class="leader-name-row">
              <span class="leader-name">${leader.name}</span>
              <span class="leader-stars" title="Dificuldade ${leader.difficulty}/5">${stars}</span>
            </div>
            <div class="leader-meta">
              <span class="tag tag-${leader.cardColor}">🎴 ${colorName}</span>
              <span>•</span>
              <span>🏅 ${tokens}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${flavor}</span>"""

new_logic = """        const stars = '★'.repeat(leader.difficulty) + '☆'.repeat(5 - leader.difficulty);
        const colorName = isPt ? leader.colorNamePt : leader.colorNameEn;
        const power = isPt ? leader.powerPt : leader.powerEn;

        opt.innerHTML = `
          <img src="${leader.thumb}" alt="${leader.name}" class="leader-thumb">
          <div class="leader-info" style="gap:4px;">
            <div class="leader-name-row">
              <span class="leader-name">${leader.name}</span>
              <span class="leader-stars" title="Dificuldade ${leader.difficulty}/5">${stars}</span>
            </div>
            <div class="leader-meta">
              <span class="tag tag-${leader.cardColor}">🎴 ${colorName}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; line-height: 1.2;">⚡ ${power}</span>"""

html = html.replace(old_logic, new_logic)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
