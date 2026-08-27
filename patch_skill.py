import re

with open('.agents/skills/boardbot-creator/SKILL.md', 'r', encoding='utf-8') as f:
    content = f.read()

ui_rules = """
## 4. UI/UX e Estrutura Comum (Padrão Boardbots)

O projeto Boardbots mantém um padrão visual rigoroso para garantir que todos os bots pareçam fazer parte do mesmo app.
Ao criar o HTML do bot, **você DEVE copiar e utilizar os seguintes elementos padrão** presentes nos bots mais recentes (ex: `stone_age_bot_v2.html` ou `lostcities.html`):

1. **Botões Flutuantes e Idioma (Início do body):**
   Inclua o botão de ajuda (`btn-help-float`), botão de reiniciar partida (`btn-reset-float`) e o seletor de idioma (`lang-switch`) fixos na tela.
2. **Footer (Fim do body):**
   Sempre inclua os créditos do autor (`.credits`), o botão Buy Me a Coffee (`.bmc-inline`) e o botão Home para voltar (`.btn-home`).
3. **Theming:**
   Use variáveis CSS (`--bg-color`, `--text-main`, `--accent`) mas personalize-as para combinar com a identidade visual do jogo de tabuleiro original (usando cores da arte da caixa, fontes temáticas se aplicável, etc).
"""

content = re.sub(r'## 4\. (.*?)\n(.*?)(?=\n## 5\.)', ui_rules, content, flags=re.DOTALL)

with open('.agents/skills/boardbot-creator/SKILL.md', 'w', encoding='utf-8') as f:
    f.write(content)

