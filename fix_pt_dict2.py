import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_pt_end = """        resetConfirmPrompt: 'Tem certeza que deseja reiniciar a partida? O progresso atual será perdido.'
      },"""

new_pt_end = """        resetConfirmPrompt: 'Tem certeza que deseja reiniciar a partida? O progresso atual será perdido.',
        panelLandmarksTitle: '🏛️ Landmarks (Comprar)',
        panelRingTokensTitle: '💍 Trilha do Anel & Fichas',
        panelRingTokensDraftDesc: 'Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong>',
        panelRingTokensBtn2: 'Sortear de 2 iguais (1d2)',
        panelRingTokensBtn3: 'Sortear de 3 difer. (1d3)',
        logDiceLandmark: 'Rolou {val} para escolher Landmark.',
        logDiceRace: 'Rolou {val} para Ficha de Raça: {res}.',
        diceResultLandmark: '🎲 Dado: {val} (Pegue o Landmark correspondente)',
        diceResultRace: '🎲 Dado: {val} -> Pegue a {res}',
        raceLeft: '1ª Ficha (Esquerda)',
        raceMiddle: '2ª Ficha (Meio)',
        raceRight: '3ª Ficha (Direita)',
        logBuyLandmark: '🏛️ O Líder comprou um Landmark por {cost} moedas!',
        panelLandmarksDesc: 'O Bot sempre compra o Landmark no início de seu turno se possuir moedas (no cap. 1: 7 moedas, cap. 2: 5 moedas, cap. 3: 2 moedas) + 1 moeda por Fortaleza no tabuleiro. Ele prioriza comprar o que der vitória imediata. Se empatar, clique no botão para rolar o dado (1d6).',
        panelRingTokensDesc: 'Efeitos da Trilha: 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).',
        panelRingTokensSubtitle: 'Sorteio de Fichas de Raça FÍSICAS:'
      },"""

html = html.replace(old_pt_end, new_pt_end)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
