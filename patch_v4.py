import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix resetGame bug
content = content.replace("tableau = { yellow:[], blue:[], white:[], green:[], red:[] };", "expeditions = { yellow:[], blue:[], white:[], green:[], red:[] };")

# 2. Add CSS
css = """
.wanted-panel {
    background: var(--panel-bg);
    border: 1px solid rgba(217,154,56,0.2);
    border-radius: 12px;
    padding: 16px;
    margin: 20px auto 0;
    max-width: 600px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.wanted-panel p { margin: 0 0 10px 0; font-size: 0.9em; color: var(--text-muted); }
.wanted-panel strong { color: var(--accent); }
.wanted-badges { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.wanted-badge {
    padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 0.9em;
    color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.wanted-badge.c-yellow { background: var(--c-yellow); color: #000; text-shadow: none; }
.wanted-badge.c-blue { background: var(--c-blue); }
.wanted-badge.c-white { background: var(--c-white); color: #000; text-shadow: none; }
.wanted-badge.c-green { background: var(--c-green); }
.wanted-badge.c-red { background: var(--c-red); }
"""
content = content.replace("</style>", css + "\n</style>")

# 3. HTML Panel
html = """
    <div id="wantedPanel" class="wanted-panel">
        <p data-i18n-html="wantedPanelText">O Automa compra do <strong>BARALHO</strong>, exceto se alguma destas cartas estiver no <strong>DESCARTE</strong>:</p>
        <div id="wantedBadges" class="wanted-badges"></div>
    </div>
"""
content = content.replace('<!-- Rendered via JS -->\n  </div>', '<!-- Rendered via JS -->\n  </div>\n' + html)

# 4. Inject call to updateWantedCards
content = content.replace("document.getElementById('totalScoreText').innerText = totalScore;", "document.getElementById('totalScoreText').innerText = totalScore;\n  if (typeof updateWantedCards === 'function') updateWantedCards();")

# 5. JS Function
js = """
function updateWantedCards() {
  const badgesContainer = document.getElementById('wantedBadges');
  if (!badgesContainer) return;
  badgesContainer.innerHTML = '';
  
  const colorNames = { yellow: '🟨', blue: '🟦', white: '⬜', green: '🟩', red: '🟥' };
  let hasWanted = false;
  
  COLORS.forEach(c => {
      const arr = expeditions[c];
      let wanted = null;
      if (arr.length === 0) {
          wanted = '🤝, 2';
      } else {
          const last = arr[arr.length - 1];
          if (last === 'H') {
              if (arr.length < 3) wanted = '🤝, 2';
              else wanted = '2';
          } else {
              if (last < 10) wanted = (last + 1).toString();
          }
      }
      if (wanted) {
          badgesContainer.innerHTML += `<div class="wanted-badge c-${c}">${colorNames[c]} ${wanted}</div>`;
          hasWanted = true;
      }
  });
  
  if (!hasWanted) {
      badgesContainer.innerHTML = `<div class="wanted-badge" style="background:#555; color:#fff;" data-i18n="wantedNone">Nenhuma (Sempre baralho)</div>`;
      if (typeof applyI18n === 'function') {
          // manually run translation for this injected node
          const lang = localStorage.getItem('boardbots_lang') || 'pt';
          if (I18N[lang] && I18N[lang].wantedNone) {
              badgesContainer.querySelector('[data-i18n="wantedNone"]').innerText = I18N[lang].wantedNone;
          }
      }
  }
}
"""
content = content.replace("function applyI18n()", js + "\nfunction applyI18n()")

# 6. I18N Dictionary Update
# Use a very specific regex to prepend inside Object.assign(I18N.pt, {
pt_addition = '\n    wantedPanelText: "O Automa compra do <strong>BARALHO</strong>, exceto se alguma destas cartas estiver no <strong>DESCARTE</strong>:",\n    wantedNone: "Nenhuma (Sempre baralho)",'
en_addition = '\n    wantedPanelText: "The Automa draws from the <strong>DECK</strong>, unless one of these cards is in the <strong>DISCARD</strong> pile:",\n    wantedNone: "None (Always deck)",'

content = re.sub(r'(Object\.assign\(I18N\.pt, \{)', r'\1' + pt_addition, content)
content = re.sub(r'(Object\.assign\(I18N\.en, \{)', r'\1' + en_addition, content)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

