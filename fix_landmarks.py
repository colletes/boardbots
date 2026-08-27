import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

pt_how = """helpHowItWorksDesc: '<p><strong>ANTES de virar a carta:</strong> O Líder compra <strong>UMA</strong> Landmark se tiver moedas suficientes (Custo = 7/5/2 moedas no Capítulo 1/2/3, mais o número de Fortalezas dele). Ele prioriza a Landmark que der vitória imediata, senão rola o dado. Se ele comprar, o turno dele acaba (não vira carta).</p><p>Se não comprou, no turno do Líder:</p><ol style="padding-left:18px; margin-top:6px;"><li>Vire a Carta de Decisão do topo.</li><li>Observe a <strong>Ordem de Prioridade</strong>.</li><li>O Líder pega a <strong>primeira carta acessível</strong> na estrutura da cor prioritária, seguindo o sentido da seta.</li><li>Se nenhuma estiver acessível, pega a primeira disponível independente da cor, seguindo a seta.</li><li>O Líder <strong>nunca gasta moedas para pegar cartas</strong> e não usa Skills.</li></ol>','""";

en_how = """helpHowItWorksDesc: '<p><strong>BEFORE flipping a card:</strong> The Leader purchases <strong>ONE</strong> Landmark if they have enough coins (Cost = 7/5/2 coins in Chapter 1/2/3, plus their number of Fortresses). They prioritize a Landmark that grants instant victory, otherwise they roll the die. If they purchase one, their turn ends (do not flip a card).</p><p>If they didn\\'t purchase, on the Leader\\'s turn:</p><ol style="padding-left:18px; margin-top:6px;"><li>Flip the top Decision Card.</li><li>Check the <strong>Priority Order</strong>.</li><li>The Leader takes the <strong>first accessible card</strong> in the structure of that priority color, following the arrow direction.</li><li>If none are accessible, they take the first available card of any color following the arrow.</li><li>The Leader <strong>never spends coins</strong> to claim cards and ignores Skills.</li></ol>','""";

html = re.sub(r"helpHowItWorksDesc: '<p>No turno do Líder:</p>.*?</ol>',", pt_how, html)
html = re.sub(r"helpHowItWorksDesc: '<p>On the Leader.*?s turn:</p>.*?</ol>',", en_how, html)

# Also fix the initial setup. In LotR Duel, you don't place 5 progress tokens, because there are no progress tokens, there are Race tokens!
pt_board = """setupBoardDesc: '<ul><li>Coloque o peão no centro (posição 0) e as 4 Penalidades Militares.</li><li>Embaralhe as fichas de Raça e revele conforme as regras do jogo base.</li><li>Você começa com moedas do jogo base. O Líder começa com <strong>0 moedas</strong>.</li></ul>',"""
en_board = """setupBoardDesc: '<ul><li>Place the Conflict pawn in the center (position 0) and the 4 Military Penalties.</li><li>Shuffle the Race tokens and reveal them according to base game rules.</li><li>You start with standard coins. The Leader starts with <strong>0 coins</strong>.</li></ul>',"""

html = re.sub(r"setupBoardDesc: '<ul><li>Coloque o peão de Conflito Militar.*?</ol>',", pt_board, html) # Wait, it was </ul>',
html = re.sub(r"setupBoardDesc: '<ul><li>Coloque o peão de Conflito Militar.*?</ul>',", pt_board, html)
html = re.sub(r"setupBoardDesc: '<ul><li>Place the Conflict pawn.*?</ul>',", en_board, html)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
