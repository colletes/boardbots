import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

render_old = """    function renderScienceChips() {
      const container = document.getElementById('scienceChips');
      container.innerHTML = '';
      const isPt = state.lang === 'pt';

      SCIENCE_TYPES.forEach(item => {
        const chip = document.createElement('button');
        const isActive = !!state.scienceSymbols[item.id];
        chip.className = `science-chip ${isActive ? 'active' : ''}`; chip.title = isPt ? item.tooltipPt : item.tooltipEn;
        chip.innerHTML = `<span>${item.icon}</span> <span>${isPt ? item.namePt : item.nameEn}</span>`;
        chip.onclick = () => toggleScienceSymbol(item.id);
        container.appendChild(chip);
      });

      const count = Object.values(state.scienceSymbols).filter(Boolean).length;
      document.getElementById('scienceCountBadge').textContent = `${count} / 6`;
    }

    function toggleScienceSymbol(symId) {
      state.scienceSymbols[symId] = !state.scienceSymbols[symId];
      renderScienceChips();
      updateRaceEffectsBox();
      checkSupremacy();
      saveState();
    }
    
    function updateRaceEffectsBox() {
      const box = document.getElementById('activeRaceEffects');
      const activeIds = Object.keys(state.scienceSymbols).filter(k => state.scienceSymbols[k]);
      if (activeIds.length === 0) {
        box.style.display = 'none';
        return;
      }
      box.style.display = 'block';
      const isPt = state.lang === 'pt';
      let html = '<ul style="margin:0; padding-left:16px;">';
      activeIds.forEach(id => {
        const item = SCIENCE_TYPES.find(x => x.id === id);
        if (item) {
          html += `<li><strong>${item.icon} ${isPt ? item.namePt : item.nameEn}:</strong> ${isPt ? item.tooltipPt : item.tooltipEn}</li>`;
        }
      });
      html += '</ul>';
      box.innerHTML = html;
    }"""

render_new = """    function renderScienceChips() {
      const container = document.getElementById('scienceChips');
      container.innerHTML = '';
      const isPt = state.lang === 'pt';

      SUPREMACY_SYMBOLS.forEach(item => {
        const chip = document.createElement('button');
        const isActive = !!state.scienceSymbols[item.id];
        chip.className = `science-chip ${isActive ? 'active' : ''}`;
        chip.innerHTML = `<span>${item.icon}</span> <span>${isPt ? item.namePt : item.nameEn}</span>`;
        chip.onclick = () => toggleScienceSymbol(item.id);
        container.appendChild(chip);
      });

      const count = Object.values(state.scienceSymbols).filter(Boolean).length;
      document.getElementById('scienceCountBadge').textContent = `${count} / 6`;
      
      // Also render alliance buttons
      renderAllianceButtons();
    }

    function toggleScienceSymbol(symId) {
      state.scienceSymbols[symId] = !state.scienceSymbols[symId];
      renderScienceChips();
      checkSupremacy();
      saveState();
    }
    
    function renderAllianceButtons() {
      const container = document.getElementById('allianceButtons');
      container.innerHTML = '';
      const isPt = state.lang === 'pt';
      
      ALLIANCE_TOKENS.forEach(item => {
        const chip = document.createElement('button');
        const isActive = (state.activeAllianceView === item.id);
        chip.className = `science-chip ${isActive ? 'active' : ''}`;
        chip.style.borderColor = isActive ? 'var(--accent)' : 'var(--border)';
        chip.innerHTML = `<span>${item.icon}</span> <span>${isPt ? item.namePt : item.nameEn}</span>`;
        chip.onclick = () => toggleAllianceView(item.id);
        container.appendChild(chip);
      });
      
      const box = document.getElementById('allianceEffectDetails');
      if (!state.activeAllianceView) {
        box.style.display = 'none';
      } else {
        box.style.display = 'block';
        const item = ALLIANCE_TOKENS.find(x => x.id === state.activeAllianceView);
        box.innerHTML = isPt ? item.htmlPt : item.htmlEn;
      }
    }
    
    function toggleAllianceView(id) {
      if (state.activeAllianceView === id) {
        state.activeAllianceView = null;
      } else {
        state.activeAllianceView = id;
      }
      renderAllianceButtons();
      saveState();
    }"""
html = html.replace(render_old, render_new)
with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
