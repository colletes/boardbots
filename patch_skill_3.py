import re

with open('.agents/skills/boardbot-creator/SKILL.md', 'r', encoding='utf-8') as f:
    content = f.read()

ui_rules = """
## 4. UI/UX e Estrutura Comum (Padrão Boardbots)

O projeto Boardbots mantém um padrão visual rigoroso para garantir que todos os bots pareçam fazer parte do mesmo app.
Ao criar o HTML do bot, **você DEVE copiar e utilizar os seguintes elementos padrão** presentes nos bots mais recentes (ex: `stone_age_bot_v2.html`):

1. **Botões Flutuantes e Idioma (Início do body):**
   Inclua o botão de ajuda (`btn-help-float`), botão de reiniciar partida (`btn-reset-float`) e o seletor de idioma (`lang-switch`) fixos na tela.
2. **Hero Banner (Topo da página):**
   Sempre inclua uma div `.hero` contendo a imagem da caixa do jogo (`<img src="../assets/art/nome.webp">`). Ela deve ser estilizada para cortar (crop) e mostrar o título do jogo de forma legível.
3. **Footer (Fim do body):**
   Sempre inclua os créditos do autor (`.credits`), o botão Buy Me a Coffee (`.bmc-inline`) e o botão Home para voltar (`.btn-home`).
4. **Theming e Personalidade:**
   O bot não pode ter uma interface genérica! Use variáveis CSS (`--bg-color`, `--text-main`, `--accent`) e backgrounds temáticos para injetar a personalidade do jogo original. Se for um jogo de fantasia, use texturas de pergaminho/madeira; se for sci-fi, use painéis futuristas. Se a temática não puder ser inferida pelas regras ou pela arte da capa, **PERGUNTE AO USUÁRIO** antes de prosseguir.
"""

content = re.sub(r'## 4\. UI/UX.*?(?=\n## 4\.1)', ui_rules.strip(), content, flags=re.DOTALL)

with open('.agents/skills/boardbot-creator/SKILL.md', 'w', encoding='utf-8') as f:
    f.write(content)

