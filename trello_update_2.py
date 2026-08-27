import os
import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
card_id = "Q26obcwi"

# Update Checklist
resp = requests.get(f"https://api.trello.com/1/cards/{card_id}/checklists?{auth}")
if resp.status_code == 200:
    checklists = resp.json()
    for cl in checklists:
        if "desenvolvimento" in cl['name'].lower() or "etapas" in cl['name'].lower():
            for item in cl['checkItems']:
                requests.put(f"https://api.trello.com/1/cards/{card_id}/checkItem/{item['id']}?{auth}", data={"state": "complete"})
                print(f"Checked item '{item['name']}'")

# Move to Revisão e QA
qa_list_id = "6a8f03d44d7de4aad6f8b2ec"
resp = requests.put(f"https://api.trello.com/1/cards/{card_id}?{auth}", data={"idList": qa_list_id})
print(f"Move list status: {resp.status_code}")

