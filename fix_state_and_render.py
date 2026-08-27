import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix 1: Add a migration/failsafe to loadState
old_load_state = """    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          state = { ...state, ...parsed };
        }"""
new_load_state = """    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          state = { ...state, ...parsed };
          
          // Failsafe: if loaded deck has old 7 Wonders tags, invalidate it
          if (state.deck && state.deck.some(c => c.priority && (c.priority.includes('science') || c.priority.includes('military') || !c.repeat))) {
             console.warn('Found outdated deck schema in storage. Invalidating state.');
             state.inGame = false;
             state.deck = [];
             state.currentCard = null;
          }
          if (state.currentCard && state.currentCard.priority && (state.currentCard.priority.includes('science') || state.currentCard.priority.includes('military') || !state.currentCard.repeat)) {
             state.inGame = false;
             state.currentCard = null;
          }
        }"""
html = html.replace(old_load_state, new_load_state)

# Fix 2: Call displayActiveCard in showGameScreen so it restores on reload
old_show_game = """      document.getElementById('activeLeaderDetails').textContent = `${isPt ? leader.colorNamePt : leader.colorNameEn}`;
      document.getElementById('activeLeaderEffect').textContent = `⚡ ${isPt ? leader.powerPt : leader.powerEn}`;

      updateUI();
    }"""
new_show_game = """      document.getElementById('activeLeaderDetails').textContent = `${isPt ? leader.colorNamePt : leader.colorNameEn}`;
      document.getElementById('activeLeaderEffect').textContent = `⚡ ${isPt ? leader.powerPt : leader.powerEn}`;

      updateUI();
      if (state.currentCard) {
        displayActiveCard(state.currentCard);
      } else {
        document.getElementById('flipBtn').style.display = 'inline-flex';
        document.getElementById('resolveBtn').style.display = 'none';
        document.getElementById('priorityList').innerHTML = '';
        document.getElementById('decisionCardImg').src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // empty
      }
    }"""
html = html.replace(old_show_game, new_show_game)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
