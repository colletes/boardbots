with open('assets/site.js', 'r', encoding='utf-8') as f:
    site_js = f.read()
import re
match = re.search(r'function applyI18n.*?\n}', site_js, flags=re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
