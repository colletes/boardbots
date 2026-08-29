import os
import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
card_id = "Q26obcwi"

comment = "Update: \n- The bot has been marked as ALPHA on the index page and placed in the 'Em Teste (Alpha)' section.\n- The boardbot-creator skill was updated to make this Alpha placement mandatory for all new bots.\n- Fixed i18n bugs preventing the Lost Cities index card and the internal app from translating to English."

resp = requests.post(f"https://api.trello.com/1/cards/{card_id}/actions/comments?{auth}", data={"text": comment})
print(f"Add comment status: {resp.status_code}")
