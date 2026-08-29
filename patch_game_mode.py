import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS
css = """
/* Calculator & Summary */
.calc-screen, .summary-screen { display: none; padding: 20px; max-width: 600px; margin: 0 auto; flex: 1; width: 100%; box-sizing: border-box; }
.calc-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border-left: 6px solid; }
.calc-row.c-yellow { border-color: var(--c-yellow); }
.calc-row.c-blue { border-color: var(--c-blue); }
.calc-row.c-white { border-color: var(--c-white); }
.calc-row.c-green { border-color: var(--c-green); }
.calc-row.c-red { border-color: var(--c-red); }
.calc-cards { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; justify-content: flex-start; }
.calc-btn { width: 36px; height: 44px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: var(--panel-bg); color: var(--text-main); font-weight: bold; cursor: pointer; transition: all 0.15s; display:flex; align-items:center; justify-content:center; padding:0; }
.calc-btn.active { background: var(--c-white); color: #000; border-color: #fff; transform: scale(1.08); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
.calc-btn.active.h-btn { background: var(--accent); border-color: #fff; color: #fff; }
.calc-row-score { font-size: 1.2em; font-weight: bold; min-width: 50px; text-align: right; margin-left: 10px; }
.score-table { width: 100%; border-collapse: collapse; margin-top: 20px; text-align: center; background: rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden; }
.score-table th, .score-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.score-table thead { background: rgba(255,255,255,0.05); }
"""
content = content.replace("</style>", css + "\n</style>")

# 2. Setup HTML
setup_html = """
    <h3 data-i18n="lc_mode_title">Modo de Jogo</h3>
    <div class="difficulty-options">
      <button class="diff-btn active" id="mode_automa" onclick="setMode('automa')">
        <strong data-i18n="lc_mode_automa">Solo vs Automa</strong>
      </button>
      <button class="diff-btn" id="mode_calc" onclick="setMode('calc')">
        <strong data-i18n="lc_mode_calc">Apenas Calculadora (Multiplayer)</strong>
      </button>
    </div>
    
    <h3 data-i18n="lc_rounds_title">Duração da Partida</h3>
    <div class="difficulty-options" style="flex-direction: row;">
      <button class="diff-btn active" style="flex:1; text-align:center;" id="rounds_1" onclick="setRounds(1)"><strong data-i18n="lc_rounds_1">1 Rodada</strong></button>
      <button class="diff-btn" style="flex:1; text-align:center;" id="rounds_3" onclick="setRounds(3)"><strong data-i18n="lc_rounds_3">Melhor de 3</strong></button>
    </div>
"""
content = content.replace('<h3 data-i18n="lc_setup_head">', setup_html + '\n    <h3 data-i18n="lc_setup_head">')

# 3. Game Screen End Round button
game_btn_html = """
    <button class="start-btn" style="margin-top:20px; margin-bottom:20px;" onclick="endAutomaRound()" data-i18n="lc_end_round">Terminar Rodada e Calcular</button>
"""
content = content.replace('<!-- RESULT MODAL -->', game_btn_html + '\n</div>\n\n<!-- RESULT MODAL -->')

# 4. Calculator & Summary HTML
calc_summary_html = """
<!-- CALCULATOR SCREEN -->
<div class="calc-screen" id="calcScreen">
    <h2 style="text-align:center; font-family:'Poppins', sans-serif;"><span data-i18n="lc_calc_title">Calculadora</span> - <span id="calcPlayerName">P1</span></h2>
    <h4 style="text-align:center; color:var(--text-muted); margin-top:0;"><span data-i18n="lc_round">Rodada</span> <span id="calcRoundText">1</span></h4>
    <div id="calcRowsContainer"></div>
    <div style="text-align:right; font-size: 1.5em; font-weight:bold; margin: 20px 0; font-family:'Poppins', sans-serif;">Total: <span id="calcGrandTotal" style="color:var(--accent);">0</span></div>
    <button class="start-btn" onclick="confirmCalculator()" data-i18n="lc_confirm">Confirmar Pontuação</button>
</div>

<!-- SUMMARY SCREEN -->
<div class="summary-screen" id="summaryScreen">
    <h2 data-i18n="lc_summary_title" style="font-family:'Poppins', sans-serif;">Resumo da Partida</h2>
    <table class="score-table">
        <thead>
            <tr>
                <th data-i18n="lc_round">Rodada</th>
                <th id="sumPlayer1Name">P1</th>
                <th id="sumPlayer2Name">Automa</th>
            </tr>
        </thead>
        <tbody id="summaryTableBody">
        </tbody>
        <tfoot>
            <tr style="font-weight:bold; font-size:1.2em; border-top: 2px solid var(--accent); background: rgba(255,255,255,0.05);">
                <td data-i18n="lc_total_label">Total</td>
                <td id="sumTotal1">0</td>
                <td id="sumTotal2">0</td>
            </tr>
        </tfoot>
    </table>
    <h3 id="winnerText" style="margin: 24px 0; color: var(--accent); font-family:'Poppins', sans-serif; font-size:1.8em; text-align:center;"></h3>
    <button class="start-btn" id="btnNextRound" onclick="nextRound()" data-i18n="lc_next_round">Próxima Rodada</button>
</div>
"""
content = content.replace('<!-- RESULT MODAL -->', calc_summary_html + '\n<!-- RESULT MODAL -->')

# Now remove the old closing tag from game screen that was replaced above to avoid duplication?
# Wait! I replaced <!-- RESULT MODAL --> twice. The first one will put the button, then the second one will put the screens after it. That's fine.
# But wait, game_btn_html ended with '</div>\n\n<!-- RESULT MODAL -->', which CLOSES game-screen prematurely if the original didn't have </div> there!
# Let me check where <!-- RESULT MODAL --> is relative to game-screen.
# It is OUTSIDE game-screen.
# Original:
# </div>
#
# <!-- RESULT MODAL -->
#
# If I just replace <!-- RESULT MODAL --> with `calc_summary_html + '\n<!-- RESULT MODAL -->'`, that works perfectly.
# For the button, I should put it inside .game-screen.
