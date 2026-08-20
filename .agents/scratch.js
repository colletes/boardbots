const fs = require('fs');
let html = fs.readFileSync('bots/burgundy_bot_v1.html', 'utf8');

// Replace pt
html = html.replace(/um hexágono de castelo cinza\?/g, 'um hexágono de castelo verde-escuro/vermelho?');
html = html.replace(/hexágono cinza \(topo-direito\)/g, 'hexágono verde-escuro/vermelho (topo-direito)');

// Replace en
html = html.replace(/a light green castle hex\?/g, 'a dark green/red castle hex?');
html = html.replace(/The gray hex \(top-right\)/g, 'The dark green/red hex (top-right)');

fs.writeFileSync('bots/burgundy_bot_v1.html', html);
console.log('Fixed color descriptions');
