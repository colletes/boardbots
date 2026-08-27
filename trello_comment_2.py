import os
import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
card_id = "Q26obcwi"

comment = "Update: \n- Added the standard UI/UX shell to the Lost Cities bot (Help button, Reset Game button, Credits footer, Buy Me A Coffee button, and Home button).\n- Maintained the custom Lost Cities color theming and visual elements while incorporating the standard shell.\n- Updated the boardbot-creator skill to make this UI standard structure explicit for all future bots."

resp = requests.post(f"https://api.trello.com/1/cards/{card_id}/actions/comments?{auth}", data={"text": comment})
print(f"Add comment status: {resp.status_code}")
