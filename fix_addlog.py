import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_addLog = """    function addLog(msg) {
      if (msg.type === 'generic') { state.logs.unshift(msg); if (state.logs.length > 25) state.logs.pop(); renderLogs(); return; }
      state.logs.unshift(msg);
      if (state.logs.length > 25) state.logs.pop();
      renderLogs();
    }"""

new_addLog = """    function addLog(msg) {
      if (msg.type === 'generic') { state.logs.unshift(msg); if (state.logs.length > 25) state.logs.pop(); renderLogs(); saveState(); return; }
      state.logs.unshift(msg);
      if (state.logs.length > 25) state.logs.pop();
      renderLogs();
      saveState();
    }"""

html = html.replace(old_addLog, new_addLog)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
