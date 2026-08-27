with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

trilha_panel = """
        <!-- Trilha/Fichas Panel (Always visible below card) -->
        <div style="background:var(--surface-1); border:1px solid var(--border); border-radius:8px; padding:12px; margin-top:16px; margin-bottom:16px;">
          <h3 style="margin-bottom:8px; font-size:0.95rem;">💍 Trilha do Anel & Fichas</h3>
          <p style="font-size:0.8rem; line-height:1.4; color:var(--text-muted); margin-bottom:8px;">
            <strong>Efeitos da Trilha:</strong> 1 Moeda | ↺ (sem turno extra se símbolo já ativado) | 1 Unidade | ❌ Destruir Fortaleza (em região s/ unidades do jogador).
          </p>
          <div style="background:var(--bg); border-radius:6px; padding:8px; font-size:0.8rem;">
            <strong style="display:block; margin-bottom:4px; color:var(--accent);">🎲 Sorteio de Fichas de Raça FÍSICAS:</strong>
            <p style="color:var(--text-muted); margin-bottom:8px;">Quando o Bot formar uma aliança, use os botões abaixo para sortear qual Ficha Física ele pega da mesa. <strong>O poder da ficha física deve ser resolvido pelo jogador imediatamente ou quando aplicável!</strong></p>
            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" onclick="rollDiceBox('race2')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 2 iguais (1d2)</button>
              <button class="btn-secondary" onclick="rollDiceBox('race3')" style="flex:1; padding:6px; font-size:0.75rem;">Sortear de 3 difer. (1d3)</button>
            </div>
            <div id="inlineDiceResult" style="margin-top:8px; font-weight:bold; color:var(--accent); text-align:center;"></div>
          </div>
        </div>
"""

html = html.replace("<!-- Action Controls -->", trilha_panel + "\n        <!-- Action Controls -->")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
