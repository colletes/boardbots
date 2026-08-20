const fs = require('fs');

let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

const oldCreditPT = `creditsText: 'Space Base Bot desenvolvido com ❤️ por Thiago Colletes.',`;
const newCreditPT = `creditsText: 'Space Base Bot desenvolvido com ❤️ por Thiago Colletes. Automa "Joanna" é uma variante solo de fã do BGG.',`;

const oldCreditEN = `creditsText: 'Space Base Bot developed with ❤️ by Thiago Colletes.',`;
const newCreditEN = `creditsText: 'Space Base Bot developed with ❤️ by Thiago Colletes. "Joanna" Automa is a fan solo variant from BGG.',`;

html = html.replace(oldCreditPT, newCreditPT).replace(oldCreditEN, newCreditEN);

// Also replace the HTML fallback text
const oldFallback = `<p data-i18n="creditsText">Space Base Bot desenvolvido com ❤️ por Thiago Colletes.</p>`;
const newFallback = `<p data-i18n="creditsText">Space Base Bot desenvolvido com ❤️ por Thiago Colletes. Automa "Joanna" é uma variante solo de fã do BGG.</p>`;

html = html.replace(oldFallback, newFallback);

fs.writeFileSync('bots/space_base_bot_v1.html', html);
console.log('Fixed credits');
