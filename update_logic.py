import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Replace LEADERS
old_leaders_regex = re.compile(r"const LEADERS = \{.*?\};", re.DOTALL)
new_leaders = """const LEADERS = {
      witchking: { name: 'Witch-king', cardColor: 'purple', colorNamePt: 'Roxa', colorNameEn: 'Purple', difficulty: 3, thumb: '../assets/art/lotr_duel/leaders/witchking.webp', repeat: 'eye', powerPt: 'Joga 1 Unidade extra em Carta Vermelha.', powerEn: 'Places 1 additional Unit when playing Red card.' },
      galadriel: { name: 'Galadriel', cardColor: 'purple', colorNamePt: 'Roxa', colorNameEn: 'Purple', difficulty: 3, thumb: '../assets/art/lotr_duel/leaders/galadriel.webp', repeat: 'tree', powerPt: 'Joga 1 Unidade extra em Carta Vermelha.', powerEn: 'Places 1 additional Unit when playing Red card.' },
      tombombadil: { name: 'Tom Bombadil', cardColor: 'grey', colorNamePt: 'Cinza', colorNameEn: 'Grey', difficulty: 3, thumb: '../assets/art/lotr_duel/leaders/tombombadil.webp', repeat: 'none', powerPt: 'Ganha 3 Moedas ao jogar carta com Encadeamento.', powerEn: 'Gains 3 Coins when playing a card with a chaining symbol.' },
      saruman: { name: 'Saruman', cardColor: 'green', colorNamePt: 'Verde', colorNameEn: 'Green', difficulty: 4, thumb: '../assets/art/lotr_duel/leaders/saruman.webp', repeat: 'eye', powerPt: 'Executa 2 Movimentos em Carta Verde.', powerEn: 'Executes 2 Unit movements when playing a Green card.' },
      elrond: { name: 'Elrond', cardColor: 'green', colorNamePt: 'Verde', colorNameEn: 'Green', difficulty: 4, thumb: '../assets/art/lotr_duel/leaders/elrond.webp', repeat: 'tree', powerPt: 'Executa 2 Movimentos em Carta Verde.', powerEn: 'Executes 2 Unit movements when playing a Green card.' },
      smaug: { name: 'Smaug', cardColor: 'yellow', colorNamePt: 'Amarela', colorNameEn: 'Yellow', difficulty: 5, thumb: '../assets/art/lotr_duel/leaders/smaug.webp', repeat: 'none', powerPt: 'Avança 1 espaço na Trilha do Anel em Carta Amarela.', powerEn: 'Advances 1 space on the Quest of the Ring track when playing a Yellow card.' },
      sauron: { name: 'Sauron', cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', difficulty: 5, thumb: '../assets/art/lotr_duel/leaders/sauron.webp', repeat: 'eye', powerPt: 'Joga 1 Unidade em Carta Azul.', powerEn: 'Places 1 Unit when playing a Blue card.' },
      gandalf: { name: 'Gandalf', cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', difficulty: 5, thumb: '../assets/art/lotr_duel/leaders/gandalf.webp', repeat: 'both', powerPt: 'Joga 1 Unidade em Carta Azul.', powerEn: 'Places 1 Unit when playing a Blue card.' },
      eowynsstew: { name: "Eowyn's Stew", cardColor: 'blue', colorNamePt: 'Azul', colorNameEn: 'Blue', difficulty: 2, thumb: '../assets/art/lotr_duel/leaders/eowynsstew.webp', repeat: 'both', powerPt: 'Unidade extra em Vermelha. 3 Moedas em Encadeamento.', powerEn: '1 extra Unit on Red card. 3 Coins on chained cards.' }
    };"""
html = old_leaders_regex.sub(new_leaders, html)

# Replace DECISION_CARDS
old_dc_regex = re.compile(r"const DECISION_CARDS = \[.*?\];", re.DOTALL)
new_dc = """const DECISION_CARDS = [
      { id: 1,  priority: ['leader', 'bluered', 'green'], fallbackDir: 'right', repeat: 'tree' },
      { id: 2,  priority: ['red', 'bluegreen', 'leader'], fallbackDir: 'left',  repeat: 'eye' },
      { id: 3,  priority: ['bluered', 'green', 'leader'], fallbackDir: 'right', repeat: 'none' },
      { id: 4,  priority: ['bluegreen', 'red', 'leader'], fallbackDir: 'left',  repeat: 'none' },
      { id: 5,  priority: ['bluered', 'green', 'leader'], fallbackDir: 'right', repeat: 'none' },
      { id: 6,  priority: ['bluegreen', 'red', 'leader'], fallbackDir: 'left',  repeat: 'none' },
      { id: 7,  priority: ['bluegreen', 'red', 'leader'], fallbackDir: 'right', repeat: 'none' },
      { id: 8,  priority: ['bluered', 'green', 'leader'], fallbackDir: 'left',  repeat: 'none' },
      { id: 9,  priority: ['bluegreen', 'red', 'leader'], fallbackDir: 'right', repeat: 'none' },
      { id: 10, priority: ['bluered', 'green', 'leader'], fallbackDir: 'left',  repeat: 'none' },
      { id: 11, priority: ['bluegreen', 'red', 'leader'], fallbackDir: 'right', repeat: 'none' },
      { id: 12, priority: ['bluered', 'green', 'leader'], fallbackDir: 'left',  repeat: 'none' }
    ];"""
html = old_dc_regex.sub(new_dc, html)

# Update Priority Pills rendering to handle 'bluered' and 'bluegreen'
old_pill_logic = """        if (slot === 'green') colorName = dict.colorScience;
        else if (slot === 'red') colorName = dict.colorMilitary;
        else colorName = isPt ? leader.colorNamePt : leader.colorNameEn;"""
new_pill_logic = """        if (slot === 'green') colorName = isPt ? 'Verde' : 'Green';
        else if (slot === 'red') colorName = isPt ? 'Vermelha' : 'Red';
        else if (slot === 'bluered') colorName = isPt ? 'Azul / Vermelha' : 'Blue / Red';
        else if (slot === 'bluegreen') colorName = isPt ? 'Azul / Verde' : 'Blue / Green';
        else colorName = isPt ? leader.colorNamePt : leader.colorNameEn;"""
html = html.replace(old_pill_logic, new_pill_logic)

# Update extra turn logic
old_extra_turn = """      if (card.extraTurn) {
        extraTurnBadge.style.display = 'block';
        state.extraTurnPending = true;
      } else {
        extraTurnBadge.style.display = 'none';
        state.extraTurnPending = false;
      }"""
new_extra_turn = """      const lRepeat = leader.repeat;
      const cRepeat = card.repeat;
      let hasExtra = false;
      if (cRepeat !== 'none' && lRepeat !== 'none') {
        if (lRepeat === 'both' || cRepeat === lRepeat) {
          hasExtra = true;
        }
      }
      
      if (hasExtra) {
        extraTurnBadge.style.display = 'block';
        state.extraTurnPending = true;
      } else {
        extraTurnBadge.style.display = 'none';
        state.extraTurnPending = false;
      }"""
html = html.replace(old_extra_turn, new_extra_turn)


# Update Chapter counter name from Age
html = html.replace("ageTrackerLabel: 'Current Chapter',", "ageTrackerLabel: 'Chapter',")
html = html.replace("ageTrackerLabel: 'Capítulo Atual',", "ageTrackerLabel: 'Capítulo',")
html = html.replace("End of Age", "End of Chapter")
html = html.replace("Fim de Era", "Fim do Capítulo")
html = html.replace("Transição de Capítulo", "Transição de Capítulo")

# Add leader effect info into the UI (in showGameScreen or updateUI)
# Let's add it right below active-leader-identity
old_leader_html = """      <div class="active-leader-bar">
        <div class="active-leader-identity">
          <img id="activeLeaderImg" src="" alt="" class="active-leader-portrait">
          <div class="active-leader-text">
            <h3 id="activeLeaderName"></h3>
            <span id="activeLeaderDetails"></span>
          </div>
        </div>
      </div>"""
new_leader_html = """      <div class="active-leader-bar" style="flex-direction: column; align-items: flex-start; gap: 8px;">
        <div class="active-leader-identity" style="width: 100%;">
          <img id="activeLeaderImg" src="" alt="" class="active-leader-portrait">
          <div class="active-leader-text">
            <h3 id="activeLeaderName"></h3>
            <span id="activeLeaderDetails"></span>
          </div>
        </div>
        <div id="activeLeaderEffect" style="font-size: 0.8rem; color: var(--accent); background: var(--surface-2); padding: 8px 12px; border-radius: 6px; width: 100%; border: 1px solid var(--border);">
        </div>
      </div>"""
html = html.replace(old_leader_html, new_leader_html)

# Add logic to populate activeLeaderEffect
old_show_game_screen = """      document.getElementById('activeLeaderImg').src = leader.thumb;
      document.getElementById('activeLeaderName').textContent = leader.name;
      document.getElementById('activeLeaderDetails').textContent = `${isPt ? leader.colorNamePt : leader.colorNameEn} • 🏅 ${isPt ? leader.tokensPt : leader.tokensEn}`;"""
new_show_game_screen = """      document.getElementById('activeLeaderImg').src = leader.thumb;
      document.getElementById('activeLeaderName').textContent = leader.name;
      document.getElementById('activeLeaderDetails').textContent = `${isPt ? leader.colorNamePt : leader.colorNameEn}`;
      document.getElementById('activeLeaderEffect').textContent = `⚡ ${isPt ? leader.powerPt : leader.powerEn}`;"""
html = html.replace(old_show_game_screen, new_show_game_screen)


with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
