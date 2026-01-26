#!/bin/bash

# 📸 Screenshot Helper Script for ChromaKit
# Run this after you take your screenshot

echo "🎨 ChromaKit Screenshot Helper"
echo "================================"
echo ""

# Check if screenshot exists on Desktop
if [ -f ~/Desktop/Screenshot*.png ]; then
    latest_screenshot=$(ls -t ~/Desktop/Screenshot*.png | head -1)
    echo "✅ Found screenshot: $latest_screenshot"
    echo ""
    
    # Ask user to confirm
    read -p "Move this to project as readme-screenshot.png? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Copy to project root
        cp "$latest_screenshot" ./readme-screenshot.png
        echo "✅ Copied to ./readme-screenshot.png"
        
        # Optimize size
        echo "🔧 Optimizing size..."
        sips -Z 2000 readme-screenshot.png > /dev/null 2>&1
        
        # Get file size
        size=$(du -h readme-screenshot.png | cut -f1)
        dimensions=$(sips -g pixelWidth -g pixelHeight readme-screenshot.png | grep -E "pixelWidth|pixelHeight" | awk '{print $2}' | tr '\n' 'x' | sed 's/x$//')
        
        echo "✅ Optimized! Size: $size, Dimensions: $dimensions"
        echo ""
        echo "📝 Next steps:"
        echo "1. Check the screenshot: open readme-screenshot.png"
        echo "2. If good, I'll update README.md to use it"
        echo "3. Delete og-image.png if you prefer the new one"
        echo ""
        
        # Ask if they want to update README
        read -p "Update README.md to use readme-screenshot.png? (y/n) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Update README (this will be done by user via the assistant)
            echo "✅ Ready to update README!"
            echo "Tell me: 'update readme to use readme-screenshot.png'"
        fi
    fi
else
    echo "❌ No screenshot found on Desktop"
    echo ""
    echo "📸 To take a screenshot:"
    echo "1. Press: Cmd + Shift + 4, then Space"
    echo "2. Click on the browser window"
    echo "3. Screenshot will save to Desktop"
    echo "4. Run this script again"
fi

echo ""
echo "💡 Tips for a great screenshot:"
echo "   • Zoom browser to 150-200%"
echo "   • Select a vibrant color (#FF6B9D or #8B5CF6)"
echo "   • Show preset groups dropdown"
echo "   • Make sure OKLCH is visible"
echo ""
