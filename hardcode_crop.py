from PIL import Image
import os

out_dir_leaders = "/Users/thiagocarvalho/Documents/Board games/boardbots/assets/art/lotr_duel/leaders"

leaders = [
    "witchking", "galadriel", "tombombadil",
    "saruman", "elrond", "smaug",
    "sauron", "gandalf", "eowynsstew"
]

img = Image.open("/Users/thiagocarvalho/.gemini/antigravity/brain/9bb515cf-d170-4f64-ac03-e0a0ccc44e12/scratch/page9_raw.png").convert('RGB')
x0, y0 = 225, 192
card_w = 2031 / 3.0
card_h = 3126 / 3.0

idx = 0
for r in range(3):
    for c in range(3):
        name = leaders[idx]
        x_start = int(x0 + c * card_w)
        y_start = int(y0 + r * card_h)
        x_end = int(x0 + (c+1) * card_w)
        y_end = int(y0 + (r+1) * card_h)
        
        # Apply a 2% inner trim to remove the black border / gap
        trim_x = int(card_w * 0.02)
        trim_y = int(card_h * 0.02)
        
        card = img.crop((x_start + trim_x, y_start + trim_y, x_end - trim_x, y_end - trim_y))
        card.save(f"{out_dir_leaders}/{name}.webp", "webp", quality=88)
        idx += 1

print("Leaders cropped perfectly.")
