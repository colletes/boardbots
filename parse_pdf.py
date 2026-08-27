import pdfplumber

pdf_path = "/Users/thiagocarvalho/Documents/Board games/Duel for middle earth/The_Lord_of_the_Rings_Duel_for_Middle_earth_Solo_Variant.pdf"
with pdfplumber.open(pdf_path) as pdf:
    # pages 7 to 10
    for i in range(6, 11):
        if i < len(pdf.pages):
            page = pdf.pages[i]
            text = page.extract_text()
            if text:
                print(f"--- PAGE {i+1} ---")
                print(text)
