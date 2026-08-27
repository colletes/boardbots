import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

science_types_old = """    const SCIENCE_TYPES = [
      { id: 'elves',   icon: '🧝', namePt: 'Elfos', nameEn: 'Elves', tooltipPt: 'Sem turno extra em amarela duplicada. Ignora Skills. Coloca Unidades como carta Vermelha.', tooltipEn: 'No extra turn on yellow if card has symbol. Ignores skills. Places units like Red cards.' },
      { id: 'dwarves', icon: '⛏️', namePt: 'Anões', nameEn: 'Dwarves', tooltipPt: 'Ignora custo adicional de fortalezas em Landmarks. Movimenta como carta Roxa.', tooltipEn: 'Ignores extra Fortress cost for Landmarks. Moves like Purple cards.' },
      { id: 'hobbit',  icon: '💍', namePt: 'Hobbits', nameEn: 'Hobbits', tooltipPt: 'Ganha 3 moedas ao obter a ficha (sem encadeamento). Águia conta como raça extra.', tooltipEn: 'Gains 3 coins upon claiming token. Eagle symbol counts as extra race.' },
      { id: 'humans',  icon: '🐎', namePt: 'Humanos', nameEn: 'Humans', tooltipPt: 'Cartas Amarelas avançam Nazgul/Frodo em 1. Cartas Vermelhas dão +1 Unidade.', tooltipEn: 'Yellow cards advance Nazgul/Frodo 1 space. Red cards give +1 Unit.' },
      { id: 'ents',    icon: '🌳', namePt: 'Ents', nameEn: 'Ents', tooltipPt: 'Remove 1 Fortaleza do jogador (região com menos unidades). Rola o dado 3x para carta Roxa.', tooltipEn: 'Removes player Fortress (from region with fewest units). Rolls die 3x for Purple card effects.' },
      { id: 'wizards', icon: '🧙', namePt: 'Magos', nameEn: 'Wizards', tooltipPt: 'Avança Nazgul/Frodo em 2. Revela Decisão para jogar do descarte.', tooltipEn: 'Advances Nazgul/Frodo 2 spaces. Reveals Decision card to play from discard pile.' }
    ];"""

science_types_new = """    const SUPREMACY_SYMBOLS = [
      { id: 'elves',   icon: '🧝', namePt: 'Elfos', nameEn: 'Elves' },
      { id: 'dwarves', icon: '⛏️', namePt: 'Anões', nameEn: 'Dwarves' },
      { id: 'hobbit',  icon: '💍', namePt: 'Hobbits', nameEn: 'Hobbits' },
      { id: 'humans',  icon: '🐎', namePt: 'Humanos', nameEn: 'Humans' },
      { id: 'ents',    icon: '🌳', namePt: 'Ents', nameEn: 'Ents' },
      { id: 'wizards', icon: '🧙', namePt: 'Magos', nameEn: 'Wizards' },
      { id: 'eagle',   icon: '🦅', namePt: 'Águias', nameEn: 'Eagles' }
    ];

    const ALLIANCE_TOKENS = [
      { id: 'elves', icon: '🧝', namePt: 'Elfos', nameEn: 'Elves', 
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#eab308; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🟨 ↺❌</span> Sem turno extra ao jogar Amarela com símbolo do líder.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟥 🏰</span> Coloca Unidades seguindo as regras de cartas Vermelhas.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#475569; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">⭕ ❌</span> O bot SEMPRE ignora as fichas de Habilidade (Skills).</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#eab308; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🟨 ↺❌</span> No extra turn on yellow if card has symbol.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟥 🏰</span> Places units following Red card rules.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#475569; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">⭕ ❌</span> The bot ALWAYS ignores Skills.</div>
        `
      },
      { id: 'dwarves', icon: '⛏️', namePt: 'Anões', nameEn: 'Dwarves',
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#d97706; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">💰 ❌</span> Ignora custo adicional de Fortalezas inimigas nas Landmarks.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#94a3b8; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🏛️ ↺</span> Sem turno extra ao comprar Landmark.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#a855f7; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟪 ⏩</span> Movimentação extra segue a regra das cartas Roxas.</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#d97706; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">💰 ❌</span> Removes the additional enemy Fortress cost for Landmarks.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#94a3b8; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🏛️ ↺</span> No extra turn when it claims a Landmark.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#a855f7; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟪 ⏩</span> Follows Purple cards section for movement.</div>
        `
      },
      { id: 'hobbit', icon: '💍', namePt: 'Hobbits', nameEn: 'Hobbits',
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#65a30d; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🦅</span> O Símbolo de Águia conta como uma Raça adicional (para a vitória).</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟦 1⚔️</span> Ao colocar Unidades, siga a regra de cartas Vermelhas.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#fbbf24; color:#000; padding:2px 6px; border-radius:12px; font-weight:bold;">💰 3</span> Ganha 3 moedas (Apenas ao obter esta ficha, sem turno extra).</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#65a30d; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🦅</span> Eagle symbol counts as an additional Race symbol.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#3b82f6; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟦 1⚔️</span> Follow the Red cards section for bot Unit placement.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#fbbf24; color:#000; padding:2px 6px; border-radius:12px; font-weight:bold;">💰 3</span> Gains 3 coins immediately (no extra turn).</div>
        `
      },
      { id: 'humans', icon: '🐎', namePt: 'Humanos', nameEn: 'Humans',
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#eab308; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🟨 💍+1</span> Cartas Amarelas avançam Nazgul/Frodo 1 espaço.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟥 +1⚔️</span> Cartas Vermelhas colocam +1 Unidade adicional.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🎴 ❌</span> NUNCA descarta cartas para ganhar moedas (foco na prioridade).</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#eab308; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🟨 💍+1</span> Yellow cards advance Nazgul/Frodo 1 space.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#ef4444; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🟥 +1⚔️</span> Red cards place +1 additional Unit.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🎴 ❌</span> NEVER discards card to gain Coins.</div>
        `
      },
      { id: 'ents', icon: '🌳', namePt: 'Ents', nameEn: 'Ents',
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">↺ ❌</span> Sem turno extra ao obter esta ficha.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#1e293b; color:#ef4444; padding:2px 6px; border-radius:4px; font-weight:bold;">🏰 ❌</span> Remove 1 Fortaleza do jogador (região com menos unidades do jogador).</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#f1f5f9; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🎲 x3</span> Rola o dado 3 vezes para resolver efeitos de carta Roxa.</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">↺ ❌</span> No additional turn when it takes this token.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#1e293b; color:#ef4444; padding:2px 6px; border-radius:4px; font-weight:bold;">🏰 ❌</span> Removes a player Fortress (region with fewest player units).</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#f1f5f9; color:#000; padding:2px 6px; border-radius:4px; font-weight:bold;">🎲 x3</span> Rolls the die 3 times to determine Purple card effects.</div>
        `
      },
      { id: 'wizards', icon: '🧙', namePt: 'Magos', nameEn: 'Wizards',
        htmlPt: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#fbbf24; color:#000; padding:2px 6px; border-radius:12px; font-weight:bold;">💍 💍</span> Avança Nazgul ou Frodo/Sam 2 espaços.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">1⚔️ 1⚔️</span> Regras de colocação seguem as cartas Vermelhas.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#a855f7; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🎴 ⏪ ❌</span> Revela carta do deck de Decisão para jogar carta do descarte, ignorando símbolo de turno extra.</div>
        `,
        htmlEn: `
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#fbbf24; color:#000; padding:2px 6px; border-radius:12px; font-weight:bold;">💍 💍</span> Advances Nazgul or Frodo and Sam 2 spaces.</div>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;"><span style="background:#64748b; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">1⚔️ 1⚔️</span> Follow Red cards section for bot Units placement.</div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="background:#a855f7; color:#fff; padding:2px 6px; border-radius:4px; font-weight:bold;">🎴 ⏪ ❌</span> Reveal Decision card to play from discard pile (ignoring extra turn symbol).</div>
        `
      }
    ];"""
html = html.replace(science_types_old, science_types_new)
with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
