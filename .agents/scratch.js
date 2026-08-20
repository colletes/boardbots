const fs = require('fs');

let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const oldShip = `.ships-container {
            display: flex; gap: 4px; flex: 1;
        }
        .ship-slot {
            width: 32px; height: 32px; border: 2px solid var(--sb-border); border-radius: 4px; background: rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
        }`;

const newShip = `.ships-container {
            display: flex; gap: 4px; flex: 1; flex-wrap: wrap;
        }
        .ship-slot {
            flex: 1; min-width: 24px; max-width: 32px; aspect-ratio: 1; border: 2px solid var(--sb-border); border-radius: 4px; background: rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
        }`;

if(html.includes(oldShip)) {
    html = html.replace(oldShip, newShip);
    fs.writeFileSync('bots/space_base_bot_v1.html', html);
    console.log('Fixed ships CSS');
} else {
    console.log('Ship CSS not found');
}
