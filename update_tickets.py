import requests
import json
import re

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
list_id = "6a8f03d44d7de4aad6f8b2e9" # Design column

# 1. Read the artifact
with open('/Users/thiagocarvalho/.gemini/antigravity/brain/bb52ea51-7c64-49d6-9e79-7e657542b551/implementation_plan.md', 'r') as f:
    plan = f.read()

# Parse the plan into sections
sections = {}
current_bot = None
current_text = []

for line in plan.split('\n'):
    if line.startswith('## 1. Lord of the Rings'):
        current_bot = 'UI Revamp: Lord of the Rings Duel'
    elif line.startswith('## 2. 7 Wonders Duel'):
        if current_bot: sections[current_bot] = '\n'.join(current_text)
        current_bot = 'UI Revamp: 7 Wonders Duel'
        current_text = []
    elif line.startswith('## 3. Mystic Vale'):
        if current_bot: sections[current_bot] = '\n'.join(current_text)
        current_bot = 'UI Revamp: Mystic Vale'
        current_text = []
    elif line.startswith('## 4. Castles of Burgundy'):
        if current_bot: sections[current_bot] = '\n'.join(current_text)
        current_bot = 'UI Revamp: Castles of Burgundy'
        current_text = []
    elif line.startswith('## Action Items'):
        if current_bot: sections[current_bot] = '\n'.join(current_text)
        current_bot = None
    else:
        if current_bot:
            current_text.append(line)

# Also grab the action items
action_items = ""
ai_match = re.search(r'(## Action Items\n.*)', plan, flags=re.DOTALL)
if ai_match:
    action_items = "\n\n" + ai_match.group(1)

# 2. Get cards from Trello
resp = requests.get(f"https://api.trello.com/1/lists/{list_id}/cards?{auth}")
if resp.status_code == 200:
    cards = resp.json()
    for card in cards:
        name = card['name']
        if name in sections:
            new_desc = sections[name].strip() + action_items
            put_url = f"https://api.trello.com/1/cards/{card['id']}?{auth}"
            put_resp = requests.put(put_url, data={'desc': new_desc})
            if put_resp.status_code == 200:
                print(f"Updated description for {name}")
            else:
                print(f"Failed to update {name}: {put_resp.text}")
else:
    print(f"Failed to fetch cards: {resp.text}")

