import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

hero_html = """
    <div class="hero">
        <img src="../assets/art/lostcities.webp" alt="Lost Cities box art">
        <div class="hero-content">
            <h1><span data-i18n="heroTitle">The Rival Explorer</span></h1>
            <div class="subtitle" data-i18n="heroSubtitle">Lost Cities — Automa</div>
        </div>
    </div>
"""

content = content.replace('<div class="setup-screen" id="setupScreen">', hero_html + '\n<div class="setup-screen" id="setupScreen">')

# Also remove the old title inside the setup screen since we now have a hero banner
content = re.sub(r'<h1 data-i18n="lc_title">.*?</h1>', '', content)
content = re.sub(r'<p data-i18n="lc_subtitle".*?</p>', '', content)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

