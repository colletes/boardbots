import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS
css_to_add = """
/* --- Floating UI & Footer Standard --- */
.btn-help-float {
    position:fixed; bottom:18px; right:18px; z-index:60;
    width:48px; height:48px; border-radius:50%;
    background:linear-gradient(180deg, var(--c-blue), #2f63c9);
    color:#fff; border:1px solid #3f6fd6; font-weight:800; font-size:1.3em;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 14px rgba(0,0,0,0.45);
    cursor:pointer; transition:transform 0.15s; margin:0; padding:0;
}
.btn-help-float:active{ transform:scale(0.92); }

.btn-reset-float {
    position:fixed; bottom:18px; left:18px; z-index:60;
    width:auto; margin:0; padding:10px 16px; border-radius:999px;
    background:var(--panel-bg); color:var(--text-muted); border:1px solid rgba(255,255,255,0.1);
    font-weight:700; font-size:0.8em; box-shadow:0 4px 14px rgba(0,0,0,0.35); cursor:pointer;
}
.btn-reset-float.hidden { display: none !important; }

.lang-switch {
    position:fixed; top:14px; right:14px; z-index:160; display:flex; gap:2px;
    background:var(--panel-bg); border:1px solid rgba(255,255,255,0.1);
    border-radius:999px; padding:4px; box-shadow:0 4px 14px rgba(0,0,0,0.35);
}
.lang-btn {
    width:auto; margin:0; padding:6px 12px; font-size:0.78em; border-radius:999px;
    border:none; background:transparent; color:var(--text-muted); font-weight:700; cursor:pointer;
}
.lang-btn.active { background:var(--c-blue); color:#fff; }

.credits {
    display:flex; align-items:center; gap:14px;
    background:var(--panel-bg); border:1px solid rgba(255,255,255,0.1);
    border-radius:12px; padding:14px 16px; margin: 30px auto 10px; max-width: 600px;
}
.credits img { width:52px; height:52px; object-fit:cover; border-radius:8px; border:1px solid rgba(255,255,255,0.1); flex-shrink:0; }
.credits-text { font-size:0.85em; color:var(--text-muted); line-height:1.5; }
.credits-text strong { color:var(--text-main); }
.credits-text a { color:var(--c-blue); text-decoration:none; }

.bmc-inline { display:flex; justify-content:center; margin-bottom: 30px; }
.bmc-inline a {
    display:inline-flex; align-items:center; gap:8px; background:#FFDD00; color:#000;
    font-weight:700; font-size:0.85em; padding:9px 16px; border-radius:8px; text-decoration:none;
}

.btn-home {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2);
    color:#fff; border-radius:10px; padding:12px 26px; font-weight:700; font-size:16px; text-decoration:none;
}
"""

content = content.replace("</style>", css_to_add + "\n</style>")

# 2. Add Body top elements (lang switch, help btn, reset btn)
body_top_html = """
    <button class="btn-help-float" onclick="document.getElementById('helpModal').style.display='flex'" aria-label="Help">?</button>
    <button class="btn-reset-float hidden" id="btnResetGame" onclick="resetGame()" data-i18n="resetBtn">🔄 Nova Partida</button>
    <div class="lang-switch">
        <button class="lang-btn" id="langBtnPt" onclick="setLang('pt')">PT</button>
        <button class="lang-btn" id="langBtnEn" onclick="setLang('en')">EN</button>
    </div>
"""
# Replace body start
content = re.sub(r'(<body.*?>)', r'\1\n' + body_top_html, content)

# 3. Add footer (credits, bmc, home) at the end, just before <div id="helpModal">
footer_html = """
    <div class="credits">
        <img src="../assets/art/lostcities.webp" alt="Lost Cities">
        <div class="credits-text" data-i18n-html="creditsText">
            Made by <strong>Thiago Colletes de Carvalho</strong>. Lost Cities © KOSMOS.
        </div>
    </div>
    
    <div class="bmc-inline">
        <a href="https://www.buymeacoffee.com/colletes" target="_blank" rel="noopener" aria-label="Buy me a coffee">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a2 2 0 0 1 2 2v1a3 3 0 0 1-3 3h-1"/><path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z"/><path d="M8 3c-.6 1 .5 1.6 0 3M12 3c-.6 1 .5 1.6 0 3"/></svg>
            <span data-i18n="bmcBtn">Me pague um café</span>
        </a>
    </div>

    <div style="text-align: center; margin: 20px auto 40px auto; width: 100%;">
        <a href="../index.html" class="btn-home">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></svg>
            <span data-i18n="homeBtn">Home</span>
        </a>
    </div>
"""

content = content.replace('<div id="helpModal"', footer_html + '\n<div id="helpModal"')

# 4. We need to implement resetGame() and setLang() in the script.
script_additions = """
function resetGame() {
    if(confirm(i18n('resetConfirm'))) {
        document.querySelector('.game-screen').style.display = 'none';
        document.querySelector('.setup-screen').style.display = 'block';
        document.getElementById('btnResetGame').classList.add('hidden');
        // Reset state
        tableau = { yellow:[], blue:[], white:[], green:[], red:[] };
        renderTableau();
        document.getElementById('resultModal').style.display = 'none';
    }
}

function setLang(l) {
    localStorage.setItem('boardbots_lang', l);
    applyI18n();
}

// Add strings to I18N
Object.assign(I18N.pt, {
    resetBtn: "🔄 Nova Partida",
    resetConfirm: "Apagar progresso e iniciar nova partida?",
    bmcBtn: "Me pague um café",
    homeBtn: "← Home",
    creditsText: "Criado por <strong>Thiago Colletes de Carvalho</strong> (<a href='mailto:colletes@gmail.com'>colletes@gmail.com</a>) — regras da variante originais. Lost Cities criado por Reiner Knizia, © KOSMOS. Uso pessoal e não comercial."
});
Object.assign(I18N.en, {
    resetBtn: "🔄 New Game",
    resetConfirm: "Erase progress and start new game?",
    bmcBtn: "Buy me a coffee",
    homeBtn: "← Home",
    creditsText: "Made by <strong>Thiago Colletes de Carvalho</strong> (<a href='mailto:colletes@gmail.com'>colletes@gmail.com</a>) — original variant rules. Lost Cities designed by Reiner Knizia, © KOSMOS. Personal, non-commercial use."
});

// hook up startGame to show the reset button
const originalStartGame = startGame;
startGame = function() {
    originalStartGame();
    document.getElementById('btnResetGame').classList.remove('hidden');
}

// override applyI18n to also toggle lang buttons
const originalApplyI18n = applyI18n;
applyI18n = function() {
    originalApplyI18n();
    const lang = localStorage.getItem('boardbots_lang') || 'pt';
    const btnPt = document.getElementById('langBtnPt');
    const btnEn = document.getElementById('langBtnEn');
    if (btnPt) btnPt.classList.toggle('active', lang === 'pt');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');
}
"""
content = content.replace("window.addEventListener('boardbots:langchange', applyI18n);", script_additions + "\nwindow.addEventListener('boardbots:langchange', applyI18n);")

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

