import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# I18N updates
i18n_old_pt = """panelScienceTitle: 'Símbolos de Raça',"""
i18n_new_pt = """panelSupremacyTitle: 'Supremacia (Símbolos)',
        panelSupremacyDesc: 'Marque os símbolos de raça presentes nas cartas do bot.',
        panelAllianceTitle: 'Fichas de Aliança (Lembretes)',
        panelAllianceDesc: 'Clique em uma Raça para ver suas regras passivas.',"""
html = html.replace(i18n_old_pt, i18n_new_pt)

i18n_old_en = """panelScienceTitle: 'Race Symbols',"""
i18n_new_en = """panelSupremacyTitle: 'Supremacy (Symbols)',
        panelSupremacyDesc: 'Mark the race symbols present on the bot\\'s cards.',
        panelAllianceTitle: 'Alliance Tokens (Reminders)',
        panelAllianceDesc: 'Click a Race to see its passive rules.',"""
html = html.replace(i18n_old_en, i18n_new_en)

# State update
state_old = """      scienceSymbols: { elves:false, dwarves:false, hobbit:false, humans:false, ents:false, wizards:false }"""
state_new = """      scienceSymbols: { elves:false, dwarves:false, hobbit:false, humans:false, ents:false, wizards:false, eagle:false },
      activeAllianceView: null"""
html = html.replace(state_old, state_new)

state_legacy = """if (!state.scienceSymbols) state.scienceSymbols = { elves:false, dwarves:false, hobbit:false, humans:false, ents:false, wizards:false };"""
state_legacy_new = """if (!state.scienceSymbols) state.scienceSymbols = { elves:false, dwarves:false, hobbit:false, humans:false, ents:false, wizards:false, eagle:false };
      if (state.scienceSymbols.eagle === undefined) state.scienceSymbols.eagle = false;
      state.activeAllianceView = null;"""
html = html.replace(state_legacy, state_legacy_new)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
