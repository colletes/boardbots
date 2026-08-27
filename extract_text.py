import fitz

doc = fitz.open("/Users/thiagocarvalho/Documents/Board games/Duel for middle earth/The_Lord_of_the_Rings_Duel_for_Middle_earth_Solo_Variant.pdf")
for i in range(8):
    print(f"--- PAGE {i+1} ---")
    print(doc[i].get_text())

