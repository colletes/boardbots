import requests
import json

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
list_id = "6a8f03d44d7de4aad6f8b2e9" # Design column

bots = [
    {"name": "UI Revamp: Lord of the Rings Duel", "desc": "Retheme the lotr_duel_bot_v1.html bot. Use earthy tones, gold, crimson, fantasy serifs (Cinzel/Georgia), and parchment backgrounds. Ensure standard Boardbots shell is present."},
    {"name": "UI Revamp: 7 Wonders Duel", "desc": "Retheme the 7_wonders_duel_bot_v1.html bot. Use marble white, bronze, and categorical game colors (civic blue, military red, etc). Use Roman serifs and pillar/wreath motifs. Ensure standard Boardbots shell is present."},
    {"name": "UI Revamp: Mystic Vale", "desc": "Retheme the Mystic_Vale_bot_v03.html bot. Use forest greens, mystical glowing cyan, earthy browns. Use organic fonts (Nunito/Lora) and glowing auras for magic effects. Ensure standard Boardbots shell is present."},
    {"name": "UI Revamp: Castles of Burgundy", "desc": "Retheme the burgundy_bot_v1.html bot. Use elegant medieval palette (faded green, royal blue, beige). Heavily feature Hexagons for layout/buttons, and use classic old-style serifs. Ensure standard Boardbots shell is present."}
]

for bot in bots:
    url = f"https://api.trello.com/1/cards?idList={list_id}&name={requests.utils.quote(bot['name'])}&desc={requests.utils.quote(bot['desc'])}&{auth}"
    resp = requests.post(url)
    if resp.status_code == 200:
        print(f"Created ticket: {bot['name']}")
    else:
        print(f"Failed to create {bot['name']}: {resp.text}")
