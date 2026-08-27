import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract the Lost Cities block
# The block starts with "<!-- Lost Cities -->" and ends with the closing "</div>" of "game-card-wrap"
pattern = r'(        <!-- Lost Cities -->.*?        </div>\n)'
match = re.search(pattern, content, flags=re.DOTALL)
if match:
    lost_cities_block = match.group(1)
    
    # Remove from original location
    content = content.replace(lost_cities_block, '')
    
    # Add alpha badge
    # find <img ...></div> and change to <img ...><span class="badge-alpha">ALPHA</span></div>
    img_pattern = r'(<img[^>]+>)(</div>)'
    lost_cities_block = re.sub(img_pattern, r'\1<span class="badge-alpha">ALPHA</span>\2', lost_cities_block)
    
    # 2. Insert into Alpha section. 
    # Lord of the rings, 7 wonders, burgundy, heroscape, memoir 44... 
    # Let's insert it before Memoir '44
    if "<!-- Memoir '44 -->" in content:
        content = content.replace("<!-- Memoir '44 -->", lost_cities_block + "        <!-- Memoir '44 -->")
    else:
        # Fallback: just append before the closing of the alpha games-grid
        # But Memoir '44 should be there.
        print("Memoir 44 not found")

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Moved Lost Cities to Alpha")
else:
    print("Lost Cities block not found")

