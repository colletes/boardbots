import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix resetGame bug
content = content.replace("tableau = { yellow:[], blue:[], white:[], green:[], red:[] };", "expeditions = { yellow:[], blue:[], white:[], green:[], red:[] };")

# 2. Add CSS for wanted cards
wanted_css = """
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
.wanted-panel p {
    margin: 0 0 10px 0;
    font-size: 0.9em;
    color: var(--text-muted);
}
.wanted-panel strong {
    color: var(--accent);
}
.wanted-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}
.wanted-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.9em;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.wanted-badge.c-yellow { background: var(--c-yellow); color: #000; text-shadow: none; }
.wanted-badge.c-blue { background: var(--c-blue); }
.wanted-badge.c-white { background: var(--c-white); color: #000; text-shadow: none; }
.wanted-badge.c-green { background: var(--c-green); }
.wanted-badge.c-red { background: var(--c-red); }
"""

content = content.replace("</style>", wanted_css + "\n</style>")

# 3. Add HTML container for wanted panel
# The game screen ends with: <div class="tableau"></div>
# So we inject it right after the tableau
wanted_html = """
    </div>
    
    <div id="wantedPanel" class="wanted-panel">
        <p data-i18n-html="wantedText">O Automa compra do <strong>BARALHO</strong>, exceto se alguma destas cartas estiver no <strong>DESCARTE</strong>:</p>
        <div id="wantedBadges" class="wanted-badges"></div>
    </div>
"""

content = content.replace('</div>\n\n</div>\n\n<!-- Help Modal -->', wanted_html + '\n</div>\n\n<!-- Help Modal -->')
# wait, let me use regex to make sure we inject after the tableau accurately
content = re.sub(r'(<div class="tableau">.*?</div>)', r'\1\n' + wanted_html.strip(), content, flags=re.DOTALL)

# 4. Add logic to renderTableau
render_logic = """
    });
    
    html += `</div></div>`;
    container.innerHTML += html;
  });
  
  document.getElementById('scoreDisplay').innerText = totalScore;
  updateWantedCards();
}

function updateWantedCards() {
  const badgesContainer = document.getElementById('wantedBadges');
  if (!badgesContainer) return;
  badgesContainer.innerHTML = '';
  
  const colorNames = { yellow: '🟨', blue: '🟦', white: '⬜', green: '🟩', red: '🟥' };
  
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
      }
  });
}
"""

content = re.sub(r'\}\);\s+html \+= `</div></div>`;\s+container\.innerHTML \+= html;\s+\}\);\s+document\.getElementById\(\'scoreDisplay\'\)\.innerText = totalScore;\s+\}', render_logic.strip() + '\n}', content, flags=re.DOTALL)

# 5. Add I18N
pt_wanted = '    wantedText: "O Automa compra do <strong>BARALHO</strong>, exceto se alguma destas cartas estiver no <strong>DESCARTE</strong>:",'
en_wanted = '    wantedText: "The Automa draws from the <strong>DECK</strong>, unless one of these cards is in the <strong>DISCARD</strong> pile:",'

content = content.replace('helpRulesTitle:', pt_wanted + '\n    helpRulesTitle:', 1)
content = re.sub(r'(en: \{.*?)(helpRulesTitle:)', r'\1' + en_wanted + r'\n    \2', content, flags=re.DOTALL)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

