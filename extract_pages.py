import pdfplumber
pdf_path = "/Users/thiagocarvalho/Documents/Board games/Duel for middle earth/The_Lord_of_the_Rings_Duel_for_Middle_earth_Solo_Variant.pdf"
with pdfplumber.open(pdf_path) as pdf:
    # Page 12 is index 11? Let's extract 7, 8, 9, 10
    for i in [6, 7, 8, 9, 10, 11]:
        if i < len(pdf.pages):
            page = pdf.pages[i]
            img = page.to_image(resolution=150)
            img.save(f"page_{i+1}.png")
