const fs = require('fs');
let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const oldUpdate = `let txt = currentLang === 'en' ? \`Cards in Deck: \${automaDeck.length} | Discard: \${automaDiscard.length}\` : \`Cartas no Deck: \${automaDeck.length} | Descarte: \${automaDiscard.length}\`;`;
const newUpdate = `let txt = currentLang === 'en' ? \`Cards in Deck: \${automaDeck.length} | Discard: \${Math.max(0, automaDiscard.length - 1)}\` : \`Cartas no Deck: \${automaDeck.length} | Descarte: \${Math.max(0, automaDiscard.length - 1)}\`;`;

if(html.includes(oldUpdate)) {
    html = html.replace(oldUpdate, newUpdate);
    fs.writeFileSync('bots/space_base_bot_v1.html', html);
    console.log('Fixed Joanna deck UI');
} else {
    console.log('Not found UI string');
}
