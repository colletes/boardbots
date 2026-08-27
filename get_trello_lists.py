import os
import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
board_id = "98ErrGT4"

resp = requests.get(f"https://api.trello.com/1/boards/{board_id}/lists?{auth}")
if resp.status_code == 200:
    for lst in resp.json():
        print(f"List: {lst['name']} - ID: {lst['id']}")
else:
    print(f"Error: {resp.status_code}")
