import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace scoreDisplay logic
content = re.sub(
    r"document\.getElementById\('scoreDisplay'\)\.innerText = totalScore;\n\}",
    "document.getElementById('scoreDisplay').innerText = totalScore;\n  if (typeof updateWantedCards === 'function') updateWantedCards();\n}",
    content
)

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
      // Call standard translation function if elements were injected
  }
}
"""

content = content.replace("function applyI18n()", func + "\nfunction applyI18n()")

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

