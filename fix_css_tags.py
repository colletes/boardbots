with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Add missing tag colors for the priority pills
old_css = """    .tag-redpurple { background: linear-gradient(135deg, #ef4444, #a855f7); color: white; border:none; }
    .tag-green { background: #16a34a; color: white; border:none; }"""

new_css = """    .tag-redpurple { background: linear-gradient(135deg, #ef4444, #a855f7); color: white; border:none; }
    .tag-green { background: #16a34a; color: white; border:none; }
    .tag-red { background: #ef4444; color: white; border:none; }
    .tag-bluegreen { background: linear-gradient(135deg, #3b82f6, #16a34a); color: white; border:none; }
    .tag-bluered { background: linear-gradient(135deg, #3b82f6, #ef4444); color: white; border:none; }"""

html = html.replace(old_css, new_css)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
