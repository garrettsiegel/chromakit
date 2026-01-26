# 📸 Screenshot Guide for ChromaKit README

## Quick Method (macOS Built-in)

### Option 1: Manual Screenshot (Recommended)

1. **Open the demo:** http://localhost:5173
2. **Position the page** to show the color picker prominently
3. **Press:** `Cmd + Shift + 4` then `Space`
4. **Click** on the browser window (captures full window with shadow)
5. **Save as:** `readme-screenshot.png` on Desktop

### Option 2: Screenshot Tool

1. **Press:** `Cmd + Shift + 5`
2. **Select:** "Capture Selected Window" or "Capture Selected Portion"
3. **Click Options** → Show Mouse Pointer (optional)
4. **Capture** the color picker in action

---

## What to Capture

### Ideal Screenshot Components:

✅ **Color Picker** - Fully visible with a vibrant color selected
✅ **Format Selector** - Show OKLCH, HEX, RGB options
✅ **Preview Swatch** - Large color preview visible
✅ **Preset Colors** - Show the preset groups dropdown
✅ **Clean Background** - Minimal distractions

### Good Examples:

- Color picker with purple/pink gradient selected
- OKLCH format visible in input
- Preset groups dropdown showing "Material" or "Tailwind"
- Recent colors bar populated

### Avoid:

❌ Entire webpage with too much white space
❌ Color picker too small to see details
❌ Busy background that distracts from picker
❌ Default/boring colors (use vibrant ones!)

---

## Dimensions

**Ideal Size:**

- **Width:** 1200-2400px (for high-DPI displays)
- **Aspect Ratio:** ~2:1 or 16:9
- **Format:** PNG (for transparency) or JPG (smaller file size)

**For README:**

- Will be displayed at 100% container width
- Should be readable at 800px width
- Text in screenshot should be at least 14px

---

## Styling Tips

### Before Capturing:

1. **Zoom browser** to 150-200% for crisper text
2. **Select vibrant color:** Try `#FF6B9D` or `#8B5CF6`
3. **Open preset dropdown** to show options
4. **Enable dark mode** (if available) for modern look
5. **Clear console** (if dev tools visible)

### Browser Setup:

- Hide bookmarks bar
- Hide unnecessary extensions
- Full screen or minimal UI
- Light or dark theme (match your brand)

---

## Processing After Capture

### If screenshot is too large:

```bash
# Resize to 2400px wide (maintains aspect ratio)
sips -Z 2400 readme-screenshot.png

# Or use ImageOptim to compress
# Download from: https://imageoptim.com/
```

### Add annotations (optional):

- Use Figma, Photoshop, or Sketch
- Add arrows pointing to key features
- Highlight the OKLCH capability
- Add text: "Perceptually Uniform Colors"

---

## Quick Capture Script

Run this after taking screenshot:

```bash
# Move from Desktop to project root
mv ~/Desktop/readme-screenshot.png ./readme-screenshot.png

# Optimize size
sips -Z 2000 readme-screenshot.png

# Update README
# (Replace og-image.png with readme-screenshot.png in README.md)
```

---

## Alternative: Professional Screenshot

If you want a more polished look:

### Using browser screenshot extensions:

1. **Awesome Screenshot** (Chrome/Firefox)
2. **Nimbus Screenshot** (Chrome)
3. **Fireshot** (Firefox)

Benefits:

- Captures full-page or selected area
- Built-in annotation tools
- Better quality than OS screenshot

### Using design tools:

1. **Figma** - Design a mockup with screenshot
2. **Canva** - Add text overlays and effects
3. **Photopea** (free online) - Edit and enhance

---

## What Makes a Great README Screenshot?

✨ **Shows the product in action**
✨ **Highlights unique features** (OKLCH!)
✨ **High quality** (crisp, clear text)
✨ **Good contrast** (easy to see)
✨ **Vibrant colors** (catches attention)
✨ **Proper sizing** (not too large/small)

---

Ready to capture? Follow Option 1 above and let me know when you have the file!
