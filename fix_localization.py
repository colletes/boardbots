with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix fortress label
old_fortress = '<span class="status-label" data-i18n="chapterLabel">Chapter</span>\\n          <div class="status-val" id="fortressVal">0</div>'
new_fortress = '<span class="status-label" data-i18n="militaryTrackerLabel">Fortalezas</span>\\n          <div class="status-val" id="fortressVal">0</div>'
# Need to use regex to be safe about whitespace
import re
html = re.sub(r'<span class="status-label" data-i18n="chapterLabel">Chapter</span>\s*<div class="status-val" id="fortressVal">0</div>', 
              r'<span class="status-label" data-i18n="militaryTrackerLabel">Fortalezas</span>\n          <div class="status-val" id="fortressVal">0</div>', html)

html = re.sub(r'<span class="status-label" data-i18n="coinsLabel">Coins</span>\s*<div class="status-val" id="coinsVal">0</div>', 
              r'<span class="status-label" data-i18n="leaderVpLabel">Moedas</span>\n          <div class="status-val" id="coinsVal">0</div>', html)

html = re.sub(r'<span class="status-label" data-i18n="chapterLabel">Chapter</span>\s*<div class="status-val" id="chapterVal"', 
              r'<span class="status-label" data-i18n="ageTrackerLabel">Capítulo</span>\n          <div class="status-val" id="chapterVal"', html)

# And one more thing: In my previous update I used `Fortalezas` statically in the subtext:
html = html.replace("sub.textContent = `${state.military}/7 Fortalezas`;", "sub.textContent = `${state.military}/7 ${dict.militaryTrackerLabel}`;")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
