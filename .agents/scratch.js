const fs = require('fs');
let js = fs.readFileSync('assets/site.js', 'utf8');

js = js.replace(
    'credit_burgundy: \'<strong>Castles of Burgundy</strong> — variante solo "AutoDuque" criada por um fã (LENS). Castles of Burgundy © Ravensburger.\',',
    'credit_burgundy: \'<strong>Castles of Burgundy</strong> — variante solo "AutoDuque" criada por um fã (LENS). Castles of Burgundy © Ravensburger.\',\n    credit_spacebase: \'<strong>Space Base</strong> — Automa "Joanna" é uma variante solo não-oficial de fã do BGG. Assistente de Ataque à Base inspirado nas regras solo. Space Base © AEG.\','
);

js = js.replace(
    'credit_burgundy: \'<strong>Castles of Burgundy</strong> — "AutoDuque" fan solo variant by LENS. Castles of Burgundy © Ravensburger.\',',
    'credit_burgundy: \'<strong>Castles of Burgundy</strong> — "AutoDuque" fan solo variant by LENS. Castles of Burgundy © Ravensburger.\',\n    credit_spacebase: \'<strong>Space Base</strong> — "Joanna" Automa is an unofficial fan solo variant from BGG. Base Attack assistant inspired by solo rules. Space Base © AEG.\','
);

fs.writeFileSync('assets/site.js', js);
console.log('Fixed credits');
