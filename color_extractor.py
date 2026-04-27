import re
import base64
from io import BytesIO
from PIL import Image
import collections

with open('/home/thimisul/DEV/frontend/bookingArea/public/logo.svg', 'r') as f:
    content = f.read()

# Find base64 string
match = re.search(r'data:image/png;base64,([^"]+)', content)
if not match:
    print("No base64 found")
    exit(1)

img_data = base64.b64decode(match.group(1))
img = Image.open(BytesIO(img_data))
img = img.convert('RGBA')

# Get colors
colors = img.getcolors(maxcolors=1000000)
# Filter out mostly transparent colors and white/black if they are just background, but let's just sort by count
valid_colors = []
for count, (r, g, b, a) in colors:
    if a > 50: # Only relatively opaque pixels
        valid_colors.append((count, (r, g, b)))

valid_colors.sort(reverse=True, key=lambda x: x[0])

# Group similar colors to find dominant hues
def hex_color(c):
    return '#{:02x}{:02x}{:02x}'.format(*c)

print("Top 10 raw colors by pixel count:")
for count, c in valid_colors[:10]:
    print(f"{hex_color(c)} : {count}")
