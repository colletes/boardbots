const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });

// Wait a bit for DOMContentLoaded to fire in JSDOM
setTimeout(() => {
    const window = dom.window;
    const document = window.document;

    const input = document.getElementById('gameSearchInput');
    if (!input) {
        console.log("Input not found");
        return;
    }

    console.log("Initial count of visible wrappers:", document.querySelectorAll('.game-card-wrap').length);
    console.log("Initial display of first wrap:", document.querySelector('.game-card-wrap').style.display);
    
    // Simulate typing
    input.value = "stone";
    const event = new window.Event('input');
    input.dispatchEvent(event);

    console.log("After 'stone', first wrap display:", document.querySelector('.game-card-wrap').style.display);
    console.log("After 'stone', Hoth wrap display:", document.querySelectorAll('.game-card-wrap')[1].style.display);
    
}, 100);
