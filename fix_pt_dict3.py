import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix the translation keys
old_pt_keys = """        panelLandmarksDesc: 'O Bot sempre compra o Landmark no início de seu turno se possuir moedas (no cap. 1: 7 moedas, cap. 2: 5 moedas, cap. 3: 2 moedas) + 1 moeda por Fortaleza no tabuleiro. Ele prioriza comprar o que der vitória imediata. Se empatar, clique no botão para rolar o dado (1d6).',
        panelRingTokensDesc: 'Efeitos da Trilha: 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).',
        panelRingTokensSubtitle: 'Sorteio de Fichas de Raça FÍSICAS:'"""

new_pt_keys = """        panelLandmarksDesc: 'O Bot sempre compra o Landmark no início de seu turno se possuir moedas (no cap. 1: 7 moedas, cap. 2: 5 moedas, cap. 3: 2 moedas) + 1 moeda por Fortaleza no tabuleiro. Ele prioriza comprar o que der vitória imediata. Se empatar, clique no botão para rolar o dado (1d6).',
        panelRingTokensEffects: '<strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).',
        panelRingTokensDraftTitle: '🎲 Sorteio de Fichas de Raça FÍSICAS:'"""

html = html.replace(old_pt_keys, new_pt_keys)

# Fix the dice-box assetPath and origin
old_dice = """          assetPath: 'assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',"""
new_dice = """          assetPath: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/', origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',"""

html = html.replace(old_dice, new_dice)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
