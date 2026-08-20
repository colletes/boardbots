const fs = require('fs');

function revertDiceBox(file) {
    let html = fs.readFileSync(file, 'utf8');
    
    const initRegex = /async function initDiceBox\(\) \{[\s\S]*?\}\s*catch\(err\) \{[^}]*\}\s*\}/;
    
    // For space base
    const spaceBaseInit = `    async function initDiceBox() {
        if(diceBox) return;
        try {
            const { default: DiceBox } = await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');
            diceBox = new DiceBox({
                container: '#dice-box',
                assetPath: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/',
                origin: 'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',
                theme: 'default',
                themeColor: '#1e293b',
                scale: 6,
                gravity: 2.5,
                friction: 0.8,
                restitution: 0.5
            });
            await diceBox.init();
            diceBoxReady = true;
            
            diceBox.onRollComplete = (results) => {
                const d1 = results[0]?.value ?? 1;
                const d2 = results[1]?.value ?? 1;
                const txt = document.getElementById('diceResultText');
                txt.style.display = 'block';
                txt.innerText = \`🎲 \${d1} | \${d2}  (Soma: \${d1+d2})\`;
            };
        } catch(err) {
            console.error("Failed to load dice-box", err);
            diceBoxReady = false;
        }
    }`;

    // For burgundy
    const burgundyInit = `    async function initDiceBox() {
        if(diceBox)return;
        try{
            const{default:DiceBox}=await import('https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/dice-box.es.min.js');
            diceBox=new DiceBox({container:'#dice-box',assetPath:'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/assets/',origin:'https://unpkg.com/@3d-dice/dice-box@1.1.3/dist/',theme:'default',scale:6,gravity:2.5,friction:0.8,restitution:0.5});
            await diceBox.init();
            diceBoxReady=true;
            diceBox.onRollComplete=(results)=>{
                isRolling=false;
                const botVal=results[0]?.value??1,whiteVal=results[1]?.value??1;
                const hex=document.getElementById('botColor').value;
                const cName = t(Object.keys(I18N.pt).find(k=>I18N.pt[k]===getColorName(hex)));
                document.getElementById('diceResult').innerHTML=\`<span style="color:\${hex}">\${cName}: \${botVal}</span>&nbsp;|&nbsp;<span style="color:#666">\${t('whiteDie').replace(':','')} \${whiteVal}</span>\`;
                showSummary(botVal,whiteVal);
                document.getElementById('rollBtn').disabled=false;
            };
        }catch(err){diceBoxReady=false;}
    }`;

    if (file.includes('space_base')) {
        let match = html.match(initRegex);
        if(match) {
            html = html.replace(match[0], spaceBaseInit);
            fs.writeFileSync(file, html);
            console.log('Fixed space base');
        } else { console.log('Match failed SB'); }
    } else {
        const bRegex = /async function initDiceBox\(\)\{[\s\S]*?\}\s*catch\(err\)\{diceBoxReady=false;\}\s*\}/;
        let match = html.match(bRegex);
        if (match) {
            html = html.replace(match[0], burgundyInit);
            fs.writeFileSync(file, html);
            console.log('Fixed burgundy');
        } else { console.log('Match failed B'); }
    }
}

revertDiceBox('bots/space_base_bot_v1.html');
revertDiceBox('bots/burgundy_bot_v1.html');
