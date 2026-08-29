import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject call to updateWantedCards()
content = content.replace("document.getElementById('scoreDisplay').innerText = totalScore;\n}", "document.getElementById('scoreDisplay').innerText = totalScore;\n  updateWantedCards();\n}")

# 2. Add the function definition
func = """
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
      applyI18n(); // Need to translate this dynamic string
  }
}
"""
content = content.replace("function applyI18n()", func + "\nfunction applyI18n()")

# 3. Fix the I18N injection which got messed up
# Right now we have pt_wanted and en_wanted both injected into I18N.pt block!
content = re.sub(r'wantedText.*?wantedNone: "None \(Always deck\)",\n', '', content, flags=re.DOTALL)

# Re-inject them properly
content = content.replace('helpRulesTitle: "Regras do Automa",', 'wantedText: "O Automa compra do <strong>BARALHO</strong>, exceto se alguma destas cartas estiver no <strong>DESCARTE</strong>:",\n    wantedNone: "Nenhuma (Sempre baralho)",\n    helpRulesTitle: "Regras do Automa",')
content = content.replace('helpRulesTitle: "Automa Rules",', 'wantedText: "The Automa draws from the <strong>DECK</strong>, unless one of these cards is in the <strong>DISCARD</strong> pile:",\n    wantedNone: "None (Always deck)",\n    helpRulesTitle: "Automa Rules",')


with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

