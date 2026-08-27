import requests

env_path = "/Users/thiagocarvalho/Documents/Board games/tools/trello.env"

with open(env_path, 'r') as f:
    lines = f.readlines()
    api_key = lines[1].strip()
    token = lines[7].strip()

auth = f"key={api_key}&token={token}"
card_id = "Q26obcwi"

comment = "Update: \n- Added a dynamic helper panel below the board in Lost Cities bot that updates in real-time.\n- It calculates exactly which cards the Automa wants from the Discard pile (based on the `value + 1` rule), so the user doesn't have to keep checking mentally.\n- If none of the specific cards are in the discard, the panel reinforces that the Automa draws from the Deck."

requests.post(f"https://api.trello.com/1/cards/{card_id}/actions/comments?{auth}", data={"text": comment})
