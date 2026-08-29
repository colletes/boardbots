const fs = require('fs');
let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const s1 = `<div id="manualDiceArea" style="display:none; background:rgba(255,255,255,0.05); border:1px solid var(--sb-border); border-radius:8px; padding:14px; margin-bottom:16px;">`;
const s2 = `Confirmar Rolagem</button>\n        </div>`;

if(html.includes(s1) && html.includes(s2)) {
    const start = html.indexOf(s1);
    const end = html.indexOf(s2) + s2.length;
    const oldBlock = html.substring(start, end);
    const newBlock = `
        <style>
            .sb-die-btn {
                flex: 1; padding: 10px 0; font-family: var(--font-display); font-size: 1.1em; font-weight: 700;
                background: transparent; color: var(--sb-text); border: 1px solid var(--sb-border); border-radius: 6px; cursor: pointer;
            }
            .sb-die-btn:active { transform: scale(0.95); }
            .sb-die-btn.active-die1 { background: #3b82f6; border-color: #3b82f6; color: white; }
            .sb-die-btn.active-die2 { background: #10b981; border-color: #10b981; color: white; }
            .sb-dice-row { display: flex; gap: 6px; margin-bottom: 8px; }
        </style>
        <div id="manualDiceArea" style="display:none; background:rgba(255,255,255,0.05); border:1px solid var(--sb-border); border-radius:8px; padding:14px; margin-bottom:16px;">
            <p style="font-size:0.85em; color:#94a3b8; margin:0 0 10px;" data-i18n="manualDicePrompt">Dados físicos: informe o resultado dos dois dados:</p>
            
            <label style="font-size:0.75em; color:#94a3b8; display:block; margin-bottom:4px;" data-i18n="die1Label">Dado 1</label>
            <div class="sb-dice-row" id="die1Buttons">
                <button class="sb-die-btn active-die1" onclick="setManualDie(1, 1)">1</button>
                <button class="sb-die-btn" onclick="setManualDie(1, 2)">2</button>
                <button class="sb-die-btn" onclick="setManualDie(1, 3)">3</button>
                <button class="sb-die-btn" onclick="setManualDie(1, 4)">4</button>
                <button class="sb-die-btn" onclick="setManualDie(1, 5)">5</button>
                <button class="sb-die-btn" onclick="setManualDie(1, 6)">6</button>
            </div>
            
            <label style="font-size:0.75em; color:#94a3b8; display:block; margin-bottom:4px;" data-i18n="die2Label">Dado 2</label>
            <div class="sb-dice-row" id="die2Buttons">
                <button class="sb-die-btn active-die2" onclick="setManualDie(2, 1)">1</button>
                <button class="sb-die-btn" onclick="setManualDie(2, 2)">2</button>
                <button class="sb-die-btn" onclick="setManualDie(2, 3)">3</button>
                <button class="sb-die-btn" onclick="setManualDie(2, 4)">4</button>
                <button class="sb-die-btn" onclick="setManualDie(2, 5)">5</button>
                <button class="sb-die-btn" onclick="setManualDie(2, 6)">6</button>
            </div>
            
            <button class="action-btn" style="margin-top:10px; width:100%; padding:10px; font-size:1em;" onclick="confirmManualRoll()" data-i18n="confirmRoll">Confirmar Rolagem</button>
        </div>`;
        html = html.replace(oldBlock, newBlock);
}

const jsOld1 = `    window.adjustManualDie = function(die, delta) {
        if(die === 1) {
            let v = parseInt(document.getElementById('manualDie1').innerText);
            v += delta; if(v<1) v=6; if(v>6) v=1;
            document.getElementById('manualDie1').innerText = v;
        } else {
            let v = parseInt(document.getElementById('manualDie2').innerText);
            v += delta; if(v<1) v=6; if(v>6) v=1;
            document.getElementById('manualDie2').innerText = v;
        }
    }`;
const jsNew1 = `    let manualD1 = 1;
    let manualD2 = 1;
    window.setManualDie = function(die, value) {
        if (die === 1) {
            manualD1 = value;
            document.querySelectorAll('#die1Buttons .sb-die-btn').forEach((b, i) => b.classList.toggle('active-die1', i + 1 === value));
        } else {
            manualD2 = value;
            document.querySelectorAll('#die2Buttons .sb-die-btn').forEach((b, i) => b.classList.toggle('active-die2', i + 1 === value));
        }
    }`;
if(html.includes(jsOld1)) html = html.replace(jsOld1, jsNew1);

const jsOld2 = `const d1 = parseInt(document.getElementById('manualDie1').innerText);
        const d2 = parseInt(document.getElementById('manualDie2').innerText);`;
const jsNew2 = `const d1 = manualD1;
        const d2 = manualD2;`;
if(html.includes(jsOld2)) html = html.replace(jsOld2, jsNew2);

fs.writeFileSync('bots/space_base_bot_v1.html', html);
console.log('Done');
