
const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('bots/thunder_road_vendetta_bot.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: 'dangerously' });
const window = dom.window;
const document = window.document;

// Test drawing SDBR card and rendering
window.initDeck('sdbr');
window.drawNextCard();
window.renderSdbr();
console.log('SDBR rendered without error! Board content length:', document.getElementById('bots-board').innerHTML.length);
window.nextStep();
window.renderSdbr();
console.log('Next step SDBR rendered successfully!');
