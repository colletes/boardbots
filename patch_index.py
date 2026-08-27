import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

lost_cities_block = """
        <!-- Lost Cities -->
        <div class="game-card-wrap">
            <a class="game-card" href="bots/lostcities.html">
                <div class="game-art" style="background-image:url('assets/art/lostcities.webp')"><img src="assets/art/lostcities.webp" alt="Lost Cities box art" loading="lazy"></div>
                <div class="game-card-body">
                    <h3 data-i18n="game_lostcities_title">Lost Cities</h3>
                    <p data-i18n="game_lostcities_desc">"The Rival Explorer" — Automa inteligente que decide sozinho se joga, substitui ou descarta a carta.</p>
                    <span class="play-btn"><span data-i18n="play_btn">Jogar</span> <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
                </div>
            </a>
            <div class="game-card-actions" data-bot="lostcities">
                <button class="vote-btn like" data-i18n-aria="vote_like_aria" aria-label="Gostei"><svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v11H4a1 1 0 01-1-1v-9a1 1 0 011-1h3Zm0 0 4.5-8a2 2 0 013.7 1.3L14.5 8H19a2 2 0 012 2.3l-1.4 8A2 2 0 0117.6 20H7"/></svg><span class="like-count">–</span></button>
                <button class="vote-btn dislike" data-i18n-aria="vote_dislike_aria" aria-label="Não gostei"><svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3Zm0 0-4.5 8a2 2 0 0 1-3.7-1.3L9.5 16H5a2 2 0 0 1-2-2.3l1.4-8A2 2 0 0 1 6.4 4H17"/></svg><span class="dislike-count">–</span></button>
            </div>
        </div>
"""

# Insert before Memoir '44 or at a suitable place
if "<!-- Memoir '44 -->" in content:
    content = content.replace("<!-- Memoir '44 -->", lost_cities_block + "\n        <!-- Memoir '44 -->")
elif "<!-- Mystic Vale -->" in content:
    content = content.replace("<!-- Mystic Vale -->", lost_cities_block + "\n        <!-- Mystic Vale -->")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated index.html")

# Update site.js
with open('assets/site.js', 'r', encoding='utf-8') as f:
    site_js = f.read()

# I need to insert i18n keys for game_lostcities_title and game_lostcities_desc in both PT and EN
# Let's just append to the end of the PT and EN objects, or just do it via replace.
# Actually, it's safer to just let the bot's own page handle its i18n, but index.html uses site.js.
# Let's write a simple patch for site.js
if "game_lostcities_title" not in site_js:
    # PT
    site_js = site_js.replace(
        "game_memoir_title: \"Memoir '44\",",
        "game_lostcities_title: \"Lost Cities\",\n    game_lostcities_desc: \"'The Rival Explorer' — Automa inteligente que decide sozinho se joga, substitui ou descarta a carta.\",\n    game_memoir_title: \"Memoir '44\","
    )
    # EN
    site_js = site_js.replace(
        "game_memoir_title: \"Memoir '44\",",
        "game_lostcities_title: \"Lost Cities\",\n    game_lostcities_desc: \"'The Rival Explorer' — Smart automa that decides whether to play, replace, or discard.\",\n    game_memoir_title: \"Memoir '44\","
    )
    with open('assets/site.js', 'w', encoding='utf-8') as f:
        f.write(site_js)
    print("Updated site.js")
