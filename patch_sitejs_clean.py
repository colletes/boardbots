with open('assets/site.js', 'r', encoding='utf-8') as f:
    site_js = f.read()

parts = site_js.split('game_memoir44_title: "Memoir \'44",')

pt_string = """    game_lostcities_title: "Lost Cities",
    game_lostcities_desc: '"The Rival Explorer" — Automa inteligente que decide sozinho se joga, substitui ou descarta a carta.',
    credit_lostcities: '<strong>Lost Cities</strong> — Regras da variante "Rival Explorer" originais. Lost Cities criado por Reiner Knizia, © KOSMOS.',
"""

en_string = """    game_lostcities_title: "Lost Cities",
    game_lostcities_desc: '"The Rival Explorer" — Smart automa that decides whether to play, replace, or discard.',
    credit_lostcities: '<strong>Lost Cities</strong> — "Rival Explorer" variant rules original. Lost Cities designed by Reiner Knizia, © KOSMOS.',
"""

if len(parts) == 3:
    new_js = parts[0] + pt_string + '    game_memoir44_title: "Memoir \'44",' + parts[1] + en_string + '    game_memoir44_title: "Memoir \'44",' + parts[2]
    with open('assets/site.js', 'w', encoding='utf-8') as f:
        f.write(new_js)
    print("Patched site.js cleanly")
else:
    print("Could not split site.js properly")
