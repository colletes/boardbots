with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

old_css = """    .leader-thumb {
      width: 58px;
      height: 74px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border);
      flex-shrink: 0;
      background: var(--bg-1);
    }"""

new_css = """    .leader-thumb {
      width: 58px;
      height: 74px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border);
      flex-shrink: 0;
      background: var(--bg-1);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      z-index: 1;
      transform-origin: left center;
    }
    .leader-thumb:hover {
      transform: scale(3.5);
      z-index: 100;
      box-shadow: 0 8px 24px rgba(0,0,0,0.8);
    }"""

html = html.replace(old_css, new_css)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
