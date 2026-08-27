with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Fix CSS
old_css = """    #dice-box {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 9999;
      pointer-events: none;
      display: none;
    }"""
new_css = """    #dice-box {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 9999;
      pointer-events: none;
      /* removed display: none so the canvas sizes correctly on init */
    }"""
html = html.replace(old_css, new_css)

# Fix JS displaying
old_js1 = "document.getElementById('dice-box').style.display = 'none';"
new_js1 = "// document.getElementById('dice-box').style.display = 'none';"
html = html.replace(old_js1, new_js1)

old_js2 = "document.getElementById('dice-box').style.display = 'block';"
new_js2 = "document.getElementById('dice-box').style.display = 'block';" # Actually we can just leave this or remove it, wait, it's not needed if we never set it to none, but let's just make it pointer-events: auto?
# Wait! We need pointer-events: none ALWAYS so it doesn't block the UI when not rolling!
# But when rolling, maybe pointer-events: none is fine!

# Let's completely remove the style.display changes
html = html.replace("document.getElementById('dice-box').style.display = 'block';", "")

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
