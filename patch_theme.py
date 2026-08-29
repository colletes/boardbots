import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS Variables
new_vars = """
:root {
  --bg-color: #1a1410;
  --panel-bg: rgba(43, 31, 23, 0.95);
  --text-main: #f5eedc;
  --text-muted: #c4b59d;
  --accent: #d99a38;
  --accent-hover: #b87d25;
  
  --c-yellow: #eab308;
  --c-blue: #3b82f6;
  --c-white: #e2e8f0;
  --c-green: #22c55e;
  --c-red: #ef4444;
}

body {
  background-color: var(--bg-color);
  background-image: radial-gradient(circle at center, rgba(145,100,50,0.15) 0%, rgba(20,15,10,0.8) 100%),
                    repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
"""

content = re.sub(r':root \{.*?\n\}[\s\n]*body \{.*?\n\}', new_vars.strip(), content, flags=re.DOTALL)

# 2. Hero CSS
hero_css = """
.hero {
    position:relative; border-radius:12px; overflow:hidden;
    margin: 20px auto; max-width: 600px; width: calc(100% - 40px);
    border:2px solid rgba(217,154,56,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.hero img { width:100%; height:160px; object-fit:cover; display:block; filter:saturate(1.2) brightness(0.85); object-position: 50% 20%; }
.hero::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg, rgba(26,20,16,0.1), rgba(26,20,16,0.95)); }
.hero-content { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:18px 22px; z-index: 10; }
.hero h1 { font-family:'Poppins', sans-serif; font-weight:800; letter-spacing:1px; margin:0; font-size:2.2em; color:#f5eedc; text-shadow:2px 2px 8px rgba(0,0,0,0.8); }
.hero .subtitle { color:var(--accent); font-size:0.95em; letter-spacing:2px; margin-top:2px; font-weight:700; text-transform:uppercase; text-shadow:1px 1px 4px rgba(0,0,0,0.8); }

.setup-card { border: 1px solid rgba(217,154,56,0.15); box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
.game-screen .setup-card { max-width: 600px; margin: 0 auto; }
.start-btn { box-shadow: 0 4px 12px rgba(217,154,56,0.3); transition: transform 0.2s; }
.start-btn:active { transform: scale(0.96); }
"""

content = content.replace("</style>", hero_css + "\n</style>")

# 3. Hero HTML
hero_html = """
    <div class="hero">
        <img src="../assets/art/lostcities.webp" alt="Lost Cities box art">
        <div class="hero-content">
            <h1><span data-i18n="heroTitle">The Rival Explorer</span></h1>
            <div class="subtitle" data-i18n="heroSubtitle">Lost Cities — Automa</div>
        </div>
    </div>
"""

content = content.replace('<div class="setup-screen">', hero_html + '\n<div class="setup-screen">')

# 4. I18N
pt_hero = 'heroTitle: "The Rival Explorer",\n    heroSubtitle: "Lost Cities — Automa",'
en_hero = 'heroTitle: "The Rival Explorer",\n    heroSubtitle: "Lost Cities — Automa",'

content = content.replace('helpRulesTitle:', pt_hero + '\n    helpRulesTitle:')
content = content.replace('helpRulesTitle:', en_hero + '\n    helpRulesTitle:') # this will replace both, let me fix it via a better strategy

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

