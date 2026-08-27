import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
card_id = "Q26obcwi"

comment = "Update: \n- Added the Help Modal overlay to the Lost Cities bot.\n- Included explicit rules explaining that the automa draws from the deck, UNLESS there is a card in the discard pile that is exactly one value higher than its current highest card in that color, in which case it draws from the discard."

requests.post(f"https://api.trello.com/1/cards/{card_id}/actions/comments?{auth}", data={"text": comment})
