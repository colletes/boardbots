with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# 1. Rename the section title from "Fichas de Raça" to "Símbolos de Raça (Cartas Verdes)"
html = html.replace("scienceTrackerTitle: 'Fichas de Raça do Líder',", "scienceTrackerTitle: 'Símbolos de Raça (Cartas Verdes)',")
html = html.replace("scienceTrackerTitle: 'Leader\\'s Race Tokens',", "scienceTrackerTitle: 'Race Symbols (Green Cards)',")

# 2. Add an explicit explanation about physical tokens in the Trilha/Fichas panel
old_trilha_panel = """<div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);">🎲 Sorteio de Raça:</strong>"""
new_trilha_panel = """<div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);">🎲 Sorteio de Fichas de Raça FÍSICAS:</strong>
            <p style="color:var(--text-muted); margin-bottom:8px;">Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong></p>"""
html = html.replace(old_trilha_panel, new_trilha_panel)

# 3. Modify the tooltips to clarify they are GREEN CARD effects, not token effects
old_science_types = """const SCIENCE_TYPES = [
      { id: 'elves',   icon: '🧝', namePt: 'Elfos', nameEn: 'Elves', tooltipPt: 'Sem turno extra em amarela duplicada. Ignora Skills. Coloca Unidades como carta Vermelha.', tooltipEn: 'No extra turn on yellow if card has symbol. Ignores skills. Places units like Red cards.' },
      { id: 'dwarves', icon: '⛏️', namePt: 'Anões', nameEn: 'Dwarves', tooltipPt: 'Ignora custo adicional de fortalezas em Landmarks. Movimenta como carta Roxa.', tooltipEn: 'Ignores extra Fortress cost for Landmarks. Moves like Purple cards.' },
      { id: 'hobbit',  icon: '💍', namePt: 'Hobbits', nameEn: 'Hobbits', tooltipPt: 'Ganha 3 moedas ao obter a ficha (sem encadeamento). Águia conta como raça extra.', tooltipEn: 'Gains 3 coins upon claiming token. Eagle symbol counts as extra race.' },
      { id: 'humans',  icon: '🐎', namePt: 'Humanos', nameEn: 'Humans', tooltipPt: 'Cartas Amarelas avançam Nazgul/Frodo em 1. Cartas Vermelhas dão +1 Unidade.', tooltipEn: 'Yellow cards advance Nazgul/Frodo 1 space. Red cards give +1 Unit.' },
      { id: 'ents',    icon: '🌳', namePt: 'Ents', nameEn: 'Ents', tooltipPt: 'Remove 1 Fortaleza do jogador (região com menos unidades). Rola o dado 3x para carta Roxa.', tooltipEn: 'Removes player Fortress (from region with fewest units). Rolls die 3x for Purple card effects.' },
      { id: 'wizards', icon: '🧙', namePt: 'Magos', nameEn: 'Wizards', tooltipPt: 'Avança 2 espaços no Anel. Revela Decisão p/ jogar carta do Descarte (desempate: capítulo mais alto, s/ repetição).', tooltipEn: 'Advances 2 spaces on Ring. Reveals Decision to play from discard (tie: highest chapter, no repeat).' }
    ];"""

new_science_types = """const SCIENCE_TYPES = [
      { id: 'elves',   icon: '🧝', namePt: 'Elfos', nameEn: 'Elves', tooltipPt: 'Efeito (Carta Verde): Sem turno extra em amarela duplicada. Ignora Skills. Coloca Unidades como carta Vermelha.', tooltipEn: 'Effect (Green Card): No extra turn on yellow if card has symbol. Ignores skills. Places units like Red cards.' },
      { id: 'dwarves', icon: '⛏️', namePt: 'Anões', nameEn: 'Dwarves', tooltipPt: 'Efeito (Carta Verde): Ignora custo adicional de fortalezas em Landmarks. Movimenta como carta Roxa.', tooltipEn: 'Effect (Green Card): Ignores extra Fortress cost for Landmarks. Moves like Purple cards.' },
      { id: 'hobbit',  icon: '💍', namePt: 'Hobbits', nameEn: 'Hobbits', tooltipPt: 'Efeito (Carta Verde): Ganha 3 moedas ao obter a ficha (sem encadeamento). Águia conta como raça extra.', tooltipEn: 'Effect (Green Card): Gains 3 coins upon claiming token. Eagle symbol counts as extra race.' },
      { id: 'humans',  icon: '🐎', namePt: 'Humanos', nameEn: 'Humans', tooltipPt: 'Efeito (Carta Verde): Cartas Amarelas avançam Nazgul/Frodo em 1. Cartas Vermelhas dão +1 Unidade.', tooltipEn: 'Effect (Green Card): Yellow cards advance Nazgul/Frodo 1 space. Red cards give +1 Unit.' },
      { id: 'ents',    icon: '🌳', namePt: 'Ents', nameEn: 'Ents', tooltipPt: 'Efeito (Carta Verde): Remove 1 Fortaleza do jogador (região com menos unidades). Rola o dado 3x para carta Roxa.', tooltipEn: 'Effect (Green Card): Removes player Fortress (from region with fewest units). Rolls die 3x for Purple card effects.' },
      { id: 'wizards', icon: '🧙', namePt: 'Magos', nameEn: 'Wizards', tooltipPt: 'Efeito (Carta Verde): Avança 2 espaços no Anel. Revela Decisão p/ jogar carta do Descarte (desempate: capítulo mais alto, s/ repetição).', tooltipEn: 'Effect (Green Card): Advances 2 spaces on Ring. Reveals Decision to play from discard (tie: highest chapter, no repeat).' }
    ];"""
html = html.replace(old_science_types, new_science_types)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
