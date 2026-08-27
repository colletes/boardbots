with open('assets/site.js', 'r', encoding='utf-8') as f:
    site_js = f.read()

# PT
if "game_lostcities_title:" not in site_js:
    site_js = site_js.replace(
        "game_memoir44_title: \"Memoir '44\",",
        "game_lostcities_title: \"Lost Cities\",\n    game_lostcities_desc: '\"The Rival Explorer\" — Automa inteligente que decide sozinho se joga, substitui ou descarta a carta.',\n    credit_lostcities: '<strong>Lost Cities</strong> — Regras da variante \"Rival Explorer\" originais. Lost Cities criado por Reiner Knizia, © KOSMOS.',\n    game_memoir44_title: \"Memoir '44\","
    )
    # EN (in the second block)
    # To replace the second occurrence, we can find the EN block, which starts with en: {
    # It's easier to split
    parts = site_js.split('game_memoir44_title: "Memoir \'44",')
    if len(parts) == 3:
        # parts[0] is before PT, parts[1] is between PT and EN, parts[2] is after EN
        site_js = parts[0] + "game_lostcities_title: \"Lost Cities\",\n    game_lostcities_desc: '\"The Rival Explorer\" — Smart automa that decides whether to play, replace, or discard.',\n    credit_lostcities: '<strong>Lost Cities</strong> — \"Rival Explorer\" variant rules original. Lost Cities designed by Reiner Knizia, © KOSMOS.',\n    game_memoir44_title: \"Memoir '44\"," + parts[1] + "game_lostcities_title: \"Lost Cities\",\n    game_lostcities_desc: '\"The Rival Explorer\" — Smart automa that decides whether to play, replace, or discard.',\n    credit_lostcities: '<strong>Lost Cities</strong> — \"Rival Explorer\" variant rules original. Lost Cities designed by Reiner Knizia, © KOSMOS.',\n    game_memoir44_title: \"Memoir '44\"," + parts[2]

with open('assets/site.js', 'w', encoding='utf-8') as f:
    f.write(site_js)
print("Updated site.js")
