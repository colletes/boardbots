const fs = require('fs');

// Fix timeout in both bots
function fixTimeout(file) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/5000\)\)/g, '10000))');
    fs.writeFileSync(file, html);
    console.log('Fixed timeout in ' + file);
}
fixTimeout('bots/space_base_bot_v1.html');
fixTimeout('bots/burgundy_bot_v1.html');

// Fix Space Base State Restoration UI
let sb = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const restoreUIFix = `
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
        document.getElementById("setupOverlay").style.display = "none";
        document.getElementById("mainContainer").style.display = "grid";
        const loadedState = loadState();
        
        if (gameMode === 'joanna') {
            document.getElementById('joannaControls').style.display = 'block';
            document.getElementById('baseAttackControls').style.display = 'none';
            document.getElementById('joannaCardDisplay').style.display = 'block';
            document.getElementById('attackLogContainer').style.display = 'none';
            
            const conf = diffConfigs[difficulty];
            document.getElementById('cardDiffName').textContent = conf.name;
            
            if (automaDiscard.length > 0) {
                renderJoannaCard(automaDiscard[automaDiscard.length - 1]);
            }
            updateDeckStatusText();
            if (loadedState && loadedState.vpCounter !== undefined) {
                document.getElementById('vpCounter').value = loadedState.vpCounter;
            }
        } else {
            document.getElementById('joannaControls').style.display = 'none';
            document.getElementById('baseAttackControls').style.display = 'block';
            document.getElementById('joannaCardDisplay').style.display = 'none';
            document.getElementById('attackLogContainer').style.display = 'block';
            updateDeckStatusText();
            renderAttackLog();
        }

        if (diceMode === "virtual") { document.getElementById("dice-box").style.display = "block"; initDiceBox(); }
        if (diceMode === "physical") { document.getElementById("manualDiceArea").style.display = "block"; }
    }
`;

const oldInitBlock = /const saved = localStorage\.getItem\(LS_KEY\);[\s\S]*?if \(diceMode === "physical"\) \{ document\.getElementById\("manualDiceArea"\)\.style\.display = "block"; \}\s*\}/;

if(sb.match(oldInitBlock)) {
    sb = sb.replace(oldInitBlock, restoreUIFix);
    fs.writeFileSync('bots/space_base_bot_v1.html', sb);
    console.log('Fixed Space Base UI Restore');
} else {
    console.log('Failed to match init block in Space Base');
}
