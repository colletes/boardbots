import re

with open("bots/lotr_duel_bot_v1.html", "r") as f:
    html = f.read()

# Replace the div and its contents completely
pattern = re.compile(r'<div class="setup-desc" data-i18n-html="helpLeadersSummaryDesc">.*?</div>', re.DOTALL)
new_help = """<div class="leader-grid" id="helpLeadersContainer" style="margin-top: 12px; max-height: 400px; overflow-y: auto; padding-right: 8px;">
          <!-- dynamically populated by renderHelpLeaders() -->
        </div>"""

html = re.sub(pattern, new_help, html)

with open("bots/lotr_duel_bot_v1.html", "w") as f:
    f.write(html)
