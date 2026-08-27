import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS
css = """
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

# 2. Setup Screen Additions
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

# 3. Add End Round button to game-screen and inject screens
game_end_html = """
    <button class="start-btn" style="margin-top:20px; margin-bottom:20px;" onclick="endAutomaRound()" data-i18n="lc_end_round">Terminar Rodada e Calcular</button>
"""
calc_summary_html = """
<!-- CALCULATOR SCREEN -->
<div class="calc-screen" id="calcScreen">
    <h2 style="text-align:center; font-family:'Poppins', sans-serif;"><span data-i18n="lc_calc_title">Calculadora</span> - <span id="calcPlayerName">P1</span></h2>
    <h4 style="text-align:center; color:var(--text-muted); margin-top:0;"><span data-i18n="lc_round">Rodada</span> <span id="calcRoundText">1</span></h4>
    <div id="calcRowsContainer"></div>
    <div style="text-align:right; font-size: 1.5em; font-weight:bold; margin: 20px 0; font-family:'Poppins', sans-serif;"><span data-i18n="lc_total_label">Total</span>: <span id="calcGrandTotal" style="color:var(--accent);">0</span></div>
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
content = content.replace('</div>\n\n<!-- RESULT MODAL -->', game_end_html + '\n</div>\n\n' + calc_summary_html + '\n<!-- RESULT MODAL -->')


# 4. JavaScript Logic Replacement
js_vars = """
let gameMode = 'automa';
let maxRounds = 1;
let currentRound = 1;
let scoresP1 = [];
let scoresP2 = [];
let calcState = { yellow:[], blue:[], white:[], green:[], red:[] };
let calcCurrentPlayer = 1;
let automaScoreThisRound = 0;

function setMode(m) {
    gameMode = m;
    document.getElementById('mode_automa').classList.toggle('active', m === 'automa');
    document.getElementById('mode_calc').classList.toggle('active', m === 'calc');
}
function setRounds(r) {
    maxRounds = r;
    document.getElementById('rounds_1').classList.toggle('active', r === 1);
    document.getElementById('rounds_3').classList.toggle('active', r === 3);
}

function startGame() {
  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('btnResetGame').classList.remove('hidden');
  currentRound = 1;
  scoresP1 = [];
  scoresP2 = [];
  startRound();
}

function startRound() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('calcScreen').style.display = 'none';
    document.getElementById('summaryScreen').style.display = 'none';
    
    if (gameMode === 'automa') {
        document.getElementById('gameScreen').style.display = 'block';
        expeditions = { yellow: [], blue: [], white: [], green: [], red: [] };
        renderTableau();
    } else {
        calcCurrentPlayer = 1;
        openCalculator();
    }
}

function endAutomaRound() {
    let total = 0;
    COLORS.forEach(c => total += calculateScore(expeditions[c]));
    automaScoreThisRound = total;
    scoresP2[currentRound - 1] = automaScoreThisRound;
    
    document.getElementById('gameScreen').style.display = 'none';
    calcCurrentPlayer = 1;
    openCalculator();
}

function openCalculator() {
    document.getElementById('calcScreen').style.display = 'block';
    document.getElementById('calcRoundText').innerText = currentRound + " / " + maxRounds;
    
    let pName = "";
    if (gameMode === 'automa') {
        pName = i18n('lc_player') + " (Você)";
    } else {
        pName = i18n('lc_player') + " " + calcCurrentPlayer;
    }
    document.getElementById('calcPlayerName').innerText = pName;
    
    calcState = { yellow:[], blue:[], white:[], green:[], red:[] };
    renderCalculatorRows();
}

function renderCalculatorRows() {
    const cont = document.getElementById('calcRowsContainer');
    cont.innerHTML = '';
    let grandTotal = 0;
    
    COLORS.forEach(c => {
        const arr = calcState[c];
        const score = calculateScore(arr);
        grandTotal += score;
        
        let html = `<div class="calc-row c-${c}"><div class="calc-cards">`;
        
        for(let i=0; i<3; i++) {
            let isActive = arr.filter(x => x==='H').length > i;
            let activeCls = isActive ? 'active h-btn' : '';
            html += `<button class="calc-btn ${activeCls}" onclick="toggleCalc('${c}', 'H')">🤝</button>`;
        }
        for(let v=2; v<=10; v++) {
            let isActive = arr.includes(v);
            let activeCls = isActive ? 'active' : '';
            html += `<button class="calc-btn ${activeCls}" onclick="toggleCalc('${c}', ${v})">${v}</button>`;
        }
        
        html += `</div><div class="calc-row-score">${score}</div></div>`;
        cont.innerHTML += html;
    });
    document.getElementById('calcGrandTotal').innerText = grandTotal;
}

function toggleCalc(color, val) {
    let arr = calcState[color];
    if (val === 'H') {
        let hCount = arr.filter(x => x==='H').length;
        if (hCount < 3) arr.unshift('H');
        else calcState[color] = arr.filter(x => x !== 'H');
    } else {
        let idx = arr.indexOf(val);
        if (idx > -1) arr.splice(idx, 1);
        else {
            arr.push(val);
            let hArr = arr.filter(x => x === 'H');
            let numArr = arr.filter(x => x !== 'H').sort((a,b) => a - b);
            calcState[color] = hArr.concat(numArr);
        }
    }
    renderCalculatorRows();
}

function confirmCalculator() {
    let total = parseInt(document.getElementById('calcGrandTotal').innerText);
    if (calcCurrentPlayer === 1) {
        scoresP1[currentRound - 1] = total;
        if (gameMode === 'calc') {
            document.getElementById('calcScreen').style.display = 'none';
            calcCurrentPlayer = 2;
            openCalculator();
        } else {
            showRoundSummary();
        }
    } else {
        scoresP2[currentRound - 1] = total;
        showRoundSummary();
    }
}

function showRoundSummary() {
    document.getElementById('calcScreen').style.display = 'none';
    document.getElementById('summaryScreen').style.display = 'block';
    
    if (gameMode === 'automa') {
        document.getElementById('sumPlayer1Name').innerText = i18n('lc_player') + " (Você)";
        document.getElementById('sumPlayer2Name').innerText = "Automa";
    } else {
        document.getElementById('sumPlayer1Name').innerText = i18n('lc_player') + " 1";
        document.getElementById('sumPlayer2Name').innerText = i18n('lc_player') + " 2";
    }
    
    let tbody = document.getElementById('summaryTableBody');
    tbody.innerHTML = '';
    let t1 = 0, t2 = 0;
    
    for(let i=0; i<currentRound; i++) {
        let s1 = scoresP1[i] || 0;
        let s2 = scoresP2[i] || 0;
        t1 += s1; t2 += s2;
        tbody.innerHTML += `<tr><td>${i+1}</td><td>${s1}</td><td>${s2}</td></tr>`;
    }
    
    document.getElementById('sumTotal1').innerText = t1;
    document.getElementById('sumTotal2').innerText = t2;
    
    let btn = document.getElementById('btnNextRound');
    let winnerText = document.getElementById('winnerText');
    
    if (currentRound < maxRounds) {
        btn.style.display = 'inline-block';
        btn.innerText = i18n('lc_next_round') || "Próxima Rodada";
        btn.onclick = nextRound;
        winnerText.innerText = "";
    } else {
        btn.style.display = 'inline-block';
        btn.innerText = i18n('lc_final_btn') || "Voltar à Tela Inicial";
        btn.onclick = resetGameForced;
        
        if (t1 > t2) winnerText.innerText = (gameMode === 'automa' ? i18n('lc_p1_wins_automa') : i18n('lc_p1_wins_multi'));
        else if (t2 > t1) winnerText.innerText = (gameMode === 'automa' ? i18n('lc_p2_wins_automa') : i18n('lc_p2_wins_multi'));
        else winnerText.innerText = i18n('lc_tie');
    }
}

function nextRound() {
    currentRound++;
    startRound();
}

function resetGameForced() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('calcScreen').style.display = 'none';
    document.getElementById('summaryScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'block';
    document.getElementById('btnResetGame').classList.add('hidden');
    scoresP1 = []; scoresP2 = []; currentRound = 1;
    expeditions = { yellow:[], blue:[], white:[], green:[], red:[] };
    renderTableau();
}

"""

# Let's replace startGame completely
content = re.sub(
    r'function startGame\(\) \{.*?function selectColor\(c\)', 
    js_vars + '\n\nfunction selectColor(c)', 
    content, 
    flags=re.DOTALL
)

# Let's rewrite resetGame completely
reset_game_rewrite = """
function resetGame() {
    if(confirm(i18n('resetConfirm'))) {
        resetGameForced();
    }
}
"""
content = re.sub(
    r'function resetGame\(\) \{.*?\}\n\}', 
    reset_game_rewrite, 
    content, 
    flags=re.DOTALL
)

# Let's remove the hooked originalStartGame at the end
content = re.sub(
    r'// hook up startGame to show the reset button\nconst originalStartGame = startGame;.*?\}', 
    '', 
    content, 
    flags=re.DOTALL
)


# 5. I18N
pt_strings = """
    lc_mode_title: "Modo de Jogo",
    lc_mode_automa: "Solo vs Automa",
    lc_mode_calc: "Apenas Calculadora (Multiplayer)",
    lc_rounds_title: "Duração da Partida",
    lc_rounds_1: "1 Rodada",
    lc_rounds_3: "Melhor de 3",
    lc_end_round: "Terminar Rodada e Calcular",
    lc_calc_title: "Calculadora",
    lc_round: "Rodada",
    lc_confirm: "Confirmar Pontuação",
    lc_summary_title: "Resumo da Partida",
    lc_total_label: "Total",
    lc_next_round: "Próxima Rodada",
    lc_final_btn: "Voltar à Tela Inicial",
    lc_p1_wins_automa: "Você Venceu o Automa! 🎉",
    lc_p2_wins_automa: "O Automa Venceu! 🤖",
    lc_p1_wins_multi: "Jogador 1 Venceu! 🏆",
    lc_p2_wins_multi: "Jogador 2 Venceu! 🏆",
    lc_tie: "Empate! 🤝",
    lc_player: "Jogador",
"""

en_strings = """
    lc_mode_title: "Game Mode",
    lc_mode_automa: "Solo vs Automa",
    lc_mode_calc: "Calculator Only (Multiplayer)",
    lc_rounds_title: "Match Length",
    lc_rounds_1: "1 Round",
    lc_rounds_3: "Best of 3",
    lc_end_round: "End Round & Calculate Score",
    lc_calc_title: "Calculator",
    lc_round: "Round",
    lc_confirm: "Confirm Score",
    lc_summary_title: "Match Summary",
    lc_total_label: "Total",
    lc_next_round: "Next Round",
    lc_final_btn: "Back to Home",
    lc_p1_wins_automa: "You beat the Automa! 🎉",
    lc_p2_wins_automa: "The Automa Wins! 🤖",
    lc_p1_wins_multi: "Player 1 Wins! 🏆",
    lc_p2_wins_multi: "Player 2 Wins! 🏆",
    lc_tie: "It's a Tie! 🤝",
    lc_player: "Player",
"""

content = re.sub(r'(Object\.assign\(I18N\.pt, \{)', r'\1\n' + pt_strings, content)
content = re.sub(r'(Object\.assign\(I18N\.en, \{)', r'\1\n' + en_strings, content)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)
