const fs = require('fs');
let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const oldLogic = `        if (automaDeck.length <= 1) {
            // "Whenever Joanna has one card left... shuffle all back... skip one card"
            automaDeck = [0, 1, 2, 3, 4, 5];
            shuffleArray(automaDeck);
            // Skip one
            const skipped = automaDeck.pop();
            automaDiscard = [skipped];
        }
        
        const cardIndex = automaDeck.pop();
        automaDiscard.push(cardIndex);`;

const newLogic = `        if (automaDeck.length <= 1) {
            // "Whenever Joanna has one card left... shuffle all back... skip one card"
            automaDeck = [0, 1, 2, 3, 4, 5];
            shuffleArray(automaDeck);
            // Skip one card (remove it completely for this cycle)
            automaDeck.pop();
            automaDiscard = [];
        }
        
        const cardIndex = automaDeck.pop();
        automaDiscard.push(cardIndex);`;

if(html.includes(oldLogic)) {
    html = html.replace(oldLogic, newLogic);
    fs.writeFileSync('bots/space_base_bot_v1.html', html);
    console.log('Fixed Joanna cycle logic');
} else {
    console.log('Not found');
}
