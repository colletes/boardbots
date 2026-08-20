const fs = require('fs');

function nonBlockingStart(file) {
    let html = fs.readFileSync(file, 'utf8');

    // Remove `await` from `await initDiceBox()`
    html = html.replace(/await initDiceBox\(\);/g, 'initDiceBox();');

    // Add a 3-second timeout back to initDiceBox to fail gracefully, but don't block
    const timeoutCode = `
            await Promise.race([
                diceBox.init(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
    `;
    
    // In space base
    if(file.includes('space_base')) {
        const initRegex = /await diceBox\.init\(\);/;
        html = html.replace(initRegex, timeoutCode);
        
        // CSS tweaks for mobile
        const cssTweak = `.dice-result-text { font-size: 1.5em; text-align: center; color: #e2e8f0; font-family: var(--font-display); margin: 20px 0; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px dashed var(--sb-border); font-weight: bold; word-break: break-word; }
        .sb-select { width: 100%; max-width: 100%; padding: 10px; border-radius: 6px; background: #1e293b; color: #fff; border: 1px solid var(--sb-border); font-size: 1em; margin-bottom: 20px; box-sizing: border-box; }`;
        
        html = html.replace(/\.dice-result-text \{[^\}]+\}/, '')
                   .replace(/\.sb-select \{[^\}]+\}/, '')
                   .replace('</style>', cssTweak + '\n</style>');
                   
        // Add a safety try-catch to diceBox.roll
        const rollTweak = `
        try {
            document.getElementById('diceResultText').style.display = 'none';
            diceBox.roll('2d6').catch(err => {
                console.error(err);
                diceBoxReady = false;
                rollVirtualDice(); // triggers fallback
            });
        } catch(err) {
            diceBoxReady = false;
            rollVirtualDice();
        }`;
        
        const oldRoll = /document\.getElementById\('diceResultText'\)\.style\.display = 'none';\s*diceBox\.roll\('2d6'\);/;
        html = html.replace(oldRoll, rollTweak);
    } 
    // In burgundy
    else {
        const initRegex = /await diceBox\.init\(\);/;
        html = html.replace(initRegex, timeoutCode);
        
        // Safety in Burgundy roll
        const oldRollBurgundy = /document\.getElementById\('turnSummary'\)\.classList\.remove\('active'\);\s*diceBox\.roll\(\['1d6-d64545','1d6-ffffff'\]\);/g;
        const newRollBurgundy = `document.getElementById('turnSummary').classList.remove('active');
        try {
            diceBox.roll(['1d6-d64545','1d6-ffffff']).catch(err => {
                diceBoxReady = false;
                rollVirtualDice();
            });
        } catch(e) { diceBoxReady = false; rollVirtualDice(); }`;
        html = html.replace(oldRollBurgundy, newRollBurgundy);
    }

    fs.writeFileSync(file, html);
    console.log('Fixed ' + file);
}

nonBlockingStart('bots/space_base_bot_v1.html');
nonBlockingStart('bots/burgundy_bot_v1.html');
