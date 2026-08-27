import re

with open('.agents/skills/boardbot-creator/SKILL.md', 'r', encoding='utf-8') as f:
    content = f.read()

log_rule = """
7. **Painel de Histórico (Log):**
   É OBRIGATÓRIO incluir um painel de histórico de ações (log) na tela do jogo. O log deve registrar todas as ações e decisões do bot, para que o jogador possa auditar o que aconteceu caso clique rápido demais. O HTML deve conter um container (ex: `<div id="logPanel" class="log-panel"></div>`) e o JS deve alimentar esse painel com mensagens descritivas a cada jogada.
"""

# Insert right after item 6 in section 4
content = re.sub(r'(6\. \*\*Theming e Personalidade:\*\*\n.*?PERGUNTE AO USUÁRIO\*\* antes de prosseguir\.)', r'\1\n' + log_rule.strip(), content, flags=re.DOTALL)

with open('.agents/skills/boardbot-creator/SKILL.md', 'w', encoding='utf-8') as f:
    f.write(content)
