import re
with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Remove the details tag containing setupWondersTitle from the DOM
html = re.sub(r"<details>\s*<summary data-i18n=\"setupWondersTitle\".*?</details>", "", html, flags=re.DOTALL)

# Update I18N definitions so they don't break, or just remove them
html = re.sub(r"\s*setupWondersTitle:.*?,\s*setupWondersDesc:.*?</p>',", "", html, flags=re.DOTALL)

# Fix Chapter strings in EN
html = html.replace("setupPyramidTitle: '🃏 Age I Card Structure'", "setupPyramidTitle: '🃏 Chapter 1 Card Structure'")
html = html.replace("Set up the Age I pyramid", "Set up the Chapter 1 structure")

# Fix Chapter strings in PT
html = html.replace("Monte a pirâmide da Chapter 1", "Monte a estrutura do Capítulo 1")
html = html.replace("setupPyramidTitle: '🃏 Estrutura de Cartas da Chapter 1'", "setupPyramidTitle: '🃏 Estrutura de Cartas do Capítulo 1'")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
