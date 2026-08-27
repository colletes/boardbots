import os
import requests

with open('tools/trello.env', 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[3].strip()

# Board ID: 98ErrGT4
url = f"https://api.trello.com/1/boards/98ErrGT4/cards?key={api_key}&token={token}"
response = requests.get(url)
for card in response.json():
    print(f"{card['id']} - {card['name']} (List: {card['idList']})")
