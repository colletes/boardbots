const fs = require('fs');

function addSpaceBaseLogs() {
    let html = fs.readFileSync('bots/space_base_bot_v1.html', 'utf8');

    html = html.replace('function changeVP(amt) {', 'function changeVP(amt) { logEvent("changeVP called with amt=" + amt);');
    html = html.replace('window.nextJoannaTurn = function(skipRoll = false) {', 'window.nextJoannaTurn = function(skipRoll = false) { logEvent("nextJoannaTurn called. skipRoll=" + skipRoll + " Deck:" + automaDeck.length + " Discard:" + automaDiscard.length);');
    html = html.replace('const cardIndex = automaDeck.pop();', 'const cardIndex = automaDeck.pop(); logEvent("Drew Joanna card index " + cardIndex);');
    html = html.replace('window.baseAttackTurn = function(tier) {', 'window.baseAttackTurn = function(tier) { logEvent("baseAttackTurn called. tier=" + tier + " AttackDeck:" + attackDeck.length);');
    html = html.replace('function updateSetupUI() {', 'function updateSetupUI() { logEvent("updateSetupUI called. Mode=" + document.getElementById("gameMode").value);');

    fs.writeFileSync('bots/space_base_bot_v1.html', html);
    console.log('Space Base game logs added');
}

function addBurgundyLogs() {
    let html = fs.readFileSync('bots/burgundy_bot_v1.html', 'utf8');

    html = html.replace('function updateUI() {', 'function updateUI() { logEvent("updateUI - Phase:" + currentPhase + " Round:" + currentRound + " Turn:" + currentTurn + " VP:" + botVP + " Silver:" + botSilver + " Workers:" + botWorkers);');
    html = html.replace('window.setupFoundCastle = function(color) {', 'window.setupFoundCastle = function(color) { logEvent("setupFoundCastle called with color " + color);');
    html = html.replace('window.adjustCounter = function(type, amt) {', 'window.adjustCounter = function(type, amt) { logEvent("adjustCounter called. type=" + type + " amt=" + amt);');
    html = html.replace('window.buyBlackMarket = function() {', 'window.buyBlackMarket = function() { logEvent("buyBlackMarket called");');
    html = html.replace('window.endGame = function() {', 'window.endGame = function() { logEvent("endGame called. VP=" + botVP);');

    fs.writeFileSync('bots/burgundy_bot_v1.html', html);
    console.log('Burgundy game logs added');
}

addSpaceBaseLogs();
addBurgundyLogs();
