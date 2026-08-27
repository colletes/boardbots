import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Add to EN dict
html = html.replace("raceRight: '3rd Token (Right)',", "raceRight: '3rd Token (Right)',\n        logBuyLandmark: '🏛️ Leader bought a Landmark for {cost} coins!',")

# Add to PT dict
html = html.replace("raceRight: '3ª Ficha (Direita)',", "raceRight: '3ª Ficha (Direita)',\n        logBuyLandmark: '🏛️ Líder comprou uma Landmark por {cost} moedas!',")

# Replace in botBuyLandmark
html = html.replace("addLog({ type: 'generic', text: `🏛️ Líder comprou uma Landmark por ${cost} moedas!` });", "addLog({ type: 'generic', text: (I18N[state.lang] || I18N.pt).logBuyLandmark.replace('{cost}', cost) });")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
