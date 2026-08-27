import cv2
import numpy as np
import os

out_dir_leaders = "/Users/thiagocarvalho/Documents/Board games/boardbots/assets/art/lotr_duel/leaders"

img = cv2.imread("/Users/thiagocarvalho/.gemini/antigravity/brain/9bb515cf-d170-4f64-ac03-e0a0ccc44e12/scratch/page9_raw.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# The background is white. Let's invert so cards are white, bg is black
_, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    if w > 200 and h > 200:
        boxes.append((x, y, w, h))

# Sort boxes: top-to-bottom, left-to-right
boxes.sort(key=lambda b: (b[1] // 200, b[0]))

print(f"Found {len(boxes)} cards")
for i, (x, y, w, h) in enumerate(boxes):
    print(f"Card {i}: x={x}, y={y}, w={w}, h={h}")

