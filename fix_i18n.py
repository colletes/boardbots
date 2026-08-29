import re

with open('bots/lostcities.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any duplicated heroTitle injections
content = re.sub(r'(heroTitle:.*?\n\s+heroSubtitle:.*?\n\s+)+', r'\1', content)

with open('bots/lostcities.html', 'w', encoding='utf-8') as f:
    f.write(content)

